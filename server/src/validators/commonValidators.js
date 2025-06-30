import { body, param, query } from 'express-validator';

// Review Creation Validation (user input only)
export const validateReviewCreation = [
    body('tradeId')
        .isMongoId()
        .withMessage('Valid trade ID is required'),
    
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
        .toInt(),
    
    body('comment')
        .optional()
        .isLength({ min: 5, max: 500 })
        .withMessage('Comment must be between 5 and 500 characters')
        .trim()
        .escape(),
    
    body('reviewType')
        .isIn(['farmer_to_buyer', 'buyer_to_farmer'])
        .withMessage('Review type must be either farmer_to_buyer or buyer_to_farmer'),
];

// Message Creation Validation
export const validateMessageCreation = [
    body('receiverId')
        .isMongoId()
        .withMessage('Valid receiver ID is required'),
    
    body('content')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message content must be between 1 and 1000 characters')
        .trim()
        .escape(),
    
    body('subject')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Subject must be between 1 and 100 characters')
        .trim()
        .escape(),
    
    body('messageType')
        .optional()
        .isIn(['general', 'trade_inquiry', 'trade_update', 'support'])
        .withMessage('Message type must be one of: general, trade_inquiry, trade_update, support'),
];

// Search Suggestions Validation
export const validateSearchSuggestions = [
    query('query')
        .isLength({ min: 1, max: 50 })
        .withMessage('Search query must be between 1 and 50 characters')
        .trim()
        .escape(),
];

// Pagination Validation (reusable)
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
];

// Generic ID Parameter Validation
export const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName} format`),
];

// File Upload Validation (if implementing file uploads)
export const validateFileUpload = [
    body('fileType')
        .optional()
        .isIn(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
        .withMessage('File type must be JPEG, PNG, WebP, or PDF'),
    
    body('fileSize')
        .optional()
        .isInt({ max: 5242880 }) // 5MB max
        .withMessage('File size must not exceed 5MB'),
];

// Location Validation (reusable)
export const validateLocation = [
    body('latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90')
        .toFloat(),
    
    body('longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180')
        .toFloat(),
    
    body('address')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Address must be between 5 and 200 characters')
        .trim()
        .escape(),
];

// Notification Preferences Validation
export const validateNotificationPreferences = [
    body('emailNotifications')
        .optional()
        .isBoolean()
        .withMessage('Email notifications must be true or false'),
    
    body('smsNotifications')
        .optional()
        .isBoolean()
        .withMessage('SMS notifications must be true or false'),
    
    body('pushNotifications')
        .optional()
        .isBoolean()
        .withMessage('Push notifications must be true or false'),
    
    body('notificationTypes')
        .optional()
        .isArray()
        .withMessage('Notification types must be an array'),
    
    body('notificationTypes.*')
        .optional()
        .isIn(['trade_updates', 'inventory_alerts', 'new_matches', 'messages', 'reviews'])
        .withMessage('Invalid notification type'),
];
