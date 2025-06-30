import express from 'express';
import messageController from '../controllers/messageController.js';
import authMiddleware from "../middleware/auth.js";
import { 
    validateMessageCreation,
    handleValidationErrors,
    sanitizeInputs
} from "../validators/index.js";

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

// Create message - authenticated users only
router.post('/', 
    validateMessageCreation,
    handleValidationErrors,
    sanitizeInputs,
    messageController.createMessage
);

export default router;