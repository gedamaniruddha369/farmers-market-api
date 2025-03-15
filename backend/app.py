from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pandas as pd
import numpy as np
from werkzeug.utils import secure_filename
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# MongoDB connection
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/farmers_market')
client = MongoClient(mongo_uri)
db = client.farmers_market
markets = db.markets

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
    zip_code = request.args.get('zip_code')
    state = request.args.get('state')
    
    query = {}
    if zip_code:
        query['address.zipCode'] = zip_code
    if state:
        query['address.state'] = state.upper()
    
    market_list = list(markets.find(query, {'_id': 0}))
    return jsonify(market_list)

@app.route('/api/markets/search', methods=['GET'])
def search_markets():
    """Search markets by coordinates within a radius"""
    try:
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
        
        market_list = list(markets.find(query, {'_id': 0}))
        return jsonify(market_list)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid coordinates or radius'}), 400

@app.route('/api/markets/<market_id>', methods=['GET'])
def get_market(market_id):
    """Get a specific market by ID"""
    market = markets.find_one({'id': market_id}, {'_id': 0})
    if market:
        return jsonify(market)
    return jsonify({'error': 'Market not found'}), 404

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # In production, debug should be False
    debug = os.environ.get('FLASK_ENV') == 'development'
    # Host 0.0.0.0 allows external access
    app.run(host='0.0.0.0', port=port, debug=debug) 