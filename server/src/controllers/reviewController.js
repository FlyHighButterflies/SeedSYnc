import { io, userSockets } from "../server.js";
import Review from "../models/ReviewModel.js";
import { sendPushNotification } from "../services/notificationService.js";
import User from "../models/UserModel.js";
import { hashUserId } from '../utils/hash.js';

class ReviewController {
    hashReviewResponse(review) {
        return {
            ...review.toObject(),
            reviewer: review.reviewer ? hashUserId(review.reviewer.toString()) : null,
            reviewee: review.reviewee ? hashUserId(review.reviewee.toString()) : null,
        };
    }

    async createReview(req, res) {
        try {
            // The request body should contain the trade ID, reviewer ID, reviewee ID, rating, and comment.
            const { tradeId, reviewerId, reviewedUserId, rating, comment } = req.body;

            // Find the users to ensure they exist.
            const reviewerUser = await User.findById(reviewerId);
            const revieweeUser = await User.findById(reviewedUserId);

            if (!reviewerUser || !revieweeUser) {
                return res
                    .status(404)
                    .json({ message: "Reviewer or Reviewee not found." });
            }

            // Create a new review instance using the correct schema fields.
            const review = new Review({
                reviewerId,
                reviewedUserId,
                rating,
                comment,
            });
            await review.save();

            // After saving, the review object has the generated compositeKey and _id.

            // Emit a real-time event to the reviewed user.
            const recipientSocketId = userSockets.get(reviewedUserId);
            if (recipientSocketId) {
                // It's best to emit a consistent, hashed response.
                const responseReview = {
                    ...review.toObject(),
                    reviewerId: hashUserId(review.reviewerId.toString()),
                    reviewedUserId: hashUserId(review.reviewedUserId.toString()),
                };
                io.to(recipientSocketId).emit("review:create", responseReview);
            }

            // Send a push notification to the reviewed user.
            await sendPushNotification(
                reviewedUserId,
                "New Review Received!",
                `You have received a new ${rating}-star review.`,
                {
                    type: "new_review",
                    reviewId: review._id.toString(),
                    tradeId: tradeId, // Use tradeId from the request body.
                }
            );

            // Construct a hashed response to send back to the client who made the request.
            const finalResponse = {
                ...review.toObject(),
                reviewerId: hashUserId(review.reviewerId.toString()),
                reviewedUserId: hashUserId(review.reviewedUserId.toString()),
            };

            res.status(201).json(finalResponse);
        } catch (error) {
            // If the error is a duplicate key error, it means a review already exists.
            if (error.code === 11000) {
                return res.status(409).json({ message: "You have already submitted a review for this user." });
            }
            res.status(400).json({ message: error.message });
        }
    }

    async getReviews(req, res) {
        try {
            const userId = req.user._id; // Authenticated user's ID
            const userRole = req.user.role; // Authenticated user's role

            const reviews = await Review.find({
                $or: [
                    { reviewer: userId, reviewerType: userRole },
                    { reviewee: userId, revieweeType: userRole },
                ],
            })
                .populate("trade")
                .populate("reviewer")
                .populate("reviewee");

            res.status(200).json(reviews.map(r => this.hashReviewResponse(r)));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id; // Authenticated user's ID
            const userRole = req.user.role; // Authenticated user's role

            const review = await Review.findOneAndUpdate(
                { _id: id, reviewer: userId, reviewerType: userRole }, // Only allow the reviewer to update their review
                req.body,
                { new: true }
            );

            if (!review) {
                return res.status(404).json({
                    message: "Review not found or not authorized to update",
                });
            }
            res.status(200).json(this.hashReviewResponse(review));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id; // Authenticated user's ID
            const userRole = req.user.role; // Authenticated user's role

            const review = await Review.findOneAndDelete({
                _id: id,
                reviewer: userId,
                reviewerType: userRole,
            }); // Only allow the reviewer to delete their review

            if (!review) {
                return res.status(404).json({
                    message: "Review not found or not authorized to delete",
                });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ReviewController;
