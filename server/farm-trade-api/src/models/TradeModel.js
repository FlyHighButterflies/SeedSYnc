const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    buyerId: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    cropId: {
        type: String,
        required: true,
    },
    tradeDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const TradeModel = mongoose.model('Trade', tradeSchema);

module.exports = TradeModel;