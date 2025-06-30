import { validationResult } from 'express-validator';

/**
 * Express-validator error handling middleware
 * This middleware processes validation results and returns standardized error responses
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Format errors for consistent API response
        const formattedErrors = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value,
            location: error.location
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
            errorCount: formattedErrors.length
        });
    }
    
    next();
};

/**
 * Sanitization middleware to clean user input
 * This runs after validation to ensure data is properly sanitized
 */
export const sanitizeInputs = (req, res, next) => {
    // Additional custom sanitization if needed
    // The express-validator already handles most sanitization
    
    // Remove any null or undefined values from body
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === null || req.body[key] === undefined || req.body[key] === '') {
                delete req.body[key];
            }
        });
    }
    
    next();
};

/**
 * Optional validation middleware - continues even if validation fails
 * Useful for optional fields that might be validated in middleware but not required
 */
export const handleOptionalValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    // Add validation results to request object for controllers to access
    req.validationErrors = errors.isEmpty() ? null : errors.array();
    
    next();
};

// Re-export validation functions for backward compatibility
export {
    // Legacy function names for existing code compatibility
    sanitizeInputs as sanitizeInputMiddleware
};
