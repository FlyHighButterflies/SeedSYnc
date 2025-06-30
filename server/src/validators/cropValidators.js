import { body, query, param } from 'express-validator';

// Crop Creation Validation (user input only)
export const validateCropCreation = [
    body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('Crop name must be between 2 and 100 characters')
        .trim()
        .escape(),
    
    body('variety')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Crop variety must be between 2 and 100 characters')
        .trim()
        .escape(),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
        .trim()
        .escape(),
    
    // Farmer-side fields
    body('initialWeightKg')
        .optional()
        .isFloat({ min: 0.1 })
        .withMessage('Initial weight must be a positive number')
        .toFloat(),
    
    body('pricePerKg')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price per kg must be a positive number')
        .toFloat(),
    
    body('harvestDate')
        .optional()
        .isISO8601()
        .withMessage('Harvest date must be a valid date')
        .toDate(),
    
    // Buyer-side fields
    body('weightNeededKg')
        .optional()
        .isFloat({ min: 0.1 })
        .withMessage('Weight needed must be a positive number')
        .toFloat(),
    
    body('budgetPerKg')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Budget per kg must be a positive number')
        .toFloat(),
    
    body('dateNeeded')
        .optional()
        .isISO8601()
        .withMessage('Date needed must be a valid date')
        .toDate(),
    
    body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Expiry date must be a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expiry date must be in the future');
            }
            return true;
        })
        .toDate(),
    
    // Location data (optional)
    body('location.latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90')
        .toFloat(),
    
    body('location.longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180')
        .toFloat(),
];

// Crop Update Validation
export const validateCropUpdate = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Crop name must be between 2 and 100 characters')
        .trim()
        .escape(),
    
    body('variety')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Crop variety must be between 2 and 100 characters')
        .trim()
        .escape(),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
        .trim()
        .escape(),
    
    body('currentWeightKg')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Current weight must be a non-negative number')
        .toFloat(),
    
    body('pricePerKg')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price per kg must be a positive number')
        .toFloat(),
    
    body('budgetPerKg')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Budget per kg must be a positive number')
        .toFloat(),
    
    body('status')
        .optional()
        .isIn(['available', 'matched', 'sold', 'expired'])
        .withMessage('Status must be one of: available, matched, sold, expired'),
    
    body('expiryDate')
        .optional()
        .isISO8601()
        .withMessage('Expiry date must be a valid date')
        .toDate(),
];

// Crop ID Parameter Validation
export const validateCropId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid crop ID format'),
];

// Farmer ID Parameter Validation
export const validateFarmerId = [
    param('farmerId')
        .isMongoId()
        .withMessage('Invalid farmer ID format'),
];

// Crop Search Query Validation
export const validateCropSearch = [
    query('query')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
        .trim()
        .escape(),
    
    query('type')
        .optional()
        .isIn(['exact', 'fuzzy', 'multi'])
        .withMessage('Search type must be one of: exact, fuzzy, multi'),
    
    query('role')
        .optional()
        .isIn(['farmer', 'buyer'])
        .withMessage('Role filter must be either farmer or buyer'),
    
    query('status')
        .optional()
        .isIn(['available', 'matched', 'sold', 'expired'])
        .withMessage('Status must be one of: available, matched, sold, expired'),
    
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a non-negative number')
        .toFloat(),
    
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a non-negative number')
        .toFloat(),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer')
        .toInt(),
    
    // Custom validation for price range
    query('maxPrice')
        .optional()
        .custom((value, { req }) => {
            if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
                throw new Error('Maximum price cannot be less than minimum price');
            }
            return true;
        }),
];
