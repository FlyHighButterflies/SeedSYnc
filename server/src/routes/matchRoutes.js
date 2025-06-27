import express from 'express';
import matchController from '../controllers/matchController.js';

const router = express.Router();

router.post('/', matchController.createMatch);

export default router;