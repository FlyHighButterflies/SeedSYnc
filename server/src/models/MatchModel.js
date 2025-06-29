import mongoose from "mongoose";

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

const Match = mongoose.model("Match", matchSchema);
export default Match;