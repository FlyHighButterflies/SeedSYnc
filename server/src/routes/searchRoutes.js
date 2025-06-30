import express from 'express';
import searchController from '../controllers/searchController.js';
import { optionalAuth } from "../middleware/auth.js";
import { searchRateLimit } from "../middleware/security.js";
import { 
    validateCropSearch, 
    validateSearchSuggestions,
    handleValidationErrors,
    sanitizeInputs 
} from "../validators/index.js";

const router = express.Router();

// Apply search-specific rate limiting
router.use(searchRateLimit);

// Enhanced crop search with BMHS algorithm - public endpoint with optional auth
router.get('/search_crops', 
    optionalAuth,
    validateCropSearch,
    handleValidationErrors,
    sanitizeInputs,
    searchController.searchCrops
);

// Search suggestions endpoint - public with optional auth
router.get('/search_suggestions', 
    optionalAuth,
    validateSearchSuggestions,
    handleValidationErrors,
    sanitizeInputs,
    searchController.getSearchSuggestions
);

export default router;
