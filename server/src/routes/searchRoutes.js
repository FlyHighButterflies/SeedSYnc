import express from 'express';
import searchController from '../controllers/searchController.js';

const router = express.Router();

router.get('/search_crops', searchController.searchCrops);

export default router;
