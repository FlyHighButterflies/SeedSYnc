const crypto = require('crypto');

const hashUserId = (userId) => {
    return crypto.createHash('sha256').update(userId).digest('hex');
};

const hashCropKey = (farmerId, cropId) => {
    return crypto.createHash('sha256').update(`${farmerId}+${cropId}`).digest('hex');
};

const hashInventoryId = (farmerId, cropId) => {
    return crypto.createHash('sha256').update(`${farmerId}+${cropId}`).digest('hex');
};

const isCollision = (hash, existingHashes) => {
    return existingHashes.includes(hash);
};

module.exports = {
    hashUserId,
    hashCropKey,
    hashInventoryId,
    isCollision
};