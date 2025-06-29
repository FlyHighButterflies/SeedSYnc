import { io, userSockets } from "../server.js";
import Match from "../models/MatchModel.js";
import { sendPushNotification } from "../services/notificationService.js";
import axios from "axios";
import Inventory from "../models/InventoryModel.js";

class MatchController {
    async createMatch(req, res) {
        try {
            const { buyer, farmers, cropId, options = {} } = req.body;
            console.debug("[MatchController] Incoming request:", {
                buyer,
                farmers,
                cropId,
                options,
            });

            // Map crops → inventory for each farmer
            const farmerIds = farmers.map((f) => f._id || f.id);
            console.debug("[MatchController] Farmer IDs:", farmerIds);

            const inventories = await Inventory.find({
                userId: { $in: farmerIds },
            }).lean();
            console.debug("[MatchController] Inventories found:", inventories);

            const inventoryMap = new Map();
            inventories.forEach((inv) => {
                inventoryMap.set(
                    String(inv.userId),
                    inv.crops.map((c) => String(c))
                );
            });

            // Prepare farmers payload for AI agent
            const farmersWithInventory = farmers.map((farmer) => ({
                _id: farmer._id || farmer.id,
                address: farmer.address,
                inventory:
                    inventoryMap.get(String(farmer._id || farmer.id)) || [],
                rating: farmer.rating,
                farmerInfo: farmer.farmerInfo || {},
            }));
            console.debug(
                "[MatchController] Farmers payload for AI agent:",
                farmersWithInventory
            );

            // Prepare buyer payload for AI agent
            const buyerPayload = {
                _id: buyer._id || buyer.id,
                address: buyer.address,
                cropId: cropId,
                rating: buyer.rating,
                buyerInfo: buyer.buyerInfo || {},
            };
            console.debug(
                "[MatchController] Buyer payload for AI agent:",
                buyerPayload
            );

            // Call AI agent to get best match
            const aiPayload = {
                buyer: buyerPayload,
                farmers: farmersWithInventory,
                options,
            };
            console.debug(
                "[MatchController] Sending payload to AI agent:",
                aiPayload
            );

            const aiRes = await axios.post(
                "http://ai-agent:8000/match",
                aiPayload
            );
            const results = aiRes.data;
            console.debug("[MatchController] AI agent response:", results);

            if (!results.length) {
                console.warn("[MatchController] No suitable match found.");
                return res
                    .status(404)
                    .json({ message: "No suitable match found." });
            }

            // Pick top farmer
            const top = results[0];
            const farmerId = top.farmer_id;
            // Scale score to 0-100
            const matchScore = Math.round(top.score * 100);
            console.debug("[MatchController] Top match:", {
                farmerId,
                matchScore,
            });

            // Create match document
            const match = new Match({
                buyerId: buyer._id || buyer.id,
                farmerId,
                cropId,
                matchScore,
                status: "pending",
            });
            await match.save();
            console.debug("[MatchController] Match saved:", match);

            // Emit real-time event via Socket.IO
            const recipientSocketId = userSockets.get(
                String(buyer._id || buyer.id)
            );
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("match:notify", match);
                console.debug(
                    "[MatchController] Real-time event emitted to socket:",
                    recipientSocketId
                );
            }

            // Send push notification
            await sendPushNotification(
                buyer._id || buyer.id,
                "New Match Found!",
                `You have a new match for crop. Check it out!`,
                { type: "match_found", matchId: match._id.toString() }
            );
            console.debug("[MatchController] Push notification sent.");

            res.status(201).json(match);
        } catch (error) {
            console.error("[MatchController] Error in createMatch:", error);
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MatchController();
