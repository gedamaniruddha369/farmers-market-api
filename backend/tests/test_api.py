import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# API base URL
BASE_URL = os.getenv('API_URL', 'https://planetwiseliving.com/api')

def test_endpoint(endpoint, method='GET', data=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}/{endpoint}"
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        
        print(f"\nTesting {method} {endpoint}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing {endpoint}: {str(e)}")
        return False

def main():
    """Test all API endpoints"""
    print("Starting API tests...")
    
    # Test endpoints
    endpoints = [
        ('markets', 'GET'),
        ('markets/state-counts', 'GET'),
        ('test-connection', 'GET')
    ]
    
    success_count = 0
    total_endpoints = len(endpoints)
    
    for endpoint, method in endpoints:
        if test_endpoint(endpoint, method):
            success_count += 1
    
    print(f"\nTest Results:")
    print(f"Successfully tested: {success_count}/{total_endpoints} endpoints")
    
    if success_count == total_endpoints:
        print("All endpoints are working correctly!")
    else:
        print("Some endpoints need attention.")

if __name__ == "__main__":
    main() 