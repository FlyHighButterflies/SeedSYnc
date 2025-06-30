import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["buyer", "farmer"],
        required: true,
    },
    fcmToken: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    trades: {
        type: Number,
        default: 0,
    },
    birthday: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Farmer-Specific Fields
    farmerInfo: {
        certification: {
            type: String,
            default: "",
        },
        farmingPractices: {
            type: String,
            default: "",
        },
    },
    // Buyer-Specific Fields
    buyerInfo: {
        urgency: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "",
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            default: "",
        },
        qualityStandards: {
            type: String,
            default: "",
        },
    },
});

const User = mongoose.model("User", userSchema);
export default User;
