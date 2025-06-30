import express from "express";
import TradeController from "../controllers/tradeController.js";
import Trade from "../models/TradeModel.js";
import authMiddleware, { authorizeRoles, checkOwnership } from "../middleware/auth.js";
import { validateTrade, validateObjectId } from "../middleware/validation.js";

const router = express.Router();
const tradeController = new TradeController(Trade);

// All trade routes require authentication
router.use(authMiddleware);

// Create trade - authenticated users can create trades
router.post("/", 
    validateTrade,
    tradeController.createTrade.bind(tradeController)
);

// Get trades - users can view their own trades
router.get("/", 
    tradeController.getTrades.bind(tradeController)
);

// Update trade - only involved parties can update
router.put("/:id", 
    validateObjectId('id'),
    validateTrade,
    tradeController.updateTrade.bind(tradeController)
);

// Delete trade - only involved parties can delete
router.delete("/:id", 
    validateObjectId('id'),
    tradeController.deleteTrade.bind(tradeController)
);

export default router;
