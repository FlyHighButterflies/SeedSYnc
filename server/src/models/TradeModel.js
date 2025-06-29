import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
    {
        cropId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            required: true,
        },

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

        quantityKg: {
            type: Number,
            required: true,
            min: 1,
        },

        pricePerKg: {
            type: Number,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending",
        },

        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
        },

        deliveryDate: {
            type: Date,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;
