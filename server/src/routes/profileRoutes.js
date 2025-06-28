import express from 'express';
import profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authMiddleware, profileController.getMyProfile);
router.patch('/me', authMiddleware, profileController.updateMyProfile);

export default router;
