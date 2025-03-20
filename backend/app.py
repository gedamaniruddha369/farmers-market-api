from flask import Flask, request, jsonify, render_template, Blueprint
from flask_cors import CORS
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
import os
import pandas as pd
import numpy as np
from werkzeug.utils import secure_filename
import json
import math
import sys
import re

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://planetwiseliving.com",
        "https://www.planetwiseliving.com",
        "https://farmers-market-api.onrender.com"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

# Create API blueprint
api = Blueprint('api', __name__, url_prefix='/api')

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

def extract_state(address):
    """Extract state from address string"""
    # State abbreviations and full names mapping
    state_mapping = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
        'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
        'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
        'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
        'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
        'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
        'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
        'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
        'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
        'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
        'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
    }
    
    # Create reverse mapping (full name to abbreviation)
    reverse_mapping = {v.lower(): k for k, v in state_mapping.items()}
    
    if not address:
        return None
    
    # Convert address to string if it's not already
    if not isinstance(address, str):
        address = str(address)
    
    # Normalize the address
    address = address.replace('.', '')  # Remove periods
    address = re.sub(r'\s+', ' ', address)  # Normalize whitespace
    address = address.strip()
    
    # Try to find state abbreviation followed by zip code (most common format)
    state_abbr_match = re.search(r'[,\s]+([A-Z]{2})[\s,]*\d', address)
    if state_abbr_match:
        state_abbr = state_abbr_match.group(1)
        if state_abbr in state_mapping:
            return state_abbr
    
    # Try to find state name in "City, State ZIP" format
    state_match = re.search(r'[,\s]+([^,\d]+?)(?:\s+\d|\s*,|\s*$)', address)
    if state_match:
        state_name = state_match.group(1).strip().lower()
        if state_name in reverse_mapping:
            return reverse_mapping[state_name]
    
    # Try to find state abbreviation anywhere in the address
    for abbr in state_mapping.keys():
        pattern = fr'[,\s]+{abbr}(?:[,\s]+|$)'
        if re.search(pattern, address):
            return abbr
    
    # Try to find full state name anywhere in address
    for state_name in state_mapping.values():
        pattern = fr'[,\s]+{state_name}(?:[,\s]+|$)'
        if re.search(pattern, address, re.IGNORECASE):
            return reverse_mapping[state_name.lower()]
    
    # Try to find state abbreviation at the end of the address
    state_end_match = re.search(r'[,\s]+([A-Z]{2})(?:\s+|$)', address)
    if state_end_match:
        state_abbr = state_end_match.group(1)
        if state_abbr in state_mapping:
            return state_abbr
    
    return None

@app.route('/update-states', methods=['POST'])
def update_states():
    """Temporary endpoint to update state fields"""
    try:
        db = get_db()
        markets = db.markets
        
        # Get all markets
        all_markets = list(markets.find({}))
        updates = []
        state_counts = {}
        errors = []
        
        print(f"Processing {len(all_markets)} markets...")
        sys.stdout.flush()  # Ensure print is flushed to logs
        
        for i, market in enumerate(all_markets):
            try:
                if not isinstance(market, dict):
                    errors.append(f"Market at index {i} is not a dictionary: {type(market)}")
                    continue
                
                market_id = market.get('_id')
                if not market_id:
                    errors.append(f"Market at index {i} has no _id field")
                    continue
                
                address = market.get('Address', '')
                if not address:
                    errors.append(f"Market {market_id} has no Address field")
                    continue
                
                if not isinstance(address, str):
                    errors.append(f"Market {market_id} has non-string Address: {type(address)}")
                    continue
                    
                state = extract_state(address)
                if state:
                    updates.append(
                        UpdateOne(
                            {'_id': market_id},  # ObjectId is fine here for querying
                            {'$set': {'state': state}}
                        )
                    )
                    state_counts[state] = state_counts.get(state, 0) + 1
                else:
                    errors.append(f"Could not extract state from address: {address}")
            except Exception as e:
                errors.append(f"Error processing market {market.get('_id', 'unknown')}: {str(e)}")
                print(f"Error processing market: {str(e)}")
                sys.stdout.flush()
        
        print(f"Found {len(updates)} markets to update")
        print(f"Found {len(errors)} errors")
        sys.stdout.flush()
        
        if updates:
            try:
                result = markets.bulk_write(updates)
                # Create index on state field if it doesn't exist
                markets.create_index('state', background=True)
                return jsonify({
                    'success': True,
                    'message': f'Updated {result.modified_count} markets with state information',
                    'state_counts': state_counts,
                    'total_markets': len(all_markets),
                    'total_updates': len(updates),
                    'errors': errors[:100] if errors else []  # Return first 100 errors if any
                })
            except Exception as e:
                print(f"Error during bulk write: {str(e)}")
                sys.stdout.flush()
                return jsonify({
                    'success': False,
                    'error': f'Error during bulk write: {str(e)}',
                    'state_counts': state_counts,
                    'total_markets': len(all_markets),
                    'total_updates': len(updates),
                    'errors': errors[:100] if errors else []
                }), 500
        else:
            return jsonify({
                'success': True,
                'message': 'No updates needed',
                'total_markets': len(all_markets),
                'errors': errors[:100] if errors else []  # Return first 100 errors if any
            })
            
    except Exception as e:
        error_msg = f"Error updating state fields: {str(e)}"
        print(error_msg, file=sys.stderr)
        sys.stderr.flush()
        return jsonify({
            'success': False,
            'error': error_msg
        }), 500

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

