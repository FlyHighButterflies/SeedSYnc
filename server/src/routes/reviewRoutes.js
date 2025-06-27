import express from "express";
import ReviewController from "../controllers/reviewController.js";
import Review from "../models/ReviewModel.js";

const router = express.Router();
const reviewController = new ReviewController(Review);

// Routes for managing reviews
router.post("/", reviewController.createReview.bind(reviewController));
router.get("/", reviewController.getReviews.bind(reviewController));
router.put("/:id", reviewController.updateReview.bind(reviewController));
router.delete("/:id", reviewController.deleteReview.bind(reviewController));

export default router;
