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

    // Inventory alert info (auto-triggered)
    alert: {
        type: Object,
        default: null
    }
});

// Performance optimization indexes for search functionality
cropSchema.index({ name: 'text' }); // Text index for name search
cropSchema.index({ status: 1, name: 1 }); // Compound index for status + name searches
cropSchema.index({ farmerId: 1, status: 1 }); // Farmer-specific searches
cropSchema.index({ buyerId: 1, status: 1 }); // Buyer-specific searches
cropSchema.index({ pricePerKg: 1, status: 1 }); // Price-based searches
cropSchema.index({ budgetPerKg: 1, status: 1 }); // Budget-based searches
cropSchema.index({ createdAt: -1 }); // Recent crops first
cropSchema.index({ expiryDate: 1, status: 1 }); // Expiry-based filtering

// Compound index for comprehensive search optimization
cropSchema.index({ 
    status: 1, 
    name: 1, 
    farmerId: 1, 
    pricePerKg: 1 
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
