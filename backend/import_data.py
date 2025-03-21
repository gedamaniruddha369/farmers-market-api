import pandas as pd
import numpy as np
from pymongo import MongoClient, GEOSPHERE
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# CSV file path
CSV_PATH = r"C:\Users\Administrator\Documents\Farmers market\backend\uploads\farmers_market.csv"

# MongoDB connection
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/farmers_market')
client = MongoClient(mongo_uri)
db = client.farmers_market
markets = db.markets

def parse_address(address):
    """Parse address string into components"""
    try:
        # Basic address parsing - can be enhanced based on address formats
        parts = address.split(',')
        street = parts[0].strip()
        city = parts[1].strip() if len(parts) > 1 else None
        
        # Handle state and zip
        if len(parts) > 2:
            state_zip = parts[2].strip().split()
            state = state_zip[0] if state_zip else None
            zip_code = state_zip[1] if len(state_zip) > 1 else None
        else:
            state = None
            zip_code = None
            
        return {
            'street': street,
            'city': city,
            'state': state,
            'zipCode': zip_code,
            'full': address
        }
    except:
        return {'full': address}

def clean_and_transform_data(df):
    """Clean and transform the dataframe for MongoDB import"""
    # Replace NaN and 'None' strings with None
    df = df.replace({np.nan: None, 'None': None, '': None})
    
    # Convert update_time to datetime
    def parse_datetime(value):
        if pd.isna(value) or value is None or value == 'None' or value == '':
            return None
        try:
            dt = pd.to_datetime(value, format='%d-%m-%Y %H:%M', errors='coerce')
            return dt.isoformat() if pd.notnull(dt) else None
        except:
            return None
            
    df['update_time'] = df['update_time'].apply(parse_datetime)
    
    # Clean coordinate data
    def clean_coordinate(value):
        if pd.isna(value) or value is None or value == 'None' or value == '':
            return None
        try:
            val = float(str(value).replace(',', ''))
            return val if np.isfinite(val) else None
        except (ValueError, TypeError):
            return None
    
    df['location_x'] = df['location_x'].apply(clean_coordinate)
    df['location_y'] = df['location_y'].apply(clean_coordinate)
    
    # Create GeoJSON location field
    df['location'] = df.apply(
        lambda row: {
            'type': 'Point',
            'coordinates': [row['location_x'], row['location_y']]
        } if row['location_x'] is not None and row['location_y'] is not None and 
           np.isfinite(row['location_x']) and np.isfinite(row['location_y']) else None,
        axis=1
    )
    
    # Parse addresses
    df['address'] = df['location_address'].apply(parse_address)
    
    # Convert to dictionary records
    records = df.to_dict('records')
    
    # Clean up records
    cleaned_records = []
    for record in records:
        # Skip records with invalid locations
        if record.get('location') and not all(np.isfinite(x) for x in record['location']['coordinates']):
            continue
            
        # Remove original lat/long fields
        record.pop('location_x', None)
        record.pop('location_y', None)
        record.pop('location_address', None)
        
        # Convert listing_id to string for consistency
        record['id'] = str(record['listing_id'])
        record.pop('listing_id', None)
        
        # Remove any None values to keep documents clean
        record = {k: v for k, v in record.items() if v is not None}
        cleaned_records.append(record)
    
    return cleaned_records

def import_data(csv_path):
    """Import data from CSV to MongoDB"""
    try:
        # Read CSV file
        df = pd.read_csv(csv_path)
        
        # Clean and transform data
        records = clean_and_transform_data(df)
        
        # Drop existing collection
        markets.drop()
        
        # Create indexes
        try:
            # Create geospatial index
            markets.create_index([("location", GEOSPHERE)])
            
            # Create text index for searching
            markets.create_index([
                ("listing_name", "text"),
                ("listing_desc", "text")
            ])
            
            # Create index for common queries
            markets.create_index("id", unique=True, name="id_unique_index")
            markets.create_index("address.state")
            markets.create_index("address.zipCode")
        except Exception as e:
            print(f"Warning: Error creating indexes: {str(e)}")
        
        # Insert records
        if records:
            markets.insert_many(records)
            print(f"Successfully imported {len(records)} records")
            
    except Exception as e:
        print(f"Error importing data: {str(e)}")

if __name__ == "__main__":
    import_data(CSV_PATH) 