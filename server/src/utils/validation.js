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

const validateName = (name) => {
    // 2-50 characters, letters, spaces, hyphens, apostrophes only
    const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
    return nameRegex.test(name);
};

const validatePhoneNumber = (phoneNumber) => {
    // International format with optional country code
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phoneNumber);
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
    
    // Email validation
    if (!userData.email || !validateEmail(userData.email)) {
        errors.push('Valid email address is required');
    }
    
    // Full name validation (matches model) OR first/last name
    if (userData.fullName) {
        if (!validateName(userData.fullName)) {
            errors.push('Full name must be 2-50 characters, letters, spaces, hyphens, apostrophes only');
        }
    } else if (userData.firstName && userData.lastName) {
        if (!validateName(userData.firstName)) {
            errors.push('First name must be 2-50 characters, letters, spaces, hyphens, apostrophes only');
        }
        if (!validateName(userData.lastName)) {
            errors.push('Last name must be 2-50 characters, letters, spaces, hyphens, apostrophes only');
        }
    } else {
        errors.push('Full name or first and last names are required');
    }
    
    // Password validation
    if (!userData.password || !validatePassword(userData.password)) {
        errors.push('Password must be at least 8 characters with at least one letter and one number');
    }
    
    // Contact number validation (matches model field name)
    if (!userData.contactNumber || !validatePhoneNumber(userData.contactNumber)) {
        errors.push('Valid contact number is required');
    }
    
    // Address validation
    if (!userData.address || typeof userData.address !== 'string' || userData.address.trim().length < 5) {
        errors.push('Address must be at least 5 characters');
    }
    
    // Role validation
    if (!userData.role || !['farmer', 'buyer'].includes(userData.role.toLowerCase())) {
        errors.push('Role must be either "farmer" or "buyer"');
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

const validateLocationData = (locationData) => {
    const errors = [];
    
    if (!locationData.country || typeof locationData.country !== 'string' || locationData.country.trim().length < 2) {
        errors.push('Country must be at least 2 characters');
    }
    
    if (!locationData.province || typeof locationData.province !== 'string' || locationData.province.trim().length < 2) {
        errors.push('Province/Region must be at least 2 characters');
    }
    
    if (!locationData.city || typeof locationData.city !== 'string' || locationData.city.trim().length < 2) {
        errors.push('City/Town must be at least 2 characters');
    }
    
    if (!locationData.address || typeof locationData.address !== 'string' || locationData.address.trim().length < 5) {
        errors.push('Address must be at least 5 characters');
    }
    
    if (locationData.landmarks && typeof locationData.landmarks !== 'string') {
        errors.push('Landmarks must be a string');
    }
    
    if (locationData.highway && !['yes', 'no'].includes(locationData.highway)) {
        errors.push('Highway access must be "yes" or "no"');
    }
    
    if (locationData.port && !['yes', 'no'].includes(locationData.port)) {
        errors.push('Port access must be "yes" or "no"');
    }
    
    if (locationData.transportation && !['boat', 'truck', 'on-foot'].includes(locationData.transportation)) {
        errors.push('Transportation mode must be "boat", "truck", or "on-foot"');
    }
    
    return errors;
};

const validateBusinessInfo = (businessData, role) => {
    const errors = [];
    
    if (role === 'farmer') {
        if (businessData.certifications && !['organic', 'non-gmo', 'fair-trade', 'none'].includes(businessData.certifications)) {
            errors.push('Invalid certification type');
        }
        
        if (businessData.farmingPractices && !['sustainable', 'eco-friendly', 'water-efficient', 'traditional'].includes(businessData.farmingPractices)) {
            errors.push('Invalid farming practice');
        }
    } else if (role === 'buyer') {
        if (businessData.qualityStandards && !['organic', 'non-gmo', 'fair-trade', 'any'].includes(businessData.qualityStandards)) {
            errors.push('Invalid quality standard');
        }
        
        if (businessData.frequency && !['weekly', 'monthly', 'quarterly', 'as-needed'].includes(businessData.frequency)) {
            errors.push('Invalid purchase frequency');
        }
    }
    
    return errors;
};

const validateRegistrationData = (registrationData) => {
    const errors = [];
    
    // Validate basic user data
    errors.push(...validateUserData(registrationData));
    
    // Validate location data if provided
    if (registrationData.country || registrationData.province || registrationData.city) {
        errors.push(...validateLocationData(registrationData));
    }
    
    // Validate business information if provided
    if (registrationData.role && (registrationData.certifications || registrationData.farmingPractices || registrationData.qualityStandards || registrationData.frequency)) {
        errors.push(...validateBusinessInfo(registrationData, registrationData.role));
    }
    
    // Validate terms acceptance
    if (!registrationData.terms) {
        errors.push('You must agree to the terms and conditions');
    }
    
    return errors;
};

export {
    validateEmail,
    validateUsername,
    validatePassword,
    validateName,
    validatePhoneNumber,
    sanitizeInput,
    validateCropData,
    validateTradeData,
    validateInventoryData,
    validateUserData,
    validateLocationData,
    validateBusinessInfo,
    validateRegistrationData,
    validateSearchParams,
    validatePagination,
};
