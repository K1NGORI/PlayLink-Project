const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    // The user making the offer
    offeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // The item they are offering
    offeredItem: { type: Schema.Types.ObjectId, ref: 'MarketplaceItem', required: true },
    
    // The user who owns the requested item
    requestedFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // The item they are requesting
    requestedItem: { type: Schema.Types.ObjectId, ref: 'MarketplaceItem', required: true },

    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected', 'cancelled'],
        default: 'pending'
    },
}, {
    timestamps: true
});

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;