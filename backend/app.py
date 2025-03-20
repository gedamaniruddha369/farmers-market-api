from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pandas as pd
import numpy as np
from werkzeug.utils import secure_filename
import json
import math

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://planetwiseliving.com",
    "https://www.planetwiseliving.com"
]}})  # Enable CORS for specific origins

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_db():
    """Get MongoDB connection and database"""
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/farmers_market')
    client = MongoClient(mongo_uri)
    db = client.farmers_market
    return db

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_data(df):
    """Clean DataFrame by handling NaN values and converting data types"""
    # Replace NaN values with None (which becomes null in JSON)
    df = df.replace({np.nan: None})
    
    # Convert boolean columns
    for col in df.select_dtypes(include=['bool']).columns:
        df[col] = df[col].astype(str)
    
    # Convert datetime columns to ISO format strings
    for col in df.select_dtypes(include=['datetime64']).columns:
        df[col] = df[col].dt.strftime('%Y-%m-%dT%H:%M:%S')
    
    return df

class CustomJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle special data types"""
    def default(self, obj):
        if isinstance(obj, (np.integer, np.floating)):
            if math.isnan(obj):
                return None
            return float(obj) if isinstance(obj, np.floating) else int(obj)
        elif isinstance(obj, np.bool_):
            return bool(obj)
        elif isinstance(obj, pd.Timestamp):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')
        return super().default(obj)

app.json_encoder = CustomJSONEncoder

@app.route('/')
def upload_form():
    """Render the upload form"""
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and CSV processing"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Read CSV file
            df = pd.read_csv(filepath)
            
            # Clean the data
            df = clean_data(df)
            
            # Convert to records and handle NaN values
            sample_data = df.head(5).to_dict('records')
            
            # Get basic information about the CSV
            info = {
                'columns': list(df.columns),
                'num_rows': len(df),
                'sample_data': sample_data
            }
            
            return jsonify(info)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/markets', methods=['GET'])
def get_markets():
    """Get all markets or filter by location"""
    try:
        db = get_db()
        markets = db.markets
        
        zip_code = request.args.get('zip_code')
        state = request.args.get('state')
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        radius = float(request.args.get('radius', 10))  # Default 10 miles
        page = int(request.args.get('page', 1))  # Default to page 1
        per_page = int(request.args.get('per_page', 12))  # Default 12 items per page
        
        print(f"Searching with state: {state}, zip: {zip_code}, lat: {lat}, lng: {lng}, radius: {radius}, page: {page}")
        
        query = {}
        
        # Build the query based on parameters
        if state:
            query['Address'] = {'$regex': f', {state.upper()}[ ,]', '$options': 'i'}
        
        if zip_code:
            zip_query = {'Address': {'$regex': zip_code, '$options': 'i'}}
            if 'Address' in query:
                # If we already have a state filter, use $and to combine them
                query = {'$and': [query, zip_query]}
            else:
                query = zip_query
        
        if lat and lng:
            try:
                lat = float(lat)
                lng = float(lng)
                # Add geospatial query
                geo_query = {
                    'location': {
                        '$near': {
                            '$geometry': {
                                'type': 'Point',
                                'coordinates': [lng, lat]
                            },
                            '$maxDistance': radius * 1609.34  # Convert miles to meters
                        }
                    }
                }
                if query:
                    # Combine with existing query
                    query = {'$and': [query, geo_query]}
                else:
                    query = geo_query
            except ValueError:
                return jsonify({'error': 'Invalid coordinates'}), 400
        
        print(f"MongoDB query: {query}")
        
        # Get total count for the query
        total_markets = markets.count_documents(query)
        print(f"Total markets matching query: {total_markets}")
        
        # Calculate pagination
        skip = (page - 1) * per_page
        
        # Now perform the search with pagination
        market_list = list(markets.find(query).skip(skip).limit(per_page))
        print(f"Found {len(market_list)} markets for current page")
        
        # Convert ObjectId to string and handle NaN values
        for market in market_list:
            market['_id'] = str(market['_id'])
            # Convert NaN values to None (null in JSON)
            for key, value in market.items():
                if isinstance(value, float) and math.isnan(value):
                    market[key] = None
        
        # Return response with pagination metadata
        return jsonify({
            'markets': market_list,
            'total': total_markets,
            'page': page,
            'per_page': per_page,
            'total_pages': math.ceil(total_markets / per_page)
        })
        
    except Exception as e:
        print(f"Error in get_markets: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Error searching markets',
            'details': str(e)
        }), 500

@app.route('/api/markets/search', methods=['GET'])
def search_markets():
    """Search markets by coordinates within a radius"""
    try:
        db = get_db()
        markets = db.markets
        
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        radius = float(request.args.get('radius', 10))  # Default 10 miles
        
        # MongoDB geospatial query
        query = {
            'location': {
                '$near': {
                    '$geometry': {
                        'type': 'Point',
                        'coordinates': [lng, lat]
                    },
                    '$maxDistance': radius * 1609.34  # Convert miles to meters
                }
            }
        }
        
        market_list = list(markets.find(query))
        # Convert ObjectId to string for JSON serialization
        for market in market_list:
            market['_id'] = str(market['_id'])
        return jsonify(market_list)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid coordinates or radius'}), 400

@app.route('/api/markets/<market_id>', methods=['GET'])
def get_market(market_id):
    """Get a specific market by ID"""
    try:
        db = get_db()
        markets = db.markets
        market = markets.find_one({'id': market_id}, {'_id': 0})
        if market:
            return jsonify(market)
        return jsonify({'error': 'Market not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test-connection', methods=['GET'])
def test_connection():
    """Test MongoDB connection and return basic stats"""
    try:
        db = get_db()
        markets = db.markets
        # Test MongoDB connection
        total_markets = markets.count_documents({})
        sample_market = markets.find_one()
        if sample_market:
            sample_market['_id'] = str(sample_market['_id'])
        
        return jsonify({
            'status': 'connected',
            'total_markets': total_markets,
            'sample_market': sample_market,
            'database_name': db.name,
            'collection_name': markets.name
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/markets/state-counts', methods=['GET'])
def get_state_counts():
    """Get count of markets for each state"""
    try:
        db = get_db()
        markets = db.markets
        
        # First, get total count of all markets
        total_count = markets.count_documents({})
        print(f"\nTotal markets in database: {total_count}")
        
        # Get a sample of raw data to inspect
        sample_markets = list(markets.find({}, {'Address': 1}).limit(5))
        print("\nSample market addresses:")
        for market in sample_markets:
            print(f"Address: {market.get('Address', 'No Address')}")
        
        # Pipeline to extract state from Address and group by state
        pipeline = [
            {
                '$match': {
                    'Address': { '$exists': True, '$ne': '' }
                }
            },
            {
                '$addFields': {
                    'address_parts': {
                        '$split': [
                            {
                                '$trim': {
                                    'input': { '$ifNull': ['$Address', ''] },
                                    'chars': ' '
                                }
                            },
                            ','
                        ]
                    }
                }
            },
            {
                '$addFields': {
                    'parts_count': { '$size': '$address_parts' }
                }
            },
            {
                '$addFields': {
                    'state': {
                        '$trim': {
                            'input': {
                                '$cond': {
                                    'if': { '$gt': ['$parts_count', 2] },
                                    'then': { '$arrayElemAt': ['$address_parts', -2] },
                                    'else': { '$arrayElemAt': ['$address_parts', -1] }
                                }
                            },
                            'chars': ' '
                        }
                    }
                }
            },
            {
                '$match': {
                    'state': { '$ne': '' }
                }
            },
            {
                '$group': {
                    '_id': '$state',
                    'count': { '$sum': 1 }
                }
            },
            {
                '$sort': { '_id': 1 }
            }
        ]
        
        # Execute pipeline and get results
        state_counts = list(markets.aggregate(pipeline))
        
        # Calculate total markets found in state counts
        total_in_states = sum(s['count'] for s in state_counts)
        print(f"Total markets found in state counts: {total_in_states}")
        print(f"Difference from total: {total_count - total_in_states}")
        
        # Print state-by-state breakdown
        print("\nState-by-state breakdown:")
        for state in state_counts:
            print(f"{state['_id']}: {state['count']} markets")
        
        return jsonify(state_counts)
    except Exception as e:
        print(f"Error in get_state_counts: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Error getting state counts',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # In production, debug should be False
    debug = os.environ.get('FLASK_ENV') == 'development'
    # Host 0.0.0.0 allows external access
    app.run(host='0.0.0.0', port=port, debug=debug) 