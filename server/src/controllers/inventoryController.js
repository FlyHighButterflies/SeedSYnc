import Inventory from "../models/InventoryModel.js";
import User from "../models/UserModel.js";
import Crop from "../models/CropModel.js";
import {
    validateMongoId,
    validateRole,
    validateCropsArray,
} from "../utils/validation.js";
import { hashUserId, hashCropKey } from "../utils/hash.js";
import {
    getCachedUserProfile,
    cacheUserProfile,
    invalidateUserProfileCache,
} from "../utils/cacheUtils.js";

function hashInventoryResponse(inventory) {
    return {
        ...inventory.toObject(),
        userId: hashUserId(inventory.userId.toString()),
        crops: Array.isArray(inventory.crops)
            ? inventory.crops.map((crop) =>
                  crop && crop._id
                      ? hashCropKey(
                            inventory.userId.toString(),
                            crop._id.toString()
                        )
                      : crop
              )
            : [],
    };
}

// Create a new inventory
export const createInventory = async (req, res) => {
    // Use authenticated user
    const userId = req.user._id;
    const role = req.user.role;
    let { crops } = req.body;

    // Validate input
    if (!userId) {
        return res.status(400).json({ message: "Invalid or missing userId." });
    }
    if (!role) {
        return res.status(400).json({
            message: "Invalid or missing role. Must be farmer or buyer.",
        });
    }

    try {
        // If crops not provided, fetch all crops belonging to the user
        if (!crops || !Array.isArray(crops) || crops.length === 0) {
            let cropQuery = {};
            if (role === "farmer") {
                cropQuery.farmerId = userId;
            } else if (role === "buyer") {
                cropQuery.buyerId = userId;
            }
            const userCrops = await Crop.find(cropQuery).select("_id");
            crops = userCrops.map((c) => c._id);
        }

        if (crops && !validateCropsArray(crops)) {
            return res.status(400).json({
                message:
                    "Invalid crops array. Must be an array of valid crop IDs.",
            });
        }

        // Check if inventory already exists for this user
        const existingInventory = await Inventory.findOne({ userId });
        if (existingInventory) {
            return res
                .status(409)
                .json({ message: "Inventory already exists for this user." });
        }

        // Verify that all crop IDs are valid
        if (crops && crops.length > 0) {
            const foundCrops = await Crop.find({ _id: { $in: crops } });
            if (foundCrops.length !== crops.length) {
                return res
                    .status(400)
                    .json({ message: "One or more crop IDs are invalid." });
            }
        }

        const newInventory = new Inventory({ userId, role, crops });
        await newInventory.save();
        res.status(201).json(hashInventoryResponse(newInventory));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get inventory for authenticated user
export const getInventoryByUserId = async (req, res) => {
    const userId = req.user._id.toString();

    // Only allow user to get their own inventory (param is ignored)
    // No need to check req.params.userId

    if (!validateMongoId(userId)) {
        return res.status(400).json({ message: "Invalid userId." });
    }

    try {
        let inventory = await getCachedUserProfile(userId);
        if (!inventory) {
            inventory = await Inventory.findOne({ userId }).populate("crops");
            if (!inventory) {
                return res
                    .status(404)
                    .json({ message: "Inventory not found for this user." });
            }
            await cacheUserProfile(userId, inventory);
        }
        res.status(200).json(hashInventoryResponse(inventory));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update inventory
export const updateInventory = async (req, res) => {
    const { userId } = req.params;
    const { crops } = req.body;
    const role = req.user.role;

    // Only allow user to update their own inventory
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({
            message: "Forbidden: Cannot update other user inventory.",
        });
    }

    if (!validateMongoId(userId)) {
        return res.status(400).json({ message: "Invalid userId." });
    }
    if (crops && !validateCropsArray(crops)) {
        return res.status(400).json({
            message: "Invalid crops array. Must be an array of valid crop IDs.",
        });
    }

    try {
        const inventory = await Inventory.findOne({ userId });
        if (!inventory) {
            return res
                .status(404)
                .json({ message: "Inventory not found for this user." });
        }

        // Verify that all crop IDs are valid
        if (crops && crops.length > 0) {
            const foundCrops = await Crop.find({ _id: { $in: crops } });
            if (foundCrops.length !== crops.length) {
                return res
                    .status(400)
                    .json({ message: "One or more crop IDs are invalid." });
            }
        }

        inventory.role = role;
        if (crops) inventory.crops = crops;

        await inventory.save();
        await invalidateUserProfileCache(userId);
        res.status(200).json(hashInventoryResponse(inventory));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete inventory
export const deleteInventory = async (req, res) => {
    const { userId } = req.params;

    // Only allow user to delete their own inventory
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({
            message: "Forbidden: Cannot delete other user inventory.",
        });
    }

    if (!validateMongoId(userId)) {
        return res.status(400).json({ message: "Invalid userId." });
    }

    try {
        const inventory = await Inventory.findOneAndDelete({ userId });
        if (!inventory) {
            return res
                .status(404)
                .json({ message: "Inventory not found for this user." });
        }
        res.status(200).json({ message: "Inventory deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
