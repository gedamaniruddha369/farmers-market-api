const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  products: [{
    type: String,
    trim: true
  }],
  operatingHours: [{
    day: String,
    open: String,
    close: String
  }],
  seasonDates: {
    start: Date,
    end: Date
  },
  website: String,
  phone: String,
  paymentOptions: [{
    type: String,
    enum: ['Cash', 'Credit Card', 'SNAP', 'WIC', 'FMNP']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for location-based queries
marketSchema.index({ location: '2dsphere' });

const Market = mongoose.model('Market', marketSchema);

module.exports = Market; 