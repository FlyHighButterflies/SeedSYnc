const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateUsername = (username) => {
    // 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
};

const validatePassword = (password) => {
    // At least 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};

const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
};

const validateCropData = (cropData) => {
    const errors = [];
    
    if (!cropData.name || typeof cropData.name !== 'string' || cropData.name.trim().length < 2) {
        errors.push('Crop name must be at least 2 characters');
    }
    
    if (!cropData.variety || typeof cropData.variety !== 'string' || cropData.variety.trim().length < 2) {
        errors.push('Crop variety must be at least 2 characters');
    }
    
    if (cropData.initialWeightKg !== undefined && (typeof cropData.initialWeightKg !== 'number' || cropData.initialWeightKg <= 0)) {
        errors.push('Initial weight must be a positive number');
    }
    
    if (cropData.pricePerKg !== undefined && (typeof cropData.pricePerKg !== 'number' || cropData.pricePerKg <= 0)) {
        errors.push('Price per kg must be a positive number');
    }
    
    if (cropData.description && typeof cropData.description !== 'string') {
        errors.push('Description must be a string');
    }
    
    if (cropData.location && (!cropData.location.latitude || !cropData.location.longitude)) {
        errors.push('Location must include both latitude and longitude');
    }
    
    return errors;
};

const validateTradeData = (tradeData) => {
    const errors = [];
    
    if (!tradeData.cropId || typeof tradeData.cropId !== 'string' || tradeData.cropId.trim().length === 0) {
        errors.push('Valid crop ID is required');
    }
    
    if (!tradeData.buyerId || typeof tradeData.buyerId !== 'string' || tradeData.buyerId.trim().length === 0) {
        errors.push('Valid buyer ID is required');
    }
    
    if (!tradeData.farmerId || typeof tradeData.farmerId !== 'string' || tradeData.farmerId.trim().length === 0) {
        errors.push('Valid farmer ID is required');
    }
    
    if (!tradeData.quantityKg || typeof tradeData.quantityKg !== 'number' || tradeData.quantityKg <= 0) {
        errors.push('Quantity must be a positive number');
    }
    
    if (!tradeData.pricePerKg || typeof tradeData.pricePerKg !== 'number' || tradeData.pricePerKg <= 0) {
        errors.push('Price per kg must be a positive number');
    }
    
    return errors;
};

const validateInventoryData = (inventoryData) => {
    const errors = [];
    
    if (!inventoryData.farmerId || typeof inventoryData.farmerId !== 'string') {
        errors.push('Valid farmer ID is required');
    }
    
    if (!inventoryData.cropId || typeof inventoryData.cropId !== 'string') {
        errors.push('Valid crop ID is required');
    }
    
    if (inventoryData.currentStock !== undefined && (typeof inventoryData.currentStock !== 'number' || inventoryData.currentStock < 0)) {
        errors.push('Current stock must be a non-negative number');
    }
    
    if (inventoryData.reservedStock !== undefined && (typeof inventoryData.reservedStock !== 'number' || inventoryData.reservedStock < 0)) {
        errors.push('Reserved stock must be a non-negative number');
    }
    
    return errors;
};

const validateUserData = (userData) => {
    const errors = [];
    
    if (!userData.username || !validateUsername(userData.username)) {
        errors.push('Username must be 3-30 characters, alphanumeric and underscores only');
    }
    
    if (!userData.email || !validateEmail(userData.email)) {
        errors.push('Valid email address is required');
    }
    
    if (!userData.password || !validatePassword(userData.password)) {
        errors.push('Password must be at least 8 characters with at least one letter and one number');
    }
    
    if (!userData.role || !['farmer', 'buyer'].includes(userData.role)) {
        errors.push('Role must be either "farmer" or "buyer"');
    }
    
    if (userData.phoneNumber && !/^\+?[\d\s\-\(\)]{10,15}$/.test(userData.phoneNumber)) {
        errors.push('Invalid phone number format');
    }
    
    return errors;
};

const validateSearchParams = (searchParams) => {
    const errors = [];
    
    if (searchParams.query && typeof searchParams.query !== 'string') {
        errors.push('Search query must be a string');
    }
    
    if (searchParams.priceMin !== undefined && (typeof searchParams.priceMin !== 'number' || searchParams.priceMin < 0)) {
        errors.push('Minimum price must be a non-negative number');
    }
    
    if (searchParams.priceMax !== undefined && (typeof searchParams.priceMax !== 'number' || searchParams.priceMax < 0)) {
        errors.push('Maximum price must be a non-negative number');
    }
    
    if (searchParams.priceMin !== undefined && searchParams.priceMax !== undefined && searchParams.priceMin > searchParams.priceMax) {
        errors.push('Minimum price cannot be greater than maximum price');
    }
    
    if (searchParams.location && (!searchParams.location.latitude || !searchParams.location.longitude)) {
        errors.push('Location must include both latitude and longitude');
    }
    
    if (searchParams.radius !== undefined && (typeof searchParams.radius !== 'number' || searchParams.radius <= 0)) {
        errors.push('Search radius must be a positive number');
    }
    
    return errors;
};

const validatePagination = (page, limit) => {
    const errors = [];
    
    if (page !== undefined && (!Number.isInteger(page) || page < 1)) {
        errors.push('Page must be a positive integer');
    }
    
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
        errors.push('Limit must be a positive integer between 1 and 100');
    }
    
    return errors;
};

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
    sanitizeInput,
    validateCropData,
    validateTradeData,
    validateInventoryData,
    validateUserData,
    validateSearchParams,
    validatePagination,
};
