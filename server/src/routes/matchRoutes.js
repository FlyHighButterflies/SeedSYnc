import express from 'express';
import matchController from '../controllers/matchController.js';
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All match routes require authentication
router.use(authMiddleware);

// Create match - authenticated users only
router.post('/', matchController.createMatch);

export default router;