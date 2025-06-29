/**
 * Set inventory alerts based on crop weight compared to initial weight
 * Requirements: Set status = "low stock" when weight <= 0.3 * initialWeight
 * @param {Array} crops - Array of crop objects with initialWeightKg and current weight
 * @returns {Array} - Array of crops with alert status and messages
 */
export const setInventoryAlerts = (crops) => {
    return crops.map(crop => {
        if (!crop.initialWeightKg || crop.initialWeightKg <= 0) {
            return {
                ...crop,
                status: crop.status || 'available',
                alert: null
            };
        }

        // Get current weight - assume it's tracked in currentWeightKg or use initialWeightKg as fallback
        const currentWeight = crop.currentWeightKg || crop.initialWeightKg;
        const lowStockThreshold = crop.initialWeightKg * 0.3; // 30% of initial weight
        const surplusThreshold = crop.initialWeightKg * 1.5; // 150% indicates surplus (maybe restocked)

        let status = crop.status || 'available';
        let alert = null;
        let alertLevel = 'info';

        // Low stock detection
        if (currentWeight <= lowStockThreshold) {
            alert = {
                type: 'low_stock',
                message: `Low stock alert: ${crop.name} has only ${currentWeight}kg remaining (${Math.round((currentWeight/crop.initialWeightKg) * 100)}% of initial stock)`,
                threshold: lowStockThreshold,
                currentWeight,
                initialWeight: crop.initialWeightKg,
                severity: 'warning'
            };
            alertLevel = 'warning';
        }
        // Surplus detection
        else if (currentWeight > surplusThreshold) {
            alert = {
                type: 'surplus',
                message: `Surplus detected: ${crop.name} has ${currentWeight}kg available (${Math.round((currentWeight/crop.initialWeightKg) * 100)}% of initial stock)`,
                threshold: surplusThreshold,
                currentWeight,
                initialWeight: crop.initialWeightKg,
                severity: 'info'
            };
            alertLevel = 'info';
        }
        // Critical low (under 10%)
        else if (currentWeight <= crop.initialWeightKg * 0.1) {
            alert = {
                type: 'critical_low',
                message: `Critical stock level: ${crop.name} has only ${currentWeight}kg remaining (${Math.round((currentWeight/crop.initialWeightKg) * 100)}% of initial stock)`,
                threshold: crop.initialWeightKg * 0.1,
                currentWeight,
                initialWeight: crop.initialWeightKg,
                severity: 'error'
            };
            alertLevel = 'error';
        }

        return {
            ...crop,
            status,
            alert,
            alertLevel,
            inventoryMetrics: {
                currentWeight,
                initialWeight: crop.initialWeightKg,
                stockPercentage: Math.round((currentWeight/crop.initialWeightKg) * 100),
                lowStockThreshold,
                surplusThreshold
            }
        };
    });
};

/**
 * Detect surplus inventory based on weight thresholds
 * @param {Array} crops - Array of crop objects
 * @returns {Array} - Array of crops with surplus status
 */
export const detectSurplusInventory = (crops) => {
    const cropsWithAlerts = setInventoryAlerts(crops);
    
    return cropsWithAlerts.filter(crop => 
        crop.alert && crop.alert.type === 'surplus'
    ).map(crop => ({
        cropId: crop._id,
        farmerId: crop.farmerId,
        name: crop.name,
        currentWeight: crop.inventoryMetrics.currentWeight,
        initialWeight: crop.inventoryMetrics.initialWeight,
        surplusAmount: crop.inventoryMetrics.currentWeight - crop.inventoryMetrics.initialWeight,
        recommendedAction: 'Consider bulk sales or price adjustments',
        alert: crop.alert
    }));
};

/**
 * Get comprehensive inventory analytics for a farmer
 * @param {Array} crops - Array of farmer's crops
 * @returns {Object} - Analytics summary
 */
export const getInventoryAnalytics = (crops) => {
    const cropsWithAlerts = setInventoryAlerts(crops);
    
    const analytics = {
        totalCrops: crops.length,
        lowStock: cropsWithAlerts.filter(c => c.alert?.type === 'low_stock').length,
        criticalLow: cropsWithAlerts.filter(c => c.alert?.type === 'critical_low').length,
        surplus: cropsWithAlerts.filter(c => c.alert?.type === 'surplus').length,
        available: cropsWithAlerts.filter(c => !c.alert).length,
        totalAlerts: cropsWithAlerts.filter(c => c.alert).length,
        alerts: cropsWithAlerts.filter(c => c.alert).map(c => ({
            cropId: c._id,
            cropName: c.name,
            alert: c.alert,
            alertLevel: c.alertLevel
        })),
        summary: {
            healthyStock: cropsWithAlerts.filter(c => !c.alert).length,
            needsAttention: cropsWithAlerts.filter(c => c.alert?.severity === 'warning' || c.alert?.severity === 'error').length,
            opportunities: cropsWithAlerts.filter(c => c.alert?.type === 'surplus').length
        }
    };

    return analytics;
};

/**
 * Generate inventory alerts for farmers based on their crops
 * @param {String} farmerId - Farmer's user ID
 * @param {Array} crops - Farmer's crops
 * @returns {Array} - Array of formatted alerts
 */
export const generateInventoryAlertsForFarmer = (farmerId, crops) => {
    const cropsWithAlerts = setInventoryAlerts(crops);
    const alertsOnly = cropsWithAlerts.filter(crop => crop.alert);

    return alertsOnly.map(crop => ({
        farmerId,
        cropId: crop._id,
        cropName: crop.name,
        alertType: crop.alert.type,
        message: crop.alert.message,
        severity: crop.alert.severity,
        currentWeight: crop.inventoryMetrics.currentWeight,
        threshold: crop.alert.threshold,
        recommendedActions: getRecommendedActions(crop.alert.type, crop),
        timestamp: new Date(),
        read: false
    }));
};

/**
 * Get recommended actions based on alert type
 * @param {String} alertType - Type of alert
 * @param {Object} crop - Crop object
 * @returns {Array} - Array of recommended actions
 */
const getRecommendedActions = (alertType, crop) => {
    switch (alertType) {
        case 'low_stock':
            return [
                'Consider restocking soon',
                'Review recent sales patterns',
                'Check if harvest is approaching'
            ];
        case 'critical_low':
            return [
                'Immediate restocking required',
                'Update availability status',
                'Consider removing from marketplace if no stock'
            ];
        case 'surplus':
            return [
                'Consider bulk sales discounts',
                'Promote on marketplace',
                'Check storage capacity and shelf life'
            ];
        default:
            return [];
    }
};

export const calculateReviewBasedScores = (reviews) => {
    const scores = reviews.reduce((acc, review) => {
        acc[review.cropId] = (acc[review.cropId] || 0) + review.rating;
        return acc;
    }, {});
    return scores;
};