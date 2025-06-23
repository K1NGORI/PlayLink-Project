// Current models/marketplace.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketplaceItemSchema = new Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    required: true,
    enum: ['available', 'in_escrow', 'sold'],
    default: 'available'
  }
}, {
  timestamps: true,
});

const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);
module.exports = MarketplaceItem;