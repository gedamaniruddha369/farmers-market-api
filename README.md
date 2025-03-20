# Farmers Market API

A RESTful API for finding and exploring farmers markets. Built with Flask and MongoDB.

## Features

- Search farmers markets by location (latitude/longitude)
- Filter markets by state or zip code
- Get detailed information about specific markets
- Geospatial queries for finding markets within a radius
- CSV data import functionality

## API Endpoints

- `GET /api/markets` - Get all markets (with optional state/zip filters)
- `GET /api/markets/search` - Search markets by coordinates and radius
- `GET /api/markets/<market_id>` - Get specific market details
- `POST /upload` - Upload CSV data

## Tech Stack

- Python 3.9
- Flask
- MongoDB Atlas
- Pandas for data processing
- CORS enabled for cross-origin requests

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/farmers-market-api.git
   cd farmers-market-api
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   # OR
   source venv/bin/activate     # Unix/MacOS
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file with:
   ```
   MONGODB_URI=mongodb+srv://gedamaniruddha:Ryhz0Nb6fm9QjNn1@cluster0.fgbl6.mongodb.net/farmers_market?retryWrites=true&w=majority&appName=Cluster0&tls=true
   FLASK_ENV=development
   ```

5. Run the application:
   ```bash
   python app.py
   ```

## Deployment

This application is configured for deployment on Render.com. See `render.yaml` for configuration details.

## License

MIT License 