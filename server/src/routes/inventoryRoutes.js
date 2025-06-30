import express from 'express';
import inventoryController from '../controllers/inventoryController.js';
import authMiddleware, { authorizeRoles, checkOwnership } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validation.js";

const router = express.Router();

// All inventory routes require authentication
router.use(authMiddleware);

/**
 * Inventory Analytics Routes
 * All routes handle inventory monitoring, alerts, and analytics
 */

// Get comprehensive analytics for a specific farmer - farmers can only access their own data
router.get('/analytics/:farmerId', 
    validateObjectId('farmerId'),
    authorizeRoles('farmer'),
    checkOwnership('farmerId'),
    inventoryController.getFarmerAnalytics
);

// Get all alerts for a farmer - farmers can only access their own alerts
router.get('/alerts/:farmerId', 
    validateObjectId('farmerId'),
    authorizeRoles('farmer'),
    checkOwnership('farmerId'),
    inventoryController.getAllFarmerAlerts
);

// Get low stock alerts - farmers only, filtered by user
router.get('/alerts/low-stock', 
    authorizeRoles('farmer'),
    inventoryController.getLowStockAlerts
);

// Get surplus inventory alerts - farmers only, filtered by user
router.get('/alerts/surplus', 
    authorizeRoles('farmer'),
    inventoryController.getSurplusAlerts
);

// Update crop weight - farmers only, own crops only
router.put('/crops/:cropId/weight', 
    validateObjectId('cropId'),
    authorizeRoles('farmer'),
    inventoryController.updateCropWeight
);

// Get system-wide inventory health metrics - admin/dashboard view only
router.get('/system/health', 
    // TODO: Add admin role when implemented
    authorizeRoles('farmer', 'buyer'), // Temporary - should be admin only
    inventoryController.getSystemHealth
);

export default router;
