import ChatLog from '../models/ChatLogModel.js';
import { io, userSockets } from '../server.js';

class ChatLogController {
    async createMessage(req, res) {
        try {
            const { recipientId, message } = req.body;
            const senderId = req.user.id; // Assuming authMiddleware populates req.user.id

            const chatLog = new ChatLog({
                sender: senderId,
                recipient: recipientId,
                message,
            });

            await chatLog.save();

            // Emit real-time event to the recipient
            const recipientSocketId = userSockets.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('message:new', chatLog);
            }

            res.status(201).json(chatLog);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getChatHistory(req, res) {
        try {
            const { partnerId } = req.params;
            const userId = req.user.id; // Authenticated user's ID
            const { limit = 50, offset = 0 } = req.query;

            const chatHistory = await ChatLog.find({
                $or: [
                    { sender: userId, recipient: partnerId },
                    { sender: partnerId, recipient: userId },
                ],
            })
            .sort({ createdAt: 1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

            res.status(200).json(chatHistory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async markMessagesAsRead(req, res) {
        try {
            const { partnerId } = req.params;
            const userId = req.user.id; // Authenticated user's ID

            await ChatLog.updateMany(
                { sender: partnerId, recipient: userId, read: false },
                { $set: { read: true } }
            );

            res.status(200).json({ message: 'Messages marked as read' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ChatLogController();