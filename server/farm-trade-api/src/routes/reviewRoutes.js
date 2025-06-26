const express = require('express');
const ReviewController = require('../controllers/reviewController');

const router = express.Router();
const reviewController = new ReviewController();

// Routes for managing reviews
router.post('/', reviewController.createReview.bind(reviewController));
router.get('/', reviewController.getReviews.bind(reviewController));
router.put('/:id', reviewController.updateReview.bind(reviewController));
router.delete('/:id', reviewController.deleteReview.bind(reviewController));

module.exports = router;