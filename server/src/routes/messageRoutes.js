import express from 'express';
import messageController from '../controllers/messageController.js';
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

// Create message - authenticated users only
router.post('/', messageController.createMessage);

export default router;