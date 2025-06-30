import { body, param } from 'express-validator';

// Trade Creation Validation (user input only)
export const validateTradeCreation = [
    body('cropId')
        .isMongoId()
        .withMessage('Valid crop ID is required'),
    
    body('quantityKg')
        .isFloat({ min: 0.01 })
        .withMessage('Quantity must be a positive number')
        .toFloat(),
    
    body('pricePerKg')
        .isFloat({ min: 0.01 })
        .withMessage('Price per kg must be a positive number')
        .toFloat(),
    
    body('deliveryAddress')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Delivery address must be between 5 and 200 characters')
        .trim()
        .escape(),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters')
        .trim()
        .escape(),
    
    body('deliveryDate')
        .optional()
        .isISO8601()
        .withMessage('Delivery date must be a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Delivery date must be in the future');
            }
            return true;
        })
        .toDate(),
];

// Trade Update Validation
export const validateTradeUpdate = [
    body('status')
        .optional()
        .isIn(['pending', 'accepted', 'rejected', 'completed', 'cancelled'])
        .withMessage('Status must be one of: pending, accepted, rejected, completed, cancelled'),
    
    body('quantityKg')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Quantity must be a positive number')
        .toFloat(),
    
    body('pricePerKg')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price per kg must be a positive number')
        .toFloat(),
    
    body('deliveryAddress')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Delivery address must be between 5 and 200 characters')
        .trim()
        .escape(),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters')
        .trim()
        .escape(),
    
    body('deliveryDate')
        .optional()
        .isISO8601()
        .withMessage('Delivery date must be a valid date')
        .toDate(),
];

// Trade ID Parameter Validation
export const validateTradeId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid trade ID format'),
];
