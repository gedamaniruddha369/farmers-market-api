"""
Main entry point for the Farmers Market API.
This file imports the Flask application from the backend directory.
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.abspath('backend'))

# Import the Flask app from backend/app.py
from backend.app import app

if __name__ == '__main__':
    # This block will be executed when running this file directly
    # but not when imported by Gunicorn
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))) 