const express = require('express');
const InventoryController = require('../controllers/inventoryController');

const router = express.Router();
const inventoryController = new InventoryController();

// Routes for inventory management
router.post('/', inventoryController.createInventory.bind(inventoryController));
router.get('/', inventoryController.getInventory.bind(inventoryController));
router.put('/:id', inventoryController.updateInventory.bind(inventoryController));
router.delete('/:id', inventoryController.deleteInventory.bind(inventoryController));

module.exports = router;