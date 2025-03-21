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
    
    # Create indexes for better search performance
    markets = db.markets
    try:
        # Create text index for search
        markets.create_index([("Name", "text"), ("Address", "text")])
        # Create index for state queries
        markets.create_index("state")
        # Create index for USDA listing ID
        # Use a more specific name to avoid conflicts
        markets.create_index("usda_listing_id", name="usda_listing_id_index")
        # Create geospatial index
        markets.create_index([("longitude", 1), ("latitude", 1)])
    except Exception as e:
        # Log the error but continue, as the application can still function
        # with existing indexes
        print(f"Warning: Error creating indexes: {str(e)}")
    
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
        'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
        'PR': 'Puerto Rico',
        'VI': 'Virgin Islands'
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
    address_clean = re.sub(r'\s+', ' ', address).strip()
    
    # *** SPECIAL CASES FIRST ***
    # Handle Massachusetts special case (multiple spellings)
    address_upper = address_clean.upper()
    if ', MASSACHUSSETTS' in address_upper or ', MASSACHUSETTS' in address_upper:
        return 'MA'
    
    # Handle Wisconsin special case
    if re.search(r'\b(WI|WISC|WISCONSIN)\b', address_upper):
        return 'WI'
    
    # Handle Puerto Rico special case
    if 'PUERTO RICO' in address_upper:
        return 'PR'
    
    # Handle Virgin Islands special case
    if 'VIRGIN ISLANDS' in address_upper or ', VI' in address_upper:
        return 'VI'
    
    # *** STANDARD PATTERN MATCHING ***
    # Look for state abbreviation followed by zip code (most common format)
    state_zip_match = re.search(r'[,\s]+([A-Z]{2})[,\s]*\d{5}', address_upper)
    if state_zip_match:
        state_abbr = state_zip_match.group(1)
        if state_abbr in state_mapping:
            return state_abbr
    
    # Look for state abbreviation at end of string or followed by comma
    state_end_match = re.search(r'[,\s]+([A-Z]{2})(\s*$|,)', address_upper)
    if state_end_match:
        state_abbr = state_end_match.group(1)
        if state_abbr in state_mapping:
            return state_abbr
    
    # Look for full state names
    for state_abbr, state_name in state_mapping.items():
        if state_name.upper() in address_upper:
            return state_abbr
    
    # Fallback for abbreviations
    for state_abbr in state_mapping.keys():
        if f', {state_abbr}' in address_upper or f' {state_abbr} ' in address_upper:
            return state_abbr
    
    return None

def extract_place_id(google_maps_link):
    """Extract place_id and image URL from Google Maps link"""
    if not google_maps_link:
        return None, None
        
    # Try to extract place_id from the URL
    place_id_match = re.search(r'place/([^/]+)', google_maps_link)
    if place_id_match:
        place_id = place_id_match.group(1)
        # Generate a static image URL that doesn't require API key
        image_url = f"https://maps.googleapis.com/maps/api/streetview?size=600x300&location=place_id:{place_id}&key={os.getenv('GOOGLE_MAPS_API_KEY', '')}"
        return place_id, image_url
    
    # If no place_id found, try to get the CID
    cid_match = re.search(r'cid=(\d+)', google_maps_link)
    if cid_match:
        cid = cid_match.group(1)
        # Return a CID-based identifier and no image (fallback images don't work with CID)
        return f"cid:{cid_match.group(1)}", None
        
    return None, None

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
                
                # Check for both possible address field names
                address = market.get('Address', market.get('Market_Address', ''))
                if not address:
                    errors.append(f"Market {market_id} has no Address or Market_Address field")
                    continue
                
                if not isinstance(address, str):
                    errors.append(f"Market {market_id} has non-string Address: {type(address)}")
                    continue
                    
                state = extract_state(address)
                update_dict = {}
                
                if state:
                    update_dict['state'] = state
                    state_counts[state] = state_counts.get(state, 0) + 1
                
                # Extract place_id if available
                google_maps_link = market.get('google_maps_link')
                if google_maps_link:
                    place_id, image_url = extract_place_id(google_maps_link)
                    if place_id:
                        update_dict['place_id'] = place_id
                        if image_url:
                            update_dict['image_url'] = image_url
                
                if update_dict:
                    updates.append(
                        UpdateOne(
                            {'_id': market_id},
                            {'$set': update_dict}
                        )
                    )
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
                # Create indexes
                markets.create_index('state', background=True)
                markets.create_index('place_id', background=True)
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
        db = get_db()
        
        # Parse pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        state = request.args.get('state')
        
        # Calculate skip value for pagination
        skip = (page - 1) * per_page
        
        # Build filter
        filter_query = {}
        if state:
            filter_query['state'] = state.upper()
        
        # Get total count for pagination
        total_markets = db.markets.count_documents(filter_query)
        
        # Get markets with pagination
        markets = list(db.markets.find(
            filter_query,
            {
                '_id': 0,
                'market_name': 1,
                'market_address': 1,
                'state': 1,
                'zipCode': 1,
                'latitude': 1,
                'longitude': 1,
                'phone_number': 1,
                'website': 1,
                'USDA_listing_id': 1,
                'rating': 1,
                'google_maps_link': 1,
                'image_url': 1
            }
        ).skip(skip).limit(per_page))
        
        # For markets without an image_url but with a google_maps_link, generate a fallback image URL
        for market in markets:
            if not market.get('image_url') and market.get('google_maps_link'):
                _, image_url = extract_place_id(market['google_maps_link'])
                if image_url:
                    market['image_url'] = image_url
        
        return jsonify({
            'markets': markets,
            'total': total_markets,
            'page': page,
            'per_page': per_page,
            'total_pages': math.ceil(total_markets / per_page)
        })
    except Exception as e:
        print(f"Error in /api/markets: {str(e)}")
        sys.stdout.flush()
        return jsonify({'error': str(e)}), 500

