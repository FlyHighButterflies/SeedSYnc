import express from 'express';
import searchController from '../controllers/searchController.js';
import { optionalAuth } from "../middleware/auth.js";
import { searchRateLimit } from "../middleware/security.js";
import { validateSearch } from "../middleware/validation.js";

const router = express.Router();

// Apply search-specific rate limiting
router.use(searchRateLimit);

// Enhanced crop search with BMHS algorithm - public endpoint with optional auth
router.get('/search_crops', 
    optionalAuth,
    validateSearch,
    searchController.searchCrops
);

// Search suggestions endpoint - public with optional auth
router.get('/search_suggestions', 
    optionalAuth,
    searchController.getSearchSuggestions
);

export default router;
