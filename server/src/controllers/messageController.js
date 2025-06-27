import { io, userSockets } from '../server.js';
import Message from '../models/MessageModel.js';

class MessageController {
    async createMessage(req, res) {
        try {
            const message = new Message(req.body);
            await message.save();

            const recipientSocketId = userSockets.get(message.recipient.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('message:new', message);
            }

            res.status(201).json(message);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MessageController();