@api.route('/markets/search', methods=['GET'])
def search_markets():
    """Search markets with location-based support"""
    try:
        query = request.args.get('q', '').lower()
        state = request.args.get('state')
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', type=float, default=50)  # Default 50 miles radius
        
        db = get_db()
        markets = db.markets
        
        # Build search query
        search_query = {}
        
        # Handle location-based search - only apply if both lat and lng are provided
        if lat is not None and lng is not None:
            try:
                # Convert radius from miles to meters (1 mile = 1609.34 meters)
                radius_meters = radius * 1609.34
                
                # Add geospatial query
                search_query['location'] = {
                    '$near': {
                        '$geometry': {
                            'type': 'Point',
                            'coordinates': [lng, lat]
                        },
                        '$maxDistance': radius_meters
                    }
                }
            except Exception as loc_error:
                print(f"Error with geospatial query: {str(loc_error)}")
                # Don't add location query if there was an error
                pass
        
        # Handle text search
        if query:
            search_query['$text'] = {'$search': query}
        
        # Handle state filter
        if state:
            search_query['state'] = state.upper()
        
        # Execute search
        results = list(markets.find(search_query))
        
        # Process results
        processed_results = []
        for market in results:
            market['_id'] = str(market['_id'])
            processed_results.append(market)
        
        return jsonify({
            'success': True,
            'count': len(processed_results),
            'markets': processed_results
        })
        
    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400  # Return 400 for client errors

@api.route('/markets/state-counts', methods=['GET'])
def get_state_counts():
    """Get the count of markets by state"""
    try:
        db = get_db()
        pipeline = [
            # First try to group by state if it exists
            {'$group': {'_id': '$state', 'count': {'$sum': 1}}}
        ]
        state_counts = list(db.markets.aggregate(pipeline))
        
        # If we have no results with state fields or only null state values,
        # try to extract states from Market_Address field and count those
        if not state_counts or (len(state_counts) == 1 and state_counts[0]['_id'] is None):
            print("No state fields found, attempting to extract from addresses", file=sys.stderr)
            
            # First update all market records with state information
            # This is similar to the update_states endpoint but simplified
            updated_count = 0
            markets = list(db.markets.find({}))
            updates = []
            
            for market in markets:
                if not isinstance(market, dict):
                    continue
                    
                # Check for both possible address field names
                address = market.get('Address', market.get('Market_Address', ''))
                if not address or not isinstance(address, str):
                    continue
                    
                state = extract_state(address)
                if state:
                    updates.append(
                        UpdateOne(
                            {'_id': market.get('_id')},
                            {'$set': {'state': state}}
                        )
                    )
            
            if updates:
                result = db.markets.bulk_write(updates)
                updated_count = result.modified_count
                print(f"Updated {updated_count} markets with state information", file=sys.stderr)
                
                # Now try the aggregation again
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

@api.route('/markets/<string:id>', methods=['GET'])
def get_market_by_id(id):
    """Get market details by ID"""
    try:
        db = get_db()
        
        # Try to find the market by ID first
        market = None
        
        # Check if the ID is a valid ObjectId
        try:
            from bson.objectid import ObjectId
            if ObjectId.is_valid(id):
                market = db.markets.find_one({"_id": ObjectId(id)})
        except Exception:
            # If there's an error with ObjectId, continue with other lookup methods
            pass
            
        # If not found by ObjectId, try looking up by the usda_listing_id or other fields
        if not market:
            market = db.markets.find_one({"usda_listing_id": id})
            
        # If still not found, try any other identifier that might be stored
        if not market:
            market = db.markets.find_one({"id": id})
            
        if not market:
            return jsonify({"success": False, "error": "Market not found"}), 404
        
        # Convert ObjectId to string for JSON serialization
        market["_id"] = str(market["_id"])
        
        return jsonify({
            "success": True,
            "market": market
        })
    except Exception as e:
        print(f"Error in get_market_by_id: {str(e)}", file=sys.stderr)
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to retrieve market details. Please try again later."
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