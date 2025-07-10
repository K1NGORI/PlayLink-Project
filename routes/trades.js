const router = require('express').Router();
const mongoose = require('mongoose');
const Trade = require('../models/trade.model');
const MarketplaceItem = require('../models/marketplace.model');

// --- CREATE A NEW TRADE OFFER ---
router.route('/create').post(async (req, res) => {
    const { offeredBy, offeredItemId, requestedFrom, requestedItemId } = req.body;
    try {
        const newTrade = new Trade({
            offeredBy,
            offeredItem: offeredItemId,
            requestedFrom,
            requestedItem: requestedItemId
        });
        await newTrade.save();
        res.status(201).json({ message: 'Trade offer sent successfully!', trade: newTrade });
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }
});

// --- GET ALL TRADES FOR A USER (INCOMING & OUTGOING) ---
router.route('/user/:userId').get(async (req, res) => {
    try {
        const userId = req.params.userId;
        const incoming = await Trade.find({ requestedFrom: userId, status: 'pending' })
            .populate('offeredBy', 'username')
            .populate('offeredItem', 'itemName imageUrl')
            .populate('requestedItem', 'itemName imageUrl');
        
        const outgoing = await Trade.find({ offeredBy: userId, status: 'pending' })
            .populate('requestedFrom', 'username')
            .populate('offeredItem', 'itemName imageUrl')
            .populate('requestedItem', 'itemName imageUrl');
            
        res.json({ incoming, outgoing });
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }
});

// --- ACCEPT A TRADE OFFER ---
router.route('/:tradeId/accept').post(async (req, res) => {
    const { userId } = req.body; // The user accepting the trade
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const trade = await Trade.findById(req.params.tradeId).session(session);
            if (!trade || trade.status !== 'pending') throw new Error('Trade is not available.');
            if (!trade.requestedFrom.equals(userId)) throw new Error('You are not authorized to accept this trade.');

            // Get both items
            const item1 = await MarketplaceItem.findById(trade.offeredItem).session(session);
            const item2 = await MarketplaceItem.findById(trade.requestedItem).session(session);

            // Swap owners
            const originalOwner1 = item1.seller;
            item1.seller = item2.seller;
            item2.seller = originalOwner1;

            // Mark items as sold (traded)
            item1.status = 'sold';
            item2.status = 'sold';
            
            // Mark trade as accepted
            trade.status = 'accepted';

            await item1.save({ session });
            await item2.save({ session });
            await trade.save({ session });
            
            // Reject any other pending trades involving these two items
            await Trade.updateMany(
                { status: 'pending', $or: [{ offeredItem: item1._id }, { requestedItem: item1._id }, { offeredItem: item2._id }, { requestedItem: item2._id }] },
                { status: 'rejected' },
                { session }
            );
        });
        res.json({ message: 'Trade accepted successfully!' });
    } catch (error) {
        res.status(400).json({ Error: error.message });
    } finally {
        await session.endSession();
    }
});

// --- REJECT OR CANCEL A TRADE OFFER ---
router.route('/:tradeId/update').post(async (req, res) => {
    const { userId, newStatus } = req.body; // newStatus can be 'rejected' or 'cancelled'
    try {
        const trade = await Trade.findById(req.params.tradeId);
        if (!trade || trade.status !== 'pending') throw new Error('Trade is not available.');

        // Authorization check
        if (newStatus === 'rejected' && !trade.requestedFrom.equals(userId)) {
            return res.status(403).json({ Error: 'Not authorized to reject.' });
        }
        if (newStatus === 'cancelled' && !trade.offeredBy.equals(userId)) {
            return res.status(403).json({ Error: 'Not authorized to cancel.' });
        }

        trade.status = newStatus;
        await trade.save();
        res.json({ message: `Trade successfully ${newStatus}!` });
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }
});

module.exports = router;