@api.route('/markets', methods=['GET'])
def get_markets():
    """Get all markets with pagination"""
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        state = request.args.get('state')
        
        # Get database connection
        db = get_db()
        
        # Build query
        query = {}
        if state:
            query['state'] = state
        
        # Calculate skip value for pagination
        skip = (page - 1) * per_page
        
        # Get total count of documents
        total_markets = db.markets.count_documents(query)
        
        # Get paginated markets
        markets = list(db.markets.find(query).skip(skip).limit(per_page))
        
        # Convert ObjectId to string for JSON serialization
        for market in markets:
            market['_id'] = str(market['_id'])
        
        return jsonify({
            'success': True,
            'markets': markets,
            'pagination': {
                'total': total_markets,
                'page': page,
                'per_page': per_page,
                'total_pages': math.ceil(total_markets / per_page)
            }
        })
        
    except Exception as e:
        print(f"Error in get_markets: {str(e)}", file=sys.stderr)
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to load markets. Please try again later.'
        }), 500

@api.route('/markets/search', methods=['GET'])
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

@api.route('/markets/state-counts', methods=['GET'])
def get_state_counts():
    """Get the count of markets by state"""
    try:
        db = get_db()
        pipeline = [
            {'$group': {'_id': '$state', 'count': {'$sum': 1}}}
        ]
        state_counts = list(db.markets.aggregate(pipeline))
        
        return jsonify({
            'success': True,
            'data': state_counts
        })
        
    except Exception as e:
        print(f"Error in get_state_counts: {str(e)}", file=sys.stderr)
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to load state counts. Please try again later.'
        }), 500

@app.route('/test-connection', methods=['GET'])
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

@app.route('/debug', methods=['GET'])
def debug_info():
    """Return debug information about the application"""
    try:
        db = get_db()
        markets = db.markets
        
        # Test MongoDB connection
        total_markets = markets.count_documents({})
        
        # Get environment variables
        env_vars = {
            'MONGODB_URI': os.getenv('MONGODB_URI', 'Not set'),
            'PORT': os.getenv('PORT', 'Not set'),
            'FLASK_ENV': os.getenv('FLASK_ENV', 'Not set'),
            'PYTHONPATH': os.getenv('PYTHONPATH', 'Not set'),
        }
        
        # Get sample data
        sample_data = []
        for market in markets.find().limit(2):
            market['_id'] = str(market['_id'])
            sample_data.append(market)
        
        # Directory structure
        dirs = os.listdir('.')
        parent_dir = os.listdir('..')
        
        # Python path
        python_path = sys.path
        
        return jsonify({
            'app_info': {
                'name': 'Farmers Market API',
                'version': '1.0.0'
            },
            'database': {
                'connection': 'success',
                'total_markets': total_markets,
                'sample_data': sample_data
            },
            'environment': env_vars,
            'file_system': {
                'current_dir': dirs,
                'parent_dir': parent_dir,
                'python_path': python_path,
                'current_working_dir': os.getcwd()
            }
        })
    except Exception as e:
        import traceback
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/debug/connection', methods=['GET'])
def debug_connection():
    """Debug endpoint to test database connection"""
    try:
        # Get database connection
        db = get_db()
        
        # Test the connection
        db.command('ping')
        
        # Get database stats
        stats = db.command('dbStats')
        
        # Get collection stats
        markets_stats = db.command('collStats', 'markets')
        
        return jsonify({
            'success': True,
            'message': 'Database connection successful',
            'database_stats': {
                'collections': stats['collections'],
                'objects': stats['objects'],
                'dataSize': stats['dataSize']
            },
            'markets_collection': {
                'count': markets_stats['count'],
                'size': markets_stats['size']
            },
            'mongodb_uri': os.getenv('MONGODB_URI', 'Not set')
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'mongodb_uri': os.getenv('MONGODB_URI', 'Not set')
        }), 500

@app.route('/debug/markets/sample', methods=['GET'])
def debug_markets_sample():
    """Debug endpoint to get a sample of markets data"""
    try:
        db = get_db()
        sample = list(db.markets.find().limit(1))
        
        if sample:
            # Convert ObjectId to string
            sample[0]['_id'] = str(sample[0]['_id'])
            return jsonify({
                'success': True,
                'sample': sample[0],
                'collection_exists': True
            })
        else:
            return jsonify({
                'success': False,
                'message': 'No markets found in database',
                'collection_exists': db.list_collection_names().count('markets') > 0
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Register the blueprint
app.register_blueprint(api)

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # In production, debug should be False
    debug = os.environ.get('FLASK_ENV') == 'development'
    # Host 0.0.0.0 allows external access
    app.run(host='0.0.0.0', port=port, debug=debug) 