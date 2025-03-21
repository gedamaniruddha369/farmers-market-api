from pymongo import MongoClient
import os
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

def fix_index_issue():
    """
    Fix the MongoDB index issue by dropping conflicting indices and recreating them properly.
    This script addresses the "An existing index has the same name as the requested index" error.
    """
    try:
        # Get MongoDB connection
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/farmers_market')
        client = MongoClient(mongo_uri)
        db = client.farmers_market
        markets = db.markets
        
        # Get current indexes
        print("Current indexes:")
        current_indexes = list(markets.list_indexes())
        for idx in current_indexes:
            print(f"  - {idx['name']}: {idx['key']}")
            
        # Check for usda_listing_id index conflicts
        usda_listing_id_indexes = [idx for idx in current_indexes if 'usda_listing_id' in str(idx['key'])]
        
        if usda_listing_id_indexes:
            print(f"\nFound {len(usda_listing_id_indexes)} indexes on usda_listing_id field")
            for idx in usda_listing_id_indexes:
                print(f"  - {idx['name']}: {idx['key']}")
                # Drop the conflicting index
                try:
                    markets.drop_index(idx['name'])
                    print(f"    ✓ Dropped index {idx['name']}")
                except Exception as e:
                    print(f"    ✗ Failed to drop index {idx['name']}: {str(e)}")
        
        # Create a new consistent index
        print("\nCreating a new consistent index on usda_listing_id...")
        markets.create_index("usda_listing_id", name="usda_listing_id_index")
        print("✓ Index created successfully")
        
        # Verify the new setup
        print("\nVerified indexes:")
        for idx in markets.list_indexes():
            print(f"  - {idx['name']}: {idx['key']}")
            
        print("\nThe index conflict has been resolved.")
        
    except Exception as e:
        print(f"Error fixing index issue: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    fix_index_issue() 