const router = require('express').Router();
const mongoose = require('mongoose');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const MarketplaceItem = require('../models/marketplace.model');

// --- INITIATE A PURCHASE (ESCROW) ---
router.route('/initiate').post(async (req, res) => {
    const { itemId, buyerId } = req.body;
    const session = await mongoose.startSession();
    
    try {
        let createdTransaction;
        await session.withTransaction(async () => {
            const item = await MarketplaceItem.findById(itemId).session(session);
            if (!item) throw new Error('Item not found.');
            if (item.status !== 'available') throw new Error('Item is not available for purchase.');

            const buyer = await User.findById(buyerId).session(session);
            if (!buyer) throw new Error('Buyer not found.');

            if (item.seller.equals(buyer._id)) throw new Error('You cannot purchase your own item.');
            if (buyer.gc_balance < item.price) throw new Error('Insufficient funds.');

            buyer.gc_balance -= item.price;
            item.status = 'in_escrow';

            const transaction = new Transaction({
                item: item._id,
                buyer: buyer._id,
                seller: item.seller,
                amount: item.price,
                status: 'funds_in_escrow'
            });

            await buyer.save({ session });
            await item.save({ session });
            createdTransaction = await transaction.save({ session });
        });
        
        res.json({ message: 'Purchase initiated! Funds are in escrow.', transaction: createdTransaction });

    } catch (error) {
        console.error('Transaction initiation failed:', error);
        res.status(400).json({ Error: error.message });
    } finally {
        await session.endSession();
    }
});

// --- COMPLETE A PURCHASE (RELEASE FUNDS) ---
router.route('/:id/complete').post(async (req, res) => {
    const { userId } = req.body;
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const transaction = await Transaction.findById(req.params.id).session(session);
            if (!transaction || transaction.status !== 'funds_in_escrow') {
                throw new Error('Transaction is not ready to be completed.');
            }
            if (!transaction.buyer.equals(userId)) {
                throw new Error('Only the buyer can complete this transaction.');
            }

            const seller = await User.findById(transaction.seller).session(session);
            if (!seller) throw new Error('Seller not found.');

            seller.gc_balance += transaction.amount;
            transaction.status = 'completed';

            await MarketplaceItem.findByIdAndUpdate(transaction.item, { status: 'sold' }, { session });
            await seller.save({ session });
            await transaction.save({ session });
        });

        res.json({ message: 'Transaction complete! Funds released to seller.' });

    } catch (error) {
        console.error('Transaction completion failed:', error);
        res.status(400).json({ Error: error.message });
    } finally {
        await session.endSession();
    }
});

// --- GET TRANSACTIONS FOR A USER'S ACCOUNT PAGE ---
router.route('/user/:userId').get(async (req, res) => {
    try {
        const userId = req.params.userId;
        const purchases = await Transaction.find({ buyer: userId, status: 'funds_in_escrow' })
            .populate({ path: 'item', select: 'itemName' });
        const sales = await Transaction.find({ seller: userId, status: 'funds_in_escrow' })
            .populate({ path: 'item', select: 'itemName' });
        res.json({ purchases, sales });
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }
});

module.exports = router;