import { io, userSockets } from "../server.js";
import Match from "../models/MatchModel.js";
import { sendPushNotification } from "../services/notificationService.js";

class MatchController {
    async createMatch(req, res) {
        try {
            const { buyerId, farmerId, cropId, matchScore } = req.body;

            const match = new Match({
                buyerId,
                farmerId,
                cropId,
                matchScore: Math.min(Math.max(matchScore * 100, 0), 100), // convert to 0-100 scale and clamp
            });

            await match.save();

            // Emit real-time event via Socket.IO
            const recipientSocketId = userSockets.get(buyerId.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("match:notify", match);
            }

            // Send push notification
            await sendPushNotification(
                buyerId,
                "New Match Found!",
                `You have a new match for ${match.inventory.product.name}. Check it out!`,
                { type: "match_found", matchId: match._id.toString() }
            );

            res.status(201).json(match);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MatchController();
