const router = require('express').Router();
let MarketplaceItem = require('../models/marketplace.model');

// Get all marketplace items
router.route('/').get((req, res) => {
  MarketplaceItem.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new marketplace item
router.route('/add').post((req, res) => {
  const { itemName, description, price, seller } = req.body;

  const newItem = new MarketplaceItem({
    itemName,
    description,
    price,
    seller,
  });

  newItem.save()
    .then(() => res.json('Item added to the marketplace!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;