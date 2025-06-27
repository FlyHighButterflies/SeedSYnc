import express from "express";
import TradeController from "../controllers/tradeController.js";
import Trade from "../models/TradeModel.js";

const router = express.Router();
const tradeController = new TradeController(Trade);

// Trade routes
router.post("/", tradeController.createTrade.bind(tradeController));
router.get("/", tradeController.getTrades.bind(tradeController));
router.put("/:id", tradeController.updateTrade.bind(tradeController));
router.delete("/:id", tradeController.deleteTrade.bind(tradeController));

export default router;
