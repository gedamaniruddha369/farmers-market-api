# This file is a simple entrypoint that imports the Flask app from backend
from backend.app import app

if __name__ == '__main__':
    app.run() 