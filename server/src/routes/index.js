import express from 'express';
import cropRoutes from './cropRoutes.js';

import reviewRoutes from './reviewRoutes.js';
import tradeRoutes from './tradeRoutes.js';

const router = express.Router();

router.use('/crops', cropRoutes);
router.use('/inventory', inventoryRoutes);

router.use('/reviews', reviewRoutes);
router.use('/trades', tradeRoutes);

export default router;