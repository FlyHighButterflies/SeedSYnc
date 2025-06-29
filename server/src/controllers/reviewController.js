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
            // Assuming req.body contains trade, reviewer, reviewee, rating, comment
            const { trade, reviewer, reviewee, rating, comment } = req.body;

            const reviewerUser = await User.findById(reviewer);
            const revieweeUser = await User.findById(reviewee);

            if (!reviewerUser || !revieweeUser) {
                return res
                    .status(400)
                    .json({ message: "Reviewer or Reviewee not found." });
            }

            const review = new Review({
                trade,
                reviewer,
                reviewerType: reviewerUser.role,
                reviewee,
                revieweeType: revieweeUser.role,
                rating,
                comment,
            });
            await review.save();

            // Emit real-time event to the reviewee
            const revieweeId = review.reviewee.toString();
            const recipientSocketId = userSockets.get(revieweeId);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("review:create", review);
            }

            // Send push notification to the reviewee
            await sendPushNotification(
                revieweeId,
                "New Review Received!",
                `You have received a new ${review.rating}-star review.`,
                {
                    type: "new_review",
                    reviewId: review._id.toString(),
                    tradeId: review.trade.toString(),
                }
            );

            res.status(201).json(this.hashReviewResponse(review));
        } catch (error) {
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
