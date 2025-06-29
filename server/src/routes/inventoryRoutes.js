import express from 'express';
import { createInventory, getInventoryByUserId, updateInventory, deleteInventory } from '../controllers/inventoryController.js';

const router = express.Router();

// Create inventory
router.post('/', createInventory);

// Get inventory by user ID
router.get('/:userId', getInventoryByUserId);

// Update inventory
router.put('/:userId', updateInventory);

// Delete inventory
router.delete('/:userId', deleteInventory);

export default router;