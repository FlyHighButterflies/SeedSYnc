import { validationResult } from 'express-validator';
import validator from 'validator';

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
    const sanitizeValue = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    // Remove dangerous script tags and event handlers
                    let sanitized = obj[key]
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[removed]')
                        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[removed]')
                        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '[removed]')
                        .replace(/<embed[^>]*>/gi, '[removed]')
                        .replace(/<img[^>]*onerror[^>]*>/gi, '[removed]')
                        .replace(/javascript:/gi, '')
                        .replace(/on\w+\s*=/gi, '');
                    
                    // Don't completely remove content, just sanitize it
                    obj[key] = sanitized.trim();
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeValue(obj[key]);
                }
            }
        }
    };
    
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
        sanitizeValue(req.body);
        
        // Remove empty values (null, undefined, empty strings)
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
