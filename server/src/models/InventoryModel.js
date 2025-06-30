import mongoose from "mongoose";

const cropDetailsSchema = new mongoose.Schema(
    {
        cropId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            required: true,
        },
        name: String,
        status: String,
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        initialWeight: Number,
        currentWeight: Number,
        createdAt: Date,
        expiryDate: Date,
        // Farmer-specific
        pricePerUnit: Number,
        harvestDate: Date,
        // Buyer-specific
        weightNeeded: Number, // fixed spelling
        budgetPerUnit: Number, // fixed casing
        dateNeeded: Date,
    },
    { _id: false }
);

const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // 1:1 relationship with user
    },

    role: {
        type: String,
        enum: ["farmer", "buyer"],
        required: true,
    },

    crops: [cropDetailsSchema],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
