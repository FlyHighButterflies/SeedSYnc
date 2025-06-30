import express from "express";
import {
    createInventory,
    getInventoryByUserId,
    updateInventory,
    deleteInventory,
} from "../controllers/inventoryController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create inventory
router.post("/", authMiddleware, createInventory);

// Get inventory for authenticated user
router.get("/", authMiddleware, getInventoryByUserId);

// Update inventory
router.put("/:userId", authMiddleware, updateInventory);

// Delete inventory
router.delete("/:userId", authMiddleware, deleteInventory);

export default router;
