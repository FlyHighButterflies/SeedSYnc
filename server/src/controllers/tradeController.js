import { hashUserId, hashCropKey } from '../utils/hash.js';

class TradeController {
    constructor(TradeModel) {
        this.TradeModel = TradeModel;
    }

    hashTradeResponse(trade) {
        return {
            ...trade.toObject(),
            _id: trade._id ? hashCropKey(trade.buyerId ? trade.buyerId.toString() : '', trade._id.toString()) : null,
            buyerId: trade.buyerId ? hashUserId(trade.buyerId.toString()) : null,
            sellerId: trade.sellerId ? hashUserId(trade.sellerId.toString()) : null,
            cropId: trade.cropId ? hashCropKey(trade.sellerId ? trade.sellerId.toString() : '', trade.cropId.toString()) : null,
        };
    }

    async createTrade(req, res) {
        try {
            const tradeData = req.body;
            const newTrade = await this.TradeModel.create(tradeData);
            res.status(201).json(this.hashTradeResponse(newTrade));
        } catch (error) {
            res.status(500).json({ message: 'Error creating trade', error });
        }
    }

    async getTrades(req, res) {
        try {
            const trades = await this.TradeModel.find();
            res.status(200).json(trades.map(trade => this.hashTradeResponse(trade)));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching trades', error });
        }
    }

    async updateTrade(req, res) {
        try {
            const { id } = req.params;
            const updatedTrade = await this.TradeModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedTrade) {
                return res.status(404).json({ message: 'Trade not found' });
            }
            res.status(200).json(this.hashTradeResponse(updatedTrade));
        } catch (error) {
            res.status(500).json({ message: 'Error updating trade', error });
        }
    }

    async deleteTrade(req, res) {
        try {
            const { id } = req.params;
            const deletedTrade = await this.TradeModel.findByIdAndDelete(id);
            if (!deletedTrade) {
                return res.status(404).json({ message: 'Trade not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting trade', error });
        }
    }
}

export default TradeController;