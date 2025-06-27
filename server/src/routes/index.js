import express from 'express';
import cropRoutes from './cropRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import tradeRoutes from './tradeRoutes.js';
import searchRoutes from './searchRoutes.js';

const router = express.Router();

router.use('/crops', cropRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/trades', tradeRoutes);
router.use('/', searchRoutes);

export default router;