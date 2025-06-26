const express = require('express');
const TradeController = require('../controllers/tradeController');

const router = express.Router();
const tradeController = new TradeController();

// Trade routes
router.post('/', tradeController.createTrade.bind(tradeController));
router.get('/', tradeController.getTrades.bind(tradeController));
router.put('/:id', tradeController.updateTrade.bind(tradeController));
router.delete('/:id', tradeController.deleteTrade.bind(tradeController));

module.exports = router;