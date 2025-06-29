import express from 'express';
import searchController from '../controllers/searchController.js';

const router = express.Router();

// Enhanced crop search with BMHS algorithm
router.get('/search_crops', searchController.searchCrops);

// Search suggestions endpoint
router.get('/search_suggestions', searchController.getSearchSuggestions);

export default router;
