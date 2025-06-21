const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketplaceItemSchema = new Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);

module.exports = MarketplaceItem;