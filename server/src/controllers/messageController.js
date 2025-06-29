import { io, userSockets } from "../server.js";
import Message from "../models/MessageModel.js";
import { sendPushNotification } from "../services/notificationService.js";
import User from "../models/UserModel.js";
import { hashUserId } from '../utils/hash.js';

class MessageController {
    hashMessageResponse(message) {
        return {
            ...message.toObject(),
            sender: message.sender ? hashUserId(message.sender.toString()) : null,
            recipient: message.recipient ? hashUserId(message.recipient.toString()) : null,
        };
    }

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

            const chatLog = new Message({
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

            // Send push notification
            await sendPushNotification(
                recipientId,
                `New Message from ${req.user.firstName}`,
                message,
                {
                    type: "new_message",
                    senderId: senderId.toString(),
                    messageId: chatLog._id.toString(),
                }
            );

            res.status(201).json(this.hashMessageResponse(chatLog));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MessageController();
