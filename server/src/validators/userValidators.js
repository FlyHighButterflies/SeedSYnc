import { body, query, param } from 'express-validator';

// User Registration Validation
export const validateUserRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
        .withMessage('Password must contain at least one letter and one number'),
    
    body('fullName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Full name must be 2-50 characters, letters, spaces, hyphens, apostrophes only')
        .trim(),
    
    body('firstName')
        .if(body('fullName').not().exists())
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('First name must be 2-50 characters, letters, spaces, hyphens, apostrophes only')
        .trim(),
    
    body('lastName')
        .if(body('fullName').not().exists())
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Last name must be 2-50 characters, letters, spaces, hyphens, apostrophes only')
        .trim(),
    
    body('contactNumber')
        .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
        .withMessage('Please provide a valid contact number')
        .trim(),
    
    body('address')
        .isLength({ min: 5, max: 200 })
        .withMessage('Address must be between 5 and 200 characters')
        .trim(),
    
    body('role')
        .isIn(['farmer', 'buyer'])
        .withMessage('Role must be either "farmer" or "buyer"')
        .toLowerCase(),
    
    body('terms')
        .isBoolean()
        .equals('true')
        .withMessage('You must agree to the terms and conditions'),
    
    // Location validation (optional)
    body('country')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Country must be between 2 and 50 characters')
        .trim(),
    
    body('province')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Province/Region must be between 2 and 50 characters')
        .trim(),
    
    body('city')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('City/Town must be between 2 and 50 characters')
        .trim(),
    
    // Business information validation (role-specific)
    body('certifications')
        .optional()
        .isIn(['organic', 'non-gmo', 'fair-trade', 'none'])
        .withMessage('Invalid certification type'),
    
    body('farmingPractices')
        .optional()
        .isIn(['sustainable', 'eco-friendly', 'water-efficient', 'traditional'])
        .withMessage('Invalid farming practice'),
    
    body('qualityStandards')
        .optional()
        .isIn(['organic', 'non-gmo', 'fair-trade', 'any'])
        .withMessage('Invalid quality standard'),
    
    body('frequency')
        .optional()
        .isIn(['weekly', 'monthly', 'quarterly', 'as-needed'])
        .withMessage('Invalid purchase frequency'),
];

// User Login Validation
export const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// User Profile Update Validation
export const validateUserUpdate = [
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('fullName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Full name must be 2-50 characters, letters, spaces, hyphens, apostrophes only')
        .trim(),
    
    body('contactNumber')
        .optional()
        .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
        .withMessage('Please provide a valid contact number')
        .trim(),
    
    body('address')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Address must be between 5 and 200 characters')
        .trim(),
    
    // Location updates
    body('country')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Country must be between 2 and 50 characters')
        .trim(),
    
    body('province')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Province/Region must be between 2 and 50 characters')
        .trim(),
    
    body('city')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('City/Town must be between 2 and 50 characters')
        .trim(),
];

// Password Change Validation
export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
        .withMessage('New password must contain at least one letter and one number'),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match');
            }
            return true;
        }),
];

// User ID Parameter Validation
export const validateUserId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
];
