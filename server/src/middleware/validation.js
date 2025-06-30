// This file now uses express-validator for standardized validation
// Import the new validation system
import {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validateCropCreation,
    validateCropUpdate,
    validateCropSearch,
    validateTradeCreation,
    validateTradeUpdate,
    validateObjectId as validateObjectIdValidator,
    handleValidationErrors,
    sanitizeInputs
} from '../validators/index.js';

// Re-export the new validators with legacy names for backward compatibility
export const validateUser = validateUserUpdate;
export const validateCrop = validateCropCreation;
export const validateTrade = validateTradeCreation;
export const validateRegistration = validateUserRegistration;
export const validateSearch = validateCropSearch;

// Export the new validation handlers
export { handleValidationErrors, sanitizeInputs };

// Legacy middleware adapter for ObjectId validation
export const validateObjectId = (paramName = 'id') => {
    return validateObjectIdValidator(paramName);
};

// Legacy middleware for backward compatibility
export const sanitizeInputMiddleware = sanitizeInputs;
