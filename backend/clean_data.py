import pandas as pd
from pymongo import MongoClient, GEOSPHERE
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set the absolute path to the CSV file
CSV_PATH = r"C:\Users\Administrator\Documents\Farmers market\backend\uploads\farmers_market.csv"

def prepare_data():
    try:
        # Read the CSV file using absolute path
        print(f"Reading CSV from: {CSV_PATH}")
        df = pd.read_csv(CSV_PATH)
        print(f"Found {len(df)} rows in CSV")
        print("Columns in CSV:", list(df.columns))
        
        # Convert latitude and longitude to float
        df[' longitude'] = pd.to_numeric(df[' longitude'], errors='coerce')
        df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce')
        
        # Create location field for MongoDB (required for geospatial queries)
        df['location'] = df.apply(
            lambda row: {
                'type': 'Point',
                'coordinates': [float(row[' longitude']), float(row['latitude'])]
            } if pd.notnull(row[' longitude']) and pd.notnull(row['latitude']) else None,
            axis=1
        )
        
        # Convert DataFrame to list of dictionaries
        markets = df.to_dict('records')
        print(f"Prepared {len(markets)} markets for import")
        return markets
        
    except Exception as e:
        print(f"Error preparing data: {str(e)}")
        return None

def import_to_mongodb():
    try:
        # Get MongoDB Atlas connection string from environment variable
        MONGODB_URI = os.getenv('MONGODB_URI')
        if not MONGODB_URI:
            raise ValueError("Please set MONGODB_URI in your .env file")
            
        # Connect to MongoDB Atlas
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(MONGODB_URI)
        db = client['farmers_market']
        collection = db['markets']
        
        # Drop existing collection
        collection.drop()
        print("Dropped existing collection")
        
        # Get prepared data
        markets = prepare_data()
        
        # Insert data
        if markets:
            collection.insert_many(markets)
            
            # Create geospatial index for location-based searches
            collection.create_index([("location", GEOSPHERE)])
            print(f"Successfully imported {len(markets)} markets to MongoDB Atlas")
        else:
            print("No data to import")
            
    except Exception as e:
        print(f"Error importing to MongoDB: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    import_to_mongodb() 