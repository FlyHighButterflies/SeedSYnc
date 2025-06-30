import mongoose from "mongoose";
import { hashUserId } from "../utils/hash.js";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    type: {
        type: String,
        enum: ["match", "message", "system"],
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    compositeKey: {
        type: String,
        unique: true,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },

    read: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

notificationSchema.pre("validate", function (next) {
    if (this.userId && this.type && this.title) {
        this.compositeKey = hashUserId(`${this.userId}+${this.type}+${this.title}`);
    }
    next();
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
