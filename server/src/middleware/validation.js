import {
    validateUserData,
    validateCropData,
    validateTradeData,
    validateInventoryData,
    validateRegistrationData,
    validateSearchParams,
    validateLocationData,
    validateBusinessInfo,
    sanitizeInput
} from '../utils/validation.js';

// Generic validation middleware creator
const createValidationMiddleware = (validator, dataSource = 'body') => {
    return (req, res, next) => {
        try {
            const data = req[dataSource];
            const errors = validator(data);
            
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors
                });
            }
            
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Validation error occurred'
            });
        }
    };
};

// Specific validation middleware for different data types
export const validateUser = createValidationMiddleware(validateUserData);
export const validateCrop = createValidationMiddleware(validateCropData);
export const validateTrade = createValidationMiddleware(validateTradeData);
export const validateInventory = createValidationMiddleware(validateInventoryData);
export const validateRegistration = createValidationMiddleware(validateRegistrationData);
export const validateSearch = createValidationMiddleware(validateSearchParams, 'query');
export const validateLocation = createValidationMiddleware(validateLocationData);

// Business info validation (needs role context)
export const validateBusiness = (req, res, next) => {
    try {
        const data = req.body;
        const role = data.role || req.user?.role;
        
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Role is required for business info validation'
            });
        }
        
        const errors = validateBusinessInfo(data, role);
        
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Business info validation failed',
                errors: errors
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Business validation error occurred'
        });
    }
};

// Input sanitization middleware
export const sanitizeInputMiddleware = (req, res, next) => {
    try {
        if (req.body) {
            req.body = sanitizeInput(req.body);
        }
        if (req.query) {
            req.query = sanitizeInput(req.query);
        }
        if (req.params) {
            req.params = sanitizeInput(req.params);
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Input sanitization failed'
        });
    }
};

// Combined validation for user registration
export const validateUserRegistration = (req, res, next) => {
    try {
        // Sanitize input first
        if (req.body) {
            req.body = sanitizeInput(req.body);
        }
        
        // Validate registration data
        const errors = validateRegistrationData(req.body);
        
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Registration validation failed',
                errors: errors
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Registration validation error occurred'
        });
    }
};

// Validate ObjectId parameters
export const validateObjectId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        
        if (!id || !objectIdRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format`
            });
        }
        
        next();
    };
};

// Validate pagination parameters
export const validatePagination = (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        if (page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page must be a positive integer'
            });
        }
        
        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }
        
        req.pagination = { page, limit };
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Pagination validation failed'
        });
    }
};

// File upload validation
export const validateFileUpload = (allowedTypes = ['image/jpeg', 'image/png'], maxSize = 5 * 1024 * 1024) => {
    return (req, res, next) => {
        if (!req.file) {
            return next();
        }
        
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
            });
        }
        
        if (req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
            });
        }
        
        next();
    };
};
