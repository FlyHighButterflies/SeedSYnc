import mongoose from "mongoose";
import { hashInventoryId } from "../utils/hash.js";

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

        compositeKey: {
            type: String,
            unique: true,
            required: true,
        },

        quantityKg: {
            type: Number,
            required: true,
            min: 1,
        },

        pricePerUnit: {
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

tradeSchema.pre("validate", function (next) {
    if (this.farmerId && this.cropId) {
        this.compositeKey = hashInventoryId(
            this.farmerId.toString(),
            this.cropId.toString()
        );
    }
    next();
});

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;
