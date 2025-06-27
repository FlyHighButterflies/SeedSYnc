import { io, userSockets } from '../server.js';

class ReviewController {
    constructor(ReviewModel) {
        this.ReviewModel = ReviewModel;
    }

    async createReview(req, res) {
        try {
            const review = new this.ReviewModel(req.body);
            await review.save();

            const recipientSocketId = userSockets.get(review.reviewee.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('review:create', review);
            }

            res.status(201).json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReviews(req, res) {
        try {
            const reviews = await this.ReviewModel.find({ cropId: req.params.cropId });
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateReview(req, res) {
        try {
            const review = await this.ReviewModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.status(200).json(review);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReview(req, res) {
        try {
            const review = await this.ReviewModel.findByIdAndDelete(req.params.id);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ReviewController;
