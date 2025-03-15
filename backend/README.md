# Farmers Market Directory Backend

A Node.js backend API for a farmers market directory that allows users to search for markets based on location.

## Features

- Search markets by zip code, state, or coordinates
- CRUD operations for markets
- Geospatial queries for finding nearby markets
- MongoDB database with Mongoose ODM
- Express.js REST API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your MongoDB connection string and other configurations

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- `GET /api/markets/search` - Search markets by location
  - Query parameters:
    - `zipCode`: Search by ZIP code
    - `state`: Search by state
    - `lat` & `lng`: Search by coordinates
    - `radius`: Search radius in miles (default: 10)

- `GET /api/markets` - Get all markets
- `GET /api/markets/:id` - Get a specific market
- `POST /api/markets` - Create a new market
- `PUT /api/markets/:id` - Update a market
- `DELETE /api/markets/:id` - Delete a market

## Data Import

To import your CSV data into MongoDB, you'll need to create a data import script. This will be provided separately based on your CSV structure. 