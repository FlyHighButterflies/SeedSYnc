import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },

    status: {
        type: String,
        enum: ["available", "matched", "sold", "expired"],
        default: "available",
    },

    // Farmer-side
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    initialWeightKg: { type: Number },
    currentWeightKg: { type: Number }, // Track current weight for inventory analytics
    pricePerKg: { type: Number },
    harvestDate: { type: Date },

    // Buyer-side (optional)
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    weightNeededKg: { type: Number },
    budgetPerKg: { type: Number },
    dateNeeded: { type: Date },

    expiryDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

// Pre-save middleware to set currentWeightKg to initialWeightKg if not provided
cropSchema.pre('save', function(next) {
    if (this.isNew && this.initialWeightKg && !this.currentWeightKg) {
        this.currentWeightKg = this.initialWeightKg;
    }
    next();
});

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
