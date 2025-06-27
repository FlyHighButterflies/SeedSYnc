export const detectSurplusInventory = (inventory) => {
    const surplusItems = inventory.filter(item => item.quantity > item.threshold);
    return surplusItems;
};

export const setInventoryAlerts = (inventory) => {
    const alerts = inventory.map(item => {
        if (item.quantity < item.lowThreshold) {
            return { cropId: item.cropId, alert: 'Low inventory alert' };
        } else if (item.quantity > item.highThreshold) {
            return { cropId: item.cropId, alert: 'High inventory alert' };
        }
        return null;
    }).filter(alert => alert !== null);
    return alerts;
};

export const calculateReviewBasedScores = (reviews) => {
    const scores = reviews.reduce((acc, review) => {
        acc[review.cropId] = (acc[review.cropId] || 0) + review.rating;
        return acc;
    }, {});
    return scores;
};