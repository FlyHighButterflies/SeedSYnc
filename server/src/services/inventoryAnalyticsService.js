import Crop from '../models/CropModel.js';
import { 
    setInventoryAlerts, 
    detectSurplusInventory, 
    getInventoryAnalytics,
    generateInventoryAlertsForFarmer 
} from '../utils/inventoryAnalytics.js';

/**
 * Inventory Analytics Service
 * Provides high-level functions to analyze inventory and generate alerts
 */
class InventoryAnalyticsService {
    
    /**
     * Get inventory analytics for a specific farmer
     * @param {String} farmerId - Farmer's user ID
     * @returns {Object} - Complete analytics with alerts and recommendations
     */
    async getFarmerInventoryAnalytics(farmerId) {
        try {
            // Get all crops for the farmer
            const crops = await Crop.find({ farmerId }).lean();
            
            if (!crops || crops.length === 0) {
                return {
                    farmerId,
                    totalCrops: 0,
                    message: 'No crops found for this farmer',
                    analytics: null
                };
            }

            // Generate analytics
            const analytics = getInventoryAnalytics(crops);
            
            // Generate specific alerts for farmer notification
            const farmerAlerts = generateInventoryAlertsForFarmer(farmerId, crops);

            return {
                farmerId,
                analytics,
                alerts: farmerAlerts,
                lastUpdated: new Date(),
                cropsAnalyzed: crops.length
            };
        } catch (error) {
            throw new Error(`Error analyzing farmer inventory: ${error.message}`);
        }
    }

    /**
     * Get all crops with low stock alerts
     * @param {String} farmerId - Optional farmer ID to filter
     * @returns {Array} - Crops with low stock status
     */
    async getLowStockCrops(farmerId = null) {
        try {
            const query = farmerId ? { farmerId } : {};
            const crops = await Crop.find(query).lean();
            
            const cropsWithAlerts = setInventoryAlerts(crops);
            
            return cropsWithAlerts.filter(crop => 
                crop.alert && (crop.alert.type === 'low_stock' || crop.alert.type === 'critical_low')
            );
        } catch (error) {
            throw new Error(`Error fetching low stock crops: ${error.message}`);
        }
    }

    /**
     * Get all crops with surplus inventory
     * @param {String} farmerId - Optional farmer ID to filter
     * @returns {Array} - Crops with surplus status
     */
    async getSurplusCrops(farmerId = null) {
        try {
            const query = farmerId ? { farmerId } : {};
            const crops = await Crop.find(query).lean();
            
            return detectSurplusInventory(crops);
        } catch (error) {
            throw new Error(`Error fetching surplus crops: ${error.message}`);
        }
    }

    /**
     * Update crop weight and recalculate alerts
     * @param {String} cropId - Crop ID
     * @param {Number} newWeight - New current weight
     * @returns {Object} - Updated crop with new alert status
     */
    async updateCropWeightAndAnalyze(cropId, newWeight) {
        try {
            // Update the crop with new weight (assuming we add currentWeightKg field)
            const updatedCrop = await Crop.findByIdAndUpdate(
                cropId,
                { currentWeightKg: newWeight },
                { new: true }
            ).lean();

            if (!updatedCrop) {
                throw new Error('Crop not found');
            }

            // Analyze the single crop
            const [analyzedCrop] = setInventoryAlerts([updatedCrop]);

            return {
                crop: analyzedCrop,
                alertChanged: analyzedCrop.alert ? true : false,
                previousAlert: null, // Could be enhanced to track previous state
                timestamp: new Date()
            };
        } catch (error) {
            throw new Error(`Error updating crop weight: ${error.message}`);
        }
    }

    /**
     * Get system-wide inventory health summary
     * @returns {Object} - Overall inventory health metrics
     */
    async getSystemInventoryHealth() {
        try {
            const allCrops = await Crop.find({}).lean();
            
            const cropsWithAlerts = setInventoryAlerts(allCrops);
            const totalFarmers = await Crop.distinct('farmerId').countDocuments();
            
            const healthMetrics = {
                totalCrops: allCrops.length,
                totalFarmers,
                healthDistribution: {
                    healthy: cropsWithAlerts.filter(c => !c.alert).length,
                    lowStock: cropsWithAlerts.filter(c => c.alert?.type === 'low_stock').length,
                    criticalLow: cropsWithAlerts.filter(c => c.alert?.type === 'critical_low').length,
                    surplus: cropsWithAlerts.filter(c => c.alert?.type === 'surplus').length
                },
                alertsByFarmer: await this._getAlertsByFarmer(cropsWithAlerts),
                systemHealth: this._calculateSystemHealthScore(cropsWithAlerts)
            };

            return healthMetrics;
        } catch (error) {
            throw new Error(`Error calculating system inventory health: ${error.message}`);
        }
    }

    /**
     * Private method to calculate alerts by farmer
     * @param {Array} cropsWithAlerts - Analyzed crops
     * @returns {Object} - Alerts grouped by farmer
     */
    async _getAlertsByFarmer(cropsWithAlerts) {
        const alertsByFarmer = {};
        
        cropsWithAlerts.forEach(crop => {
            if (crop.alert && crop.farmerId) {
                if (!alertsByFarmer[crop.farmerId]) {
                    alertsByFarmer[crop.farmerId] = {
                        totalAlerts: 0,
                        lowStock: 0,
                        criticalLow: 0,
                        surplus: 0
                    };
                }
                
                alertsByFarmer[crop.farmerId].totalAlerts++;
                
                // Map alert types to property names correctly
                switch(crop.alert.type) {
                    case 'low_stock':
                        alertsByFarmer[crop.farmerId].lowStock++;
                        break;
                    case 'critical_low':
                        alertsByFarmer[crop.farmerId].criticalLow++;
                        break;
                    case 'surplus':
                        alertsByFarmer[crop.farmerId].surplus++;
                        break;
                }
            }
        });

        return alertsByFarmer;
    }

    /**
     * Private method to calculate overall system health score
     * @param {Array} cropsWithAlerts - Analyzed crops
     * @returns {Object} - Health score and rating
     */
    _calculateSystemHealthScore(cropsWithAlerts) {
        if (cropsWithAlerts.length === 0) return { score: 100, rating: 'excellent' };

        const healthyCrops = cropsWithAlerts.filter(c => !c.alert).length;
        const totalCrops = cropsWithAlerts.length;
        const healthPercentage = (healthyCrops / totalCrops) * 100;

        let rating = 'poor';
        if (healthPercentage >= 80) rating = 'excellent';
        else if (healthPercentage >= 60) rating = 'good';
        else if (healthPercentage >= 40) rating = 'fair';

        return {
            score: Math.round(healthPercentage),
            rating,
            healthyCrops,
            totalCrops,
            needsAttention: totalCrops - healthyCrops
        };
    }
}

export default new InventoryAnalyticsService();
