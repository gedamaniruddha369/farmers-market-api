import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Import the Flask application from the backend directory
from app import app

# This allows gunicorn to find the app
if __name__ == "__main__":
    app.run() 