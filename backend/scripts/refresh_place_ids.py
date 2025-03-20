from googlemaps import Client
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import time

# Load environment variables
load_dotenv()

# Initialize Google Maps client
gmaps = Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))

# Initialize MongoDB connection
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/farmers_market')
client = MongoClient(mongo_uri)
db = client.farmers_market
markets = db.markets

def refresh_place_id(market):
    """Refresh the Place ID for a single market"""
    try:
        # Get market name and address
        name = market.get('MarketName', '')
        address = market.get('Address', '')
        
        if not name or not address:
            print(f"Skipping market {market.get('_id')}: Missing name or address")
            return
        
        # Search for the place
        places_result = gmaps.places(
            f"{name} {address}",
            location=None,
            radius=50000,  # 50km radius
            language='en'
        )
        
        if places_result.get('results'):
            # Get the first result
            place = places_result['results'][0]
            
            # Update the market document with new Place ID
            markets.update_one(
                {'_id': market['_id']},
                {'$set': {'place_id': place['place_id']}}
            )
            print(f"Updated Place ID for {name}: {place['place_id']}")
        else:
            print(f"No results found for {name}")
            
        # Sleep to avoid hitting rate limits
        time.sleep(0.5)
        
    except Exception as e:
        print(f"Error processing {market.get('_id')}: {str(e)}")

def main():
    """Main function to refresh all Place IDs"""
    print("Starting Place ID refresh...")
    
    # Get all markets that need Place IDs
    markets_to_update = markets.find({
        '$or': [
            {'place_id': {'$exists': False}},
            {'place_id': None}
        ]
    })
    
    count = 0
    for market in markets_to_update:
        refresh_place_id(market)
        count += 1
        if count % 10 == 0:
            print(f"Processed {count} markets...")
    
    print(f"Completed! Processed {count} markets.")

if __name__ == "__main__":
    main() 