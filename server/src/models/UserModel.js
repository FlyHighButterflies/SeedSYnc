import mongoose from "mongoose";

// Dummy geocode function (replace with real geocoding service)
async function geocodeAddress(address) {
    // Example: returns fixed coordinates for demonstration
    return { latitude: 0, longitude: 0 };
}

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
    // Location object with address, latitude, longitude
    location: {
        address: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
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
            default: "medium",
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            default: "weekly",
        },
        qualityStandards: {
            type: String,
            default: "",
        },
    },
});

// Pre-save hook to geocode address if changed
userSchema.pre("save", async function (next) {
    if (this.isModified("location.address")) {
        const coords = await geocodeAddress(this.location.address);
        this.location.latitude = coords.latitude;
        this.location.longitude = coords.longitude;
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
