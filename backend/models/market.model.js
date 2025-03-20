const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  // Modern field names (compatibility)
  market_name: String,
  market_address: String,
  
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  latitude: Number,
  longitude: Number,
  USDA_listing_id: String,
  phone_number: String,
  website: String,
  image_link: String,
  image_url: String,
  google_maps_link: String,
  google_place_id: String,
  rating: Number,
  products: [String]
});

// Create geospatial index for location-based queries
marketSchema.index({ location: '2dsphere' });

// Create text indexes for search
marketSchema.index({ 
  Name: 'text', 
  market_name: 'text',
  Address: 'text', 
  market_address: 'text' 
});

const Market = mongoose.model('Market', marketSchema);

module.exports = Market; 