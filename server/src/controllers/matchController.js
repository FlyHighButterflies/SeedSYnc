import { io, userSockets } from "../server.js";
import Match from "../models/MatchModel.js";
import { sendPushNotification } from "../services/notificationService.js";
import axios from "axios";
import Inventory from "../models/InventoryModel.js";
import User from "../models/UserModel.js";
import Crop from "../models/CropModel.js";

class MatchController {
    async createMatch(req, res) {
        try {
            // Defensive: Check for authenticated user
            if (!req.user) {
                console.error(
                    "[MatchController] Buyer (req.user) is undefined. Did you forget auth middleware?"
                );
                return res.status(401).json({
                    message:
                        "Unauthorized: No user found in request. Is auth middleware applied?",
                });
            }

            const buyer = req.user;
            const { options = {} } = req.body;

            // Debug: Log buyer info
            console.debug("[MatchController] Buyer:", buyer);

            // Fetch buyer's inventory (most recent)
            const buyerInventory = await Inventory.findOne({
                userId: buyer._id,
            })
                .sort({ createdAt: -1 })
                .lean();

            // Debug: Log buyer inventory
            console.debug("[MatchController] Buyer Inventory:", buyerInventory);

            let cropNames = [];
            if (
                buyerInventory &&
                Array.isArray(buyerInventory.crops) &&
                buyerInventory.crops.length > 0
            ) {
                // Defensive: filter out undefined/null cropIds
                const cropIds = buyerInventory.crops
                    .map((c, idx) => {
                        if (!c || !c.cropId) {
                            console.warn(
                                `[MatchController] Buyer crop at index ${idx} is missing cropId:`,
                                c
                            );
                        }
                        return c && c.cropId;
                    })
                    .filter((id) => !!id);
                // Debug: Log cropIds
                console.debug("[MatchController] Buyer cropIds:", cropIds);

                if (cropIds.length) {
                    const crops = await Crop.find({
                        _id: { $in: cropIds },
                    }).lean();
                    // Debug: Log found crops
                    console.debug(
                        "[MatchController] Buyer crops found in DB:",
                        crops
                    );
                    cropNames = crops
                        .filter((c) => c && c.name)
                        .map((c) => c.name);
                }
            }

            // Debug: Log cropNames
            console.debug("[MatchController] Buyer cropNames:", cropNames);

            if (!cropNames.length) {
                return res.status(400).json({
                    message: "No crop names found in buyer's inventory.",
                });
            }

            // Fetch all farmers
            const farmers = await User.find({ role: "farmer" }).lean();
            // Debug: Log farmers
            console.debug("[MatchController] Farmers:", farmers);

            if (!farmers.length) {
                return res.status(404).json({ message: "No farmers found." });
            }

            // Fetch all farmer inventories
            const farmerIds = farmers.map((f, idx) => {
                if (!f || !f._id) {
                    console.warn(
                        `[MatchController] Farmer at index ${idx} missing _id:`,
                        f
                    );
                }
                return f._id;
            });
            // Debug: Log farmerIds
            console.debug("[MatchController] Farmer IDs:", farmerIds);

            const inventories = await Inventory.find({
                userId: { $in: farmerIds },
            })
                .sort({ createdAt: -1 })
                .lean();

            // Debug: Log farmer inventories
            console.debug("[MatchController] Farmer Inventories:", inventories);

            // Map userId to crop names for AI agent, using canonical crop names
            const inventoryMap = new Map();
            for (const inv of inventories) {
                if (!inventoryMap.has(String(inv.userId))) {
                    const cropIds = Array.isArray(inv.crops)
                        ? inv.crops
                              .map((c, idx) => {
                                  if (!c || !c.cropId) {
                                      console.warn(
                                          `[MatchController] Farmer inventory crop at index ${idx} missing cropId:`,
                                          c
                                      );
                                  }
                                  return c && c.cropId;
                              })
                              .filter((id) => !!id)
                        : [];
                    // Debug: Log cropIds for this inventory
                    console.debug(
                        `[MatchController] Farmer inventory userId=${inv.userId} cropIds:`,
                        cropIds
                    );

                    let cropNamesArr = [];
                    if (cropIds.length) {
                        const crops = await Crop.find({
                            _id: { $in: cropIds },
                        }).lean();
                        // Debug: Log found crops for this farmer
                        console.debug(
                            `[MatchController] Farmer inventory userId=${inv.userId} crops found in DB:`,
                            crops
                        );
                        cropNamesArr = crops
                            .filter((c) => c && c.name)
                            .map((c) => c.name);
                    }
                    inventoryMap.set(String(inv.userId), cropNamesArr);
                }
            }

            // Build a map of farmerId to farmer object for quick lookup
            const farmerObjMap = new Map();
            farmers.forEach((farmer, idx) => {
                if (!farmer || !farmer._id) {
                    console.warn(
                        `[MatchController] Farmer at index ${idx} missing _id:`,
                        farmer
                    );
                }
                farmerObjMap.set(String(farmer._id), farmer);
            });

            const farmersWithInventory = farmers.map((farmer, idx) => ({
                _id: farmer._id,
                address: farmer.address,
                inventory: inventoryMap.get(String(farmer._id)) || [],
                rating: farmer.rating,
                farmerInfo: farmer.farmerInfo || {},
            }));

            // Debug: Log farmersWithInventory
            console.debug(
                "[MatchController] FarmersWithInventory:",
                farmersWithInventory
            );

            // Prepare buyer payload for AI agent
            const buyerPayload = {
                _id: buyer._id,
                address: buyer.address,
                names: cropNames,
                rating: buyer.rating,
                buyerInfo: buyer.buyerInfo || {},
            };

            const aiPayload = {
                buyer: buyerPayload,
                farmers: farmersWithInventory,
                options,
            };

            // Debug: Log AI payload
            console.debug("[MatchController] AI Payload:", aiPayload);

            const aiRes = await axios.post(
                "http://ai-agent:8000/match",
                aiPayload
            );
            const results = aiRes.data;

            // Debug: Log AI agent results
            console.debug("[MatchController] AI agent results:", results);

            if (!results || !Array.isArray(results) || !results.length) {
                return res
                    .status(404)
                    .json({ message: "No suitable match found." });
            }

            const top = results[0];
            // Debug: Log top result
            console.debug("[MatchController] Top AI agent result:", top);

            if (!top) {
                return res
                    .status(500)
                    .json({ message: "AI agent returned no top match." });
            }

            const farmerId = top.farmer_id || top._id || top.id;
            if (!farmerId) {
                console.error(
                    "[MatchController] AI agent response missing farmer_id/_id:",
                    top
                );
                return res.status(500).json({
                    message: "AI agent response missing farmer_id/_id.",
                    aiResult: top,
                });
            }

            // Defensive: check if farmerId exists in our DB
            const farmerObj = farmerObjMap.get(String(farmerId));
            if (!farmerObj) {
                console.error(
                    "[MatchController] Matched farmer not found in database:",
                    farmerId,
                    top
                );
                return res.status(404).json({
                    message: "Matched farmer not found in database.",
                    farmerId,
                    aiResult: top,
                });
            }

            const matchScore = Math.round(top.score * 100);

            const matchedCrops =
                top.matchedCrops && Array.isArray(top.matchedCrops)
                    ? top.matchedCrops
                    : cropNames.filter((name) =>
                          (top.inventory || []).includes(name)
                      );

            const scoreBreakdown = top.score_breakdown || {};
            // Remove old fields if present
            delete scoreBreakdown.inventory;
            delete scoreBreakdown.weight;
            // Use inventory_weight for display/logic if needed

            if (!matchedCrops.length) {
                console.warn(
                    "[MatchController] No matched crops found for this farmer:",
                    top
                );
                return res.status(404).json({
                    message: "No matched crops found for this farmer.",
                    aiResult: top,
                });
            }

            const matches = [];
            const seenKeys = new Set();
            for (const cropName of matchedCrops) {
                // Create a unique key for this match
                const compositeKey = `${buyer._id}_${farmerId}_${cropName}`;
                if (seenKeys.has(compositeKey)) continue;
                seenKeys.add(compositeKey);

                const match = new Match({
                    buyerId: buyer._id,
                    farmerId,
                    cropName,
                    matchScore,
                    scoreBreakdown, // Add breakdown to Match document
                    status: "pending",
                });
                await match.save();
                matches.push(match);
            }

            const recipientSocketId = userSockets.get(String(buyer._id));
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("match:notify", matches);
            }

            await sendPushNotification(
                buyer._id,
                "New Match Found!",
                `You have new matches for your crops. Check them out!`,
                {
                    type: "match_found",
                    matchIds: matches.map((m) => m._id.toString()),
                }
            );

            res.status(201).json({
                matches,
                scoreBreakdown, // Expose breakdown in response
            });
        } catch (error) {
            console.error("[MatchController] Error:", error);
            res.status(400).json({ message: error.message });
        }
    }

    async getMatch(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = req.user._id;
            // Fetch matches where user is buyer or farmer
            const matches = await Match.find({
                $or: [{ buyerId: userId }, { farmerId: userId }],
            }).lean();
            res.status(200).json({ matches });
        } catch (error) {
            console.error("[MatchController] getMatch Error:", error);
            res.status(400).json({ message: error.message });
        }
    }

    async createRecommendations(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const buyer = req.user;
            const { options = {} } = req.body;

            // Fetch buyer's inventory (most recent)
            const buyerInventory = await Inventory.findOne({
                userId: buyer._id,
            })
                .sort({ createdAt: -1 })
                .lean();
            let cropNames = [];
            if (
                buyerInventory &&
                Array.isArray(buyerInventory.crops) &&
                buyerInventory.crops.length > 0
            ) {
                cropNames = buyerInventory.crops
                    .map((c) => c && c.name)
                    .filter(Boolean);
            }
            if (!cropNames.length) {
                return res
                    .status(400)
                    .json({ message: "No crops found in buyer inventory." });
            }

            // Fetch all farmers and inventories
            const farmers = await User.find({ role: "farmer" }).lean();
            const farmerIds = farmers.map((f) => f && f._id).filter(Boolean);
            const inventories = await Inventory.find({
                userId: { $in: farmerIds },
            })
                .sort({ createdAt: -1 })
                .lean();

            // Map userId to crop names
            const inventoryMap = new Map();
            inventories.forEach((inv) => {
                if (inv && inv.userId) {
                    const cropNames = Array.isArray(inv.crops)
                        ? inv.crops.map((c) => c && c.name).filter(Boolean)
                        : [];
                    inventoryMap.set(String(inv.userId), cropNames);
                }
            });

            const farmersWithInventory = farmers.map((farmer) => ({
                _id: farmer._id,
                address: farmer.address,
                inventory: inventoryMap.get(String(farmer._id)) || [],
                rating: farmer.rating,
                farmerInfo: farmer.farmerInfo || {},
            }));

            const buyerPayload = {
                _id: buyer._id,
                address: buyer.address,
                names: cropNames,
                rating: buyer.rating,
                buyerInfo: buyer.buyerInfo || {},
            };

            const aiPayload = {
                buyer: buyerPayload,
                farmers: farmersWithInventory,
                options,
            };

            // Call AI agent
            const aiRes = await axios.post(
                "http://ai-agent:8000/match",
                aiPayload
            );
            const results = aiRes.data;

            // Filter for > 50% score
            const recommendations = results
                .filter((r) => r.score > 0.5)
                .map((r) => ({
                    farmerId: r.farmer_id,
                    inventory: r.inventory,
                    matchedCrops: r.matchedCrops,
                    score: r.score,
                }));

            return res.status(200).json({ recommendations });
        } catch (error) {
            console.error(
                "[MatchController] createRecommendations Error:",
                error
            );
            res.status(400).json({ message: error.message });
        }
    }

    async getRecommendations(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = req.user._id;
            const matches = await Match.find({
                buyerId: userId,
                matchScore: { $gt: 50 },
            })
                .populate("farmerId", "-password")
                .lean();
            res.status(200).json({ recommendations: matches });
        } catch (error) {
            console.error("[MatchController] getRecommendations Error:", error);
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MatchController();
