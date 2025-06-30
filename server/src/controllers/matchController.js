import { io, userSockets } from '../server.js';
import Match from '../models/MatchModel.js';
import { sendPushNotification } from '../services/notificationService.js';
import User from '../models/UserModel.js';
import Inventory from '../models/InventoryModel.js';

class MatchController {
    async createMatch(req, res) {
        try {
            const { buyer, inventory, ...matchData } = req.body;

            // Validate that buyer and inventory exist
            const buyerExists = await User.findById(buyer);
            const inventoryExists = await Inventory.findById(inventory);

            if (!buyerExists || !inventoryExists) {
                return res.status(404).json({ message: 'Buyer or inventory not found.' });
            }

            const match = new Match({ buyer, inventory, ...matchData });
            await match.save();

            // Emit real-time event via Socket.IO
            const recipientSocketId = userSockets.get(match.buyer.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('match:notify', match);
            }

            // Send push notification
            await sendPushNotification(
                match.buyer,
                'New Match Found!',
                `You have a new match for ${match.inventory.product.name}. Check it out!`,
                { type: 'match_found', matchId: match._id.toString() }
            );

            res.status(201).json(match);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MatchController();