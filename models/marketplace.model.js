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
  },
  imageUrl: {
      type: String,
      default: 'https://placehold.co/600x400/1a1f28/00ffff?text=Playlink'
  }
}, {
  timestamps: true,
});

const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);

module.exports = MarketplaceItem;