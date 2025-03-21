import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

def verify_mongodb_connection():
    try:
        # Use MongoDB Atlas connection string
        mongo_uri = os.getenv('MONGODB_URI')
        if not mongo_uri:
            print("Error: MONGODB_URI not found in environment variables")
            return False
            
        client = MongoClient(mongo_uri)
        # The ismaster command is cheap and does not require auth
        client.admin.command('ismaster')
        print("Successfully connected to MongoDB Atlas")
        return True
    except Exception as e:
        print(f"Failed to connect to MongoDB Atlas: {str(e)}")
        return False

def load_csv_to_mongodb():
    # Verify MongoDB connection first
    if not verify_mongodb_connection():
        print("Please make sure MongoDB Atlas connection string is correct")
        sys.exit(1)

    try:
        # Get MongoDB connection
        mongo_uri = os.getenv('MONGODB_URI')
        client = MongoClient(mongo_uri)
        db = client.farmers_market
        
        # Drop existing collection to ensure clean data
        db.markets.drop()
        print("Dropped existing markets collection")
        
        # Read CSV file
        csv_path = os.path.join('uploads', 'farmers_market.csv')
        print(f"Reading CSV file from: {csv_path}")
        df = pd.read_csv(csv_path)
        print(f"Found {len(df)} rows in CSV")
        
        # Clean the data
        df = df.replace({pd.NA: None})
        
        # Convert to records
        records = df.to_dict('records')
        
        # Insert into MongoDB
        result = db.markets.insert_many(records)
        
        print(f"Successfully inserted {len(result.inserted_ids)} markets")
        
        # Create indexes
        print("Creating indexes...")
        db.markets.create_index([("Name", "text"), ("Address", "text")])
        db.markets.create_index("state")
        db.markets.create_index("usda_listing_id", name="usda_listing_id_index")  # Non-unique index
        db.markets.create_index([("longitude", 1), ("latitude", 1)])
        
        print("Indexes created successfully")
        
        # Verify the data
        count = db.markets.count_documents({})
        print(f"Final market count in database: {count}")
        
        # Print a sample market
        sample = db.markets.find_one()
        if sample:
            print("\nSample market data:")
            for key, value in sample.items():
                if key != '_id':  # Skip the MongoDB ID
                    print(f"{key}: {value}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    load_csv_to_mongodb() 