import express from 'express';
import inventoryController from '../controllers/inventoryController.js';

const router = express.Router();

/**
 * Inventory Analytics Routes
 * All routes handle inventory monitoring, alerts, and analytics
 */

// Get comprehensive analytics for a specific farmer
router.get('/analytics/:farmerId', inventoryController.getFarmerAnalytics);

// Get all alerts for a farmer (low stock + surplus)
router.get('/alerts/:farmerId', inventoryController.getAllFarmerAlerts);

// Get low stock alerts (optionally filtered by farmer)
router.get('/alerts/low-stock', inventoryController.getLowStockAlerts);

// Get surplus inventory alerts (optionally filtered by farmer)
router.get('/alerts/surplus', inventoryController.getSurplusAlerts);

// Update crop weight and get new alert status
router.put('/crops/:cropId/weight', inventoryController.updateCropWeight);

// Get system-wide inventory health metrics (admin/dashboard view)
router.get('/system/health', inventoryController.getSystemHealth);

export default router;
