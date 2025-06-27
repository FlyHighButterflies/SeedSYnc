import { io, userSockets } from '../server.js';
import Match from '../models/MatchModel.js';

class MatchController {
    async createMatch(req, res) {
        try {
            const match = new Match(req.body);
            await match.save();

            const recipientSocketId = userSockets.get(match.buyer.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('match:notify', match);
            }

            res.status(201).json(match);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MatchController();