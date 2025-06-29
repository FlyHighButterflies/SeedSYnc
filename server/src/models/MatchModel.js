import mongoose from "mongoose";
import { hashUserId } from "../utils/hash.js";

const matchSchema = new mongoose.Schema(
    {
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        cropId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            required: true,
        },

        compositeKey: {
            type: String,
            unique: true,
            required: true,
        },

        matchScore: { 
            type: Number, 
            min: 0, 
            max: 100, 
            required: true 
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },

    matchedAt: { type: Date, default: Date.now },
    }
);

matchSchema.pre("validate", function (next) {
    if (this.buyerId && this.farmerId && this.cropId) {
        this.compositeKey = hashUserId(`${this.buyerId}+${this.farmerId}+${this.cropId}`);
    }
    next();
});

const Match = mongoose.model("Match", matchSchema);
export default Match;