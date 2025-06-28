import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  trade: { type: mongoose.Schema.Types.ObjectId, ref: "Trade", required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'reviewerType' },
  reviewerType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  reviewee: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'revieweeType' },
  revieweeType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
