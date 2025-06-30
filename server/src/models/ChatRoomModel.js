import mongoose from "mongoose";
import { hashUserId } from "../utils/hash.js";

const chatRoomSchema = new mongoose.Schema({
    participants: [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User" 
            },

            role: { 
                type: String, 
                enum: ["buyer", "farmer"], 
                required: true 
            },
        },
    ],

    compositeKey: {
        type: String,
        unique: true,
        required: true,
    },

    name: { 
        type: String 
    },

    lastMessage: { 
        type: String 
    },

    lastMessageTime: { 
        type: Date 
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

chatRoomSchema.pre("validate", function (next) {
    if (this.participants && this.participants.length > 0) {
        const ids = this.participants.map(p => p.userId.toString()).sort().join('+');
        this.compositeKey = hashUserId(ids);
    }
    next();
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
