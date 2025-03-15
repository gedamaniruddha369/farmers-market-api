const Market = require('../models/market.model');

// Get markets by location (zip code, state, or coordinates)
exports.searchMarkets = async (req, res) => {
  try {
    const { zipCode, state, lat, lng, radius = 10 } = req.query;
    let query = {};

    if (zipCode) {
      query = { 'address.zipCode': zipCode };
    } else if (state) {
      query = { 'address.state': state };
    } else if (lat && lng) {
      query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1609.34 // Convert miles to meters
          }
        }
      };
    }

    const markets = await Market.find(query);
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all markets
exports.getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single market by ID
exports.getMarketById = async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new market
exports.createMarket = async (req, res) => {
  try {
    const market = new Market(req.body);
    const newMarket = await market.save();
    res.status(201).json(newMarket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update market
exports.updateMarket = async (req, res) => {
  try {
    const market = await Market.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.json(market);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete market
exports.deleteMarket = async (req, res) => {
  try {
    const market = await Market.findByIdAndDelete(req.params.id);
    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.json({ message: 'Market deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 