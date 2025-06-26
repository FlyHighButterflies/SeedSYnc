import express from "express";
import InventoryController from "../controllers/inventoryController.js";
import Inventory from "../models/InventoryModel.js";

const router = express.Router();
const inventoryController = new InventoryController(Inventory);

// Routes for inventory management
router.post("/", inventoryController.createInventory.bind(inventoryController));
router.get("/", inventoryController.getInventory.bind(inventoryController));
router.put(
  "/:id",
  inventoryController.updateInventory.bind(inventoryController)
);
router.delete(
  "/:id",
  inventoryController.deleteInventory.bind(inventoryController)
);

export default router;
