import express from 'express';
import authController from '../controllers/authController.js';
import { authRateLimit, accountLockout } from '../middleware/security.js';
import { 
    validateUserRegistration, 
    validateUserLogin, 
    handleValidationErrors,
    sanitizeInputs 
} from '../validators/index.js';

const router = express.Router();

// Apply strict rate limiting and account lockout to auth routes
router.use(authRateLimit);
router.use(accountLockout);

// Registration with comprehensive validation
router.post('/register', 
    validateUserRegistration,
    handleValidationErrors,
    sanitizeInputs,
    authController.register
);

// Login with validation
router.post('/login', 
    validateUserLogin,
    handleValidationErrors,
    sanitizeInputs,
    authController.login
);

export default router;
