const router = require('express').Router();
const mongoose = require('mongoose');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const MarketplaceItem = require('../models/marketplace.model');

// --- INITIATE A PURCHASE (ESCROW) ---
router.route('/initiate').post(async (req, res) => {
    const { itemId, buyerId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const item = await MarketplaceItem.findById(itemId).session(session);
        if (!item || item.status !== 'available') {
            throw new Error('Item is not available for purchase.');
        }

        const buyer = await User.findById(buyerId).session(session);
        if (!buyer) throw new Error('Buyer not found.');

        if (item.seller.equals(buyer._id)) {
            throw new Error('You cannot purchase your own item.');
        }

        if (buyer.gc_balance < item.price) {
            throw new Error('Insufficient funds.');
        }

        // 1. Deduct funds from buyer
        buyer.gc_balance -= item.price;
        await buyer.save({ session });

        // 2. Update item status
        item.status = 'in_escrow';
        await item.save({ session });

        // 3. Create transaction record
        const transaction = new Transaction({
            item: item._id,
            buyer: buyer._id,
            seller: item.seller,
            amount: item.price,
            status: 'funds_in_escrow'
        });
        await transaction.save({ session });

        await session.commitTransaction();
        res.json({ message: 'Purchase initiated! Funds are in escrow.', transaction });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json('Error: ' + error.message);
    } finally {
        session.endSession();
    }
});

// --- COMPLETE A PURCHASE (RELEASE FUNDS) ---
router.route('/:id/complete').post(async (req, res) => {
    const { userId } = req.body; // The user confirming receipt
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await Transaction.findById(req.params.id).session(session);
        if (!transaction || transaction.status !== 'funds_in_escrow') {
            throw new Error('Transaction is not ready to be completed.');
        }

        if (!transaction.buyer.equals(userId)) {
            throw new Error('Only the buyer can complete this transaction.');
        }

        const seller = await User.findById(transaction.seller).session(session);
        if (!seller) throw new Error('Seller not found.');

        // 1. Add funds to seller's balance
        seller.gc_balance += transaction.amount;
        await seller.save({ session });

        // 2. Update transaction status
        transaction.status = 'completed';
        await transaction.save({ session });
        
        // 3. Update item status
        await MarketplaceItem.findByIdAndUpdate(transaction.item, { status: 'sold' }).session(session);

        await session.commitTransaction();
        res.json({ message: 'Transaction complete! Funds released to seller.' });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json('Error: ' + error.message);
    } finally {
        session.endSession();
    }
});


// --- GET TRANSACTIONS FOR A USER'S DASHBOARD ---
router.route('/user/:userId').get(async (req, res) => {
    try {
        const userId = req.params.userId;

        const purchases = await Transaction.find({ buyer: userId, status: 'funds_in_escrow' })
            .populate('item', 'itemName');
        
        const sales = await Transaction.find({ seller: userId, status: 'funds_in_escrow' })
            .populate('item', 'itemName');

        res.json({ purchases, sales });

    } catch (error) {
        res.status(400).json('Error: ' + error.message);
    }
});


module.exports = router;