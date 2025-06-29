import inventoryAnalyticsService from '../services/inventoryAnalyticsService.js';
import Crop from '../models/CropModel.js';

/**
 * Inventory Controller
 * Handles inventory analytics, alerts, and management
 */
class InventoryController {

    /**
     * Get inventory analytics for a farmer
     * GET /api/inventory/analytics/:farmerId
     */
    async getFarmerAnalytics(req, res) {
        try {
            const { farmerId } = req.params;
            
            const analytics = await inventoryAnalyticsService.getFarmerInventoryAnalytics(farmerId);
            
            res.status(200).json({
                success: true,
                data: analytics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving farmer analytics',
                error: error.message
            });
        }
    }

    /**
     * Get low stock alerts for a farmer or all farmers
     * GET /api/inventory/alerts/low-stock?farmerId=optional
     */
    async getLowStockAlerts(req, res) {
        try {
            const { farmerId } = req.query;
            
            const lowStockCrops = await inventoryAnalyticsService.getLowStockCrops(farmerId);
            
            res.status(200).json({
                success: true,
                count: lowStockCrops.length,
                data: lowStockCrops
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving low stock alerts',
                error: error.message
            });
        }
    }

    /**
     * Get surplus inventory alerts
     * GET /api/inventory/alerts/surplus?farmerId=optional
     */
    async getSurplusAlerts(req, res) {
        try {
            const { farmerId } = req.query;
            
            const surplusCrops = await inventoryAnalyticsService.getSurplusCrops(farmerId);
            
            res.status(200).json({
                success: true,
                count: surplusCrops.length,
                data: surplusCrops
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving surplus alerts',
                error: error.message
            });
        }
    }

    /**
     * Update crop weight and get new alert status
     * PUT /api/inventory/crops/:cropId/weight
     */
    async updateCropWeight(req, res) {
        try {
            const { cropId } = req.params;
            const { newWeight } = req.body;

            if (!newWeight || newWeight < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid weight is required'
                });
            }

            const result = await inventoryAnalyticsService.updateCropWeightAndAnalyze(cropId, newWeight);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating crop weight',
                error: error.message
            });
        }
    }

    /**
     * Get system-wide inventory health dashboard
     * GET /api/inventory/system/health
     */
    async getSystemHealth(req, res) {
        try {
            const healthMetrics = await inventoryAnalyticsService.getSystemInventoryHealth();
            
            res.status(200).json({
                success: true,
                data: healthMetrics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving system health metrics',
                error: error.message
            });
        }
    }

    /**
     * Get all alerts for a farmer (both low stock and surplus)
     * GET /api/inventory/alerts/:farmerId
     */
    async getAllFarmerAlerts(req, res) {
        try {
            const { farmerId } = req.params;
            
            const [lowStock, surplus] = await Promise.all([
                inventoryAnalyticsService.getLowStockCrops(farmerId),
                inventoryAnalyticsService.getSurplusCrops(farmerId)
            ]);

            const allAlerts = [
                ...lowStock.map(crop => ({ ...crop, category: 'low_stock' })),
                ...surplus.map(crop => ({ ...crop, category: 'surplus' }))
            ].sort((a, b) => {
                // Sort by severity: critical_low > low_stock > surplus
                const severityOrder = { critical_low: 3, low_stock: 2, surplus: 1 };
                return (severityOrder[b.alert?.type] || 0) - (severityOrder[a.alert?.type] || 0);
            });
            
            res.status(200).json({
                success: true,
                farmerId,
                totalAlerts: allAlerts.length,
                breakdown: {
                    lowStock: lowStock.length,
                    surplus: surplus.length
                },
                data: allAlerts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving farmer alerts',
                error: error.message
            });
        }
    }
}

export default new InventoryController();
