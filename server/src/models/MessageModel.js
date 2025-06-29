import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required: true,
    },

    from: {
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

    to: {
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

    text: { 
        type: String, 
        required: true 
    },
    
    fromMe: { 
        type: Boolean 
    },

    isRead: { 
        type: Boolean, 
        default: false 
    },
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
