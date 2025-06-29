import crypto from 'crypto';

export const hashUserId = (userId) => {
    return crypto.createHash('sha256').update(userId).digest('hex');
};

export const hashCropKey = (farmerId, cropId) => {
    return crypto.createHash('sha256').update(`${farmerId}+${cropId}`).digest('hex');
};

export const hashInventoryId = (farmerId, cropId) => {
    return crypto.createHash('sha256').update(`${farmerId}+${cropId}`).digest('hex');
};

export const isCollision = (hash, existingHashes) => {
    return existingHashes.includes(hash);
};