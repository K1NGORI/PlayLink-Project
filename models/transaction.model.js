// models/transaction.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'MarketplaceItem', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['initiated', 'funds_in_escrow', 'completed', 'cancelled'],
    default: 'initiated'
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;