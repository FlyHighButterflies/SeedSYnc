import express from 'express';
import buyerController from '../controllers/buyerController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, buyerController.getBuyerProfile);
router.patch('/profile', authMiddleware, buyerController.updateBuyerProfile);

export default router;
