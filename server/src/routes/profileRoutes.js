import express from 'express';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';
import { 
    validateUserUpdate,
    handleValidationErrors,
    sanitizeInputs 
} from '../validators/index.js';

const router = express.Router();

router.get('/me', authMiddleware, profileController.getMyProfile);
router.patch('/me', 
    authMiddleware, 
    validateUserUpdate,
    handleValidationErrors,
    sanitizeInputs,
    profileController.updateMyProfile
);

export default router;
