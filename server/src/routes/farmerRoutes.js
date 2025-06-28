import express from 'express';
import farmerController from '../controllers/farmerController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, farmerController.getFarmerProfile);
router.patch('/profile', authMiddleware, farmerController.updateFarmerProfile);

export default router;
