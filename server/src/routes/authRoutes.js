import express from 'express';
import authController from '../controllers/authController.js';
import { authRateLimit, accountLockout } from '../middleware/security.js';
import { validateUserRegistration, validateUser, sanitizeInputMiddleware } from '../middleware/validation.js';

const router = express.Router();

// Apply strict rate limiting and account lockout to auth routes
router.use(authRateLimit);
router.use(accountLockout);

// Registration with comprehensive validation
router.post('/register', 
    sanitizeInputMiddleware,
    validateUserRegistration,
    authController.register
);

// Login with basic validation and security
router.post('/login', 
    sanitizeInputMiddleware,
    authController.login
);

export default router;
