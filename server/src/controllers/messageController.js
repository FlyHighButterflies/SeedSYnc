import { io, userSockets } from '../server.js';
import Message from '../models/MessageModel.js';
import { sendPushNotification } from '../services/notificationService.js';

class MessageController {
    async createMessage(req, res) {
        try {
            const message = new Message(req.body);
            await message.save();

            // Emit real-time event via Socket.IO
            const recipientSocketId = userSockets.get(message.recipient.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('message:new', message);
            }

            // Send push notification
            await sendPushNotification(
                message.recipient,
                message.recipientType,
                `New Message from ${message.sender.firstName}`,
                message.message,
                { type: 'new_message', senderId: message.sender.toString(), messageId: message._id.toString() }
            );

            res.status(201).json(message);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MessageController();
