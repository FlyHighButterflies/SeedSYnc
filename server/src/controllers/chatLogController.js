import ChatLog from "../models/ChatRoomModel.js";
import { io, userSockets } from "../server.js";
import User from "../models/UserModel.js";

class ChatLogController {
    async createMessage(req, res) {
        try {
            const { recipientId, message } = req.body;
            const senderId = req.user._id; // Authenticated user's ID
            const senderType = req.user.role; // 'Farmer' or 'Buyer'

            const recipientUser = await User.findById(recipientId);
            if (!recipientUser) {
                return res
                    .status(404)
                    .json({ message: "Recipient not found." });
            }
            const recipientType = recipientUser.role;

            const chatLog = new ChatLog({
                sender: senderId,
                senderType: senderType,
                recipient: recipientId,
                recipientType: recipientType,
                message,
            });

            await chatLog.save();

            // Emit real-time event to the recipient
            const recipientSocketId = userSockets.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:new", chatLog);
            }

            res.status(201).json(chatLog);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getChatHistory(req, res) {
        try {
            const { partnerId } = req.params;
            const userId = req.user._id; // Authenticated user's ID
            const userType = req.user.role; // Authenticated user's role
            const { limit = 50, offset = 0 } = req.query;

            const chatHistory = await ChatLog.find({
                $or: [
                    {
                        sender: userId,
                        senderType: userType,
                        recipient: partnerId,
                    },
                    {
                        recipient: userId,
                        recipientType: userType,
                        sender: partnerId,
                    },
                ],
            })
                .sort({ createdAt: 1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .populate("sender") // Populate sender details
                .populate("recipient"); // Populate recipient details

            res.status(200).json(chatHistory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async markMessagesAsRead(req, res) {
        try {
            const { partnerId } = req.params;
            const userId = req.user._id; // Authenticated user's ID
            const userType = req.user.role; // Authenticated user's role

            await ChatLog.updateMany(
                {
                    sender: partnerId,
                    recipient: userId,
                    recipientType: userType,
                    read: false,
                },
                { $set: { read: true } }
            );

            res.status(200).json({ message: "Messages marked as read" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ChatLogController();
