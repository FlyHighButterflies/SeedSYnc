import express from "express";
import ReviewController from "../controllers/reviewController.js";
import Review from "../models/ReviewModel.js";
import authMiddleware, { checkOwnership } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validation.js";

const router = express.Router();
const reviewController = new ReviewController(Review);

// All review routes require authentication
router.use(authMiddleware);

// Create review - authenticated users only
router.post("/", reviewController.createReview.bind(reviewController));

// Get reviews - public read access for authenticated users
router.get("/", reviewController.getReviews.bind(reviewController));

// Update review - only review author can update
router.put("/:id", 
    validateObjectId('id'),
    checkOwnership('reviewerId'), // Assuming reviews have reviewerId field
    reviewController.updateReview.bind(reviewController)
);

// Delete review - only review author can delete
router.delete("/:id", 
    validateObjectId('id'),
    checkOwnership('reviewerId'),
    reviewController.deleteReview.bind(reviewController)
);

export default router;
