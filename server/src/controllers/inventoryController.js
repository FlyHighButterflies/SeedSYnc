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

export function buildCropDetails(crop, role) {
    const base = {
        cropId: crop._id,
        name: crop.name,
        status: crop.status,
        farmerId: crop.farmerId,
        initialWeight: crop.initialWeight,
        currentWeight: crop.currentWeight,
        createdAt: crop.createdAt,
        expiryDate: crop.expiryDate,
    };
    if (role === "farmer") {
        return {
            ...base,
            pricePerUnit: crop.pricePerUnit,
            harvestDate: crop.harvestDate,
        };
    } else if (role === "buyer") {
        return {
            ...base,
            buyerId: crop.buyerId,
            weightNeeded: crop.weightNeeded ?? null, // fixed spelling
            budgetPerUnit: crop.budgetPerUnit ?? null, // fixed casing
            dateNeeded: crop.dateNeeded ?? null,
        };
    }
    return base;
}

function hashInventoryResponse(inventory) {
    const invObj =
        typeof inventory.toObject === "function"
            ? inventory.toObject()
            : inventory;
    return {
        ...invObj,
        userId: hashUserId(invObj.userId.toString()),
        crops: Array.isArray(invObj.crops)
            ? invObj.crops
                  .filter(
                      (crop) =>
                          crop &&
                          typeof crop === "object" &&
                          !(
                              crop instanceof Buffer ||
                              (crop._bsontype && crop._bsontype === "ObjectID")
                          )
                  )
                  .map((crop) => {
                      const cropId = crop.cropId
                          ? hashCropKey(
                                invObj.userId.toString(),
                                crop.cropId.toString()
                            )
                          : crop.cropId;
                      const farmerId = crop.farmerId
                          ? hashUserId(crop.farmerId.toString())
                          : undefined;
                      const buyerId = crop.buyerId
                          ? hashUserId(crop.buyerId.toString())
                          : undefined;
                      return {
                          ...crop,
                          cropId,
                          ...(farmerId && { farmerId }),
                          ...(buyerId && { buyerId }),
                      };
                  })
            : [],
    };
}

// Create a new inventory
export const createInventory = async (req, res) => {
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
            const userCrops = await Crop.find(cropQuery);
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

        // Always fetch full crop docs for the given crop IDs
        let foundCrops = [];
        if (crops && crops.length > 0) {
            foundCrops = await Crop.find({ _id: { $in: crops } });
            if (foundCrops.length !== crops.length) {
                return res
                    .status(400)
                    .json({ message: "One or more crop IDs are invalid." });
            }
        }

        // Store full crop details in inventory
        const cropsDetails = foundCrops.map((crop) =>
            buildCropDetails(crop, role)
        );

        const newInventory = new Inventory({
            userId,
            role,
            crops: cropsDetails,
        });
        await newInventory.save();
        res.status(201).json(hashInventoryResponse(newInventory));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get inventory for authenticated user
export const getInventoryByUserId = async (req, res) => {
    const userId = req.user._id.toString();
    const role = req.user.role;

    if (!validateMongoId(userId)) {
        return res.status(400).json({ message: "Invalid userId." });
    }

    try {
        // Always fetch all crops for the user
        let cropQuery = {};
        if (role === "farmer") {
            cropQuery.farmerId = userId;
        } else if (role === "buyer") {
            cropQuery.buyerId = userId;
        }
        const foundCrops = await Crop.find(cropQuery);
        const cropsDetails = foundCrops.map((crop) =>
            buildCropDetails(crop, role)
        );

        // Get or create inventory meta (for _id, createdAt, etc.)
        let inventory = await Inventory.findOne({ userId }).sort({
            createdAt: -1,
        });
        if (!inventory) {
            inventory = new Inventory({
                userId,
                role,
                crops: [],
            });
        }

        // Build response with latest crops
        const invObj = {
            ...(typeof inventory.toObject === "function"
                ? inventory.toObject()
                : inventory),
            crops: cropsDetails,
        };

        res.status(200).json(hashInventoryResponse(invObj));
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

        // Always fetch full crop docs for the given crop IDs
        let foundCrops = [];
        if (crops && crops.length > 0) {
            foundCrops = await Crop.find({ _id: { $in: crops } });
            if (foundCrops.length !== crops.length) {
                return res
                    .status(400)
                    .json({ message: "One or more crop IDs are invalid." });
            }
        }

        inventory.role = role;
        if (crops) {
            inventory.crops = foundCrops.map((crop) =>
                buildCropDetails(crop, role)
            );
        }

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
