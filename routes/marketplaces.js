const router = require('express').Router();
let MarketplaceItem = require('../models/marketplace.model');

// GET all items (with seller's username)
router.route('/').get((req, res) => {
    MarketplaceItem.find()
        .populate('seller', 'username') // Add seller's username
        .sort({ createdAt: -1 })
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

// ADD a new item
router.route('/add').post((req, res) => {
    const { itemName, description, price, seller } = req.body;

    if (!itemName || !description || !price || !seller) {
        return res.status(400).json('Error: Please provide all required fields.');
    }

    const newItem = new MarketplaceItem({ itemName, description, price, seller });
    newItem.save()
        .then(() => res.json('Item listed successfully!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// GET a single item by ID
router.route('/:id').get((req, res) => {
    MarketplaceItem.findById(req.params.id)
        .populate('seller', 'username')
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});
// GET all items by a specific seller ID
router.route('/user/:userId').get((req, res) => {
    MarketplaceItem.find({ seller: req.params.userId })
      .sort({ createdAt: -1 })
      .then(items => res.json(items))
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;;