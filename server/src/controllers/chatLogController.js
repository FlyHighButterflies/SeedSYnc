import ChatRoom from "../models/ChatRoomModel.js";
import Message from "../models/MessageModel.js";
import { io, userSockets } from "../server.js";
import User from "../models/UserModel.js";

class ChatLogController {
    // POST /api/chatlogs/
    async createMessage(req, res) {
        try {
            const { chatRoomId, text } = req.body;
            const senderId = req.user._id;
            const senderRole = req.user.role;

            // Find chat room and recipient
            const chatRoom = await ChatRoom.findById(chatRoomId);
            if (!chatRoom) {
                return res
                    .status(404)
                    .json({ message: "Chat room not found." });
            }
            const recipient = chatRoom.participants.find(
                (p) => p.userId.toString() !== senderId.toString()
            );
            if (!recipient) {
                return res
                    .status(404)
                    .json({ message: "Recipient not found in chat room." });
            }

            // Create message
            const message = new Message({
                chatRoomId,
                from: { userId: senderId, role: senderRole },
                to: { userId: recipient.userId, role: recipient.role },
                text,
                fromMe: true,
            });
            await message.save();

            // Update chat room metadata
            chatRoom.lastMessage = text;
            chatRoom.lastMessageTime = new Date();
            await chatRoom.save();

            // Emit real-time event
            const recipientSocketId = userSockets.get(
                recipient.userId.toString()
            );
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:new", message);
            }

            res.status(201).json(message);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // GET /api/chatlogs/:chatRoomId
    async getChatHistory(req, res) {
        try {
            const { chatRoomId } = req.params;
            const { limit = 50, offset = 0 } = req.query;

            const chatHistory = await Message.find({ chatRoomId })
                .sort({ createdAt: 1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .populate("from.userId")
                .populate("to.userId");

            res.status(200).json(chatHistory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // PATCH /api/chatlogs/:chatRoomId/read
    async markMessagesAsRead(req, res) {
        try {
            const { chatRoomId } = req.params;
            const userId = req.user._id;

            await Message.updateMany(
                {
                    chatRoomId,
                    "to.userId": userId,
                    isRead: false,
                },
                { $set: { isRead: true } }
            );

            res.status(200).json({ message: "Messages marked as read" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ChatLogController();
