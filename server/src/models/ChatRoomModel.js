import mongoose from "mongoose";

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

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
