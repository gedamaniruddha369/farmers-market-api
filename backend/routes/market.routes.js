const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');

// Search markets by location
router.get('/search', marketController.searchMarkets);

// Get all markets
router.get('/', marketController.getAllMarkets);

// Get single market
router.get('/:id', marketController.getMarketById);

// Create new market
router.post('/', marketController.createMarket);

// Update market
router.put('/:id', marketController.updateMarket);

// Delete market
router.delete('/:id', marketController.deleteMarket);

module.exports = router; 