import json
from collections import defaultdict

def analyze_market_data(data):
    try:
        print("Starting analysis...")
        print(f"Data type: {type(data)}")
        print(f"Data length: {len(data)}")
        
        # Initialize counters
        state_counts = defaultdict(int)
        city_counts = defaultdict(int)
        total_markets = 0
        
        # Process each entry
        for entry in data:
            if not isinstance(entry, dict) or '_id' not in entry or 'count' not in entry:
                print(f"Warning: Invalid entry format: {entry}")
                continue
                
            location = entry['_id']
            count = entry['count']
            
            # Count states (2 letters) and cities (longer names)
            if len(location) == 2:
                state_counts[location] += count
            else:
                city_counts[location] += count
                
            total_markets += count
        
        # Sort states by count
        sorted_states = sorted(state_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Print results
        print(f"\nTotal number of unique locations: {len(data)}")
        print(f"Total number of markets: {total_markets}")
        
        if sorted_states:
            print("\nStates with farmers markets:")
            for state, count in sorted_states:
                print(f"{state}: {count} markets")
        else:
            print("\nNo state data found in the dataset.")
            
        if city_counts:
            print("\nCities with farmers markets:")
            sorted_cities = sorted(city_counts.items(), key=lambda x: x[1], reverse=True)
            for city, count in sorted_cities:
                print(f"{city}: {count} markets")
        else:
            print("\nNo city data found in the dataset.")
            
    except Exception as e:
        print(f"Error analyzing market data: {str(e)}")
        return False
    
    return True

def main():
    try:
        print("Starting main function...")
        # Read the data from the JSON file
        with open('market_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            print("Successfully loaded JSON file")
        
        if not data:
            print("Error: No data found in market_data.json")
            return False
            
        # Analyze the data
        return analyze_market_data(data)
        
    except FileNotFoundError:
        print("Error: market_data.json file not found")
        return False
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in market_data.json")
        return False
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Script started...")
    success = main()
    if not success:
        print("\nFailed to load markets. Please try again later.") 