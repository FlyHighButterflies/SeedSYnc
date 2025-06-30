import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["available", "matched", "sold", "expired"],
        default: "available",
    },

    // Farmer-side
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    initialWeight: {
        type: Number,
        required: true,
    },

    currentWeight: {
        type: Number,
    },

    pricePerUnit: {
        type: Number,
    },
    harvestDate: {
        type: Date,
    },

    // Buyer-side (optional)
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    weightNeeded: {
        // fixed spelling
        type: Number,
    },

    budgetPerUnit: {
        // fixed casing
        type: Number,
    },

    dateNeeded: {
        type: Date,
    },

    expiryDate: {
        type: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
