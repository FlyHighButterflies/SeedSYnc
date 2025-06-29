import mongoose from "mongoose";
import { hashUserId } from "../utils/hash.js";

const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    reviewedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    compositeKey: {
        type: String,
        unique: true,
        required: true,
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },

    comment: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

reviewSchema.pre("validate", function (next) {
    if (this.reviewerId && this.reviewedUserId) {
        this.compositeKey = hashUserId(`${this.reviewerId}+${this.reviewedUserId}`);
    }
    next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
