import os
import sys
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

def get_db():
    """Get MongoDB connection and database"""
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/farmers_market')
    client = MongoClient(mongo_uri)
    db = client.farmers_market
    return db

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
        
    # Try to find state abbreviation in address
    state_abbr_match = re.search(r',\s*([A-Z]{2})\s*\d', address)
    if state_abbr_match:
        state_abbr = state_abbr_match.group(1)
        if state_abbr in state_mapping:
            return state_abbr
    
    # Try to find full state name in address
    for state_name in state_mapping.values():
        if state_name.lower() in address.lower():
            return reverse_mapping[state_name.lower()]
    
    return None

def update_state_fields():
    """Update state field for all markets in the database"""
    try:
        db = get_db()
        markets = db.markets
        
        # Get all markets
        all_markets = list(markets.find({}))
        updates = []
        
        print(f"Processing {len(all_markets)} markets...")
        
        for market in all_markets:
            state = extract_state(market.get('Address'))
            if state:
                updates.append(
                    UpdateOne(
                        {'_id': market['_id']},
                        {'$set': {'state': state}}
                    )
                )
        
        if updates:
            result = markets.bulk_write(updates)
            print(f"Updated {result.modified_count} markets with state information")
            
            # Create index on state field
            markets.create_index('state')
            print("Created index on state field")
        else:
            print("No updates needed")
            
    except Exception as e:
        print(f"Error updating state fields: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    update_state_fields() 