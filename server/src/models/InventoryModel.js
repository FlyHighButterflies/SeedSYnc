import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // 1:1 relationship with user
    },

    role: {
        type: String,
        enum: ["farmer", "buyer"],
        required: true,
    },

    crops: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Static method to get preprocessed farmers for a given product
inventorySchema.statics.getPreprocessedFarmers = async function (product) {
    return this.aggregate([
        {
            $match: { role: "farmer" },
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "crops",
                localField: "crops",
                foreignField: "_id",
                as: "cropDetails",
            },
        },
        {
            $addFields: {
                inventory: {
                    $arrayToObject: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$cropDetails",
                                    as: "crop",
                                    cond: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$$crop.status",
                                                    "available",
                                                ],
                                            },
                                            { $eq: ["$$crop.name", product] },
                                        ],
                                    },
                                },
                            },
                            as: "crop",
                            in: {
                                k: "$$crop.name",
                                v: "$$crop.initialWeightKg",
                            },
                        },
                    },
                },
                sustainability: {
                    $regexMatch: {
                        input: {
                            $ifNull: ["$user.farmerInfo.farmingPractices", ""],
                        },
                        regex: /organic|eco|natural/i,
                    },
                },
                description: {
                    $concat: [
                        { $ifNull: ["$user.farmerInfo.certification", ""] },
                        " ",
                        { $ifNull: ["$user.farmerInfo.farmingPractices", ""] },
                    ],
                },
                rating: { $ifNull: ["$user.rating", 0] },
                location: { $ifNull: ["$user.address", "Unknown"] },
                latitude: "$user.latitude",
                longitude: "$user.longitude",
                id: "$user._id",
            },
        },
        {
            $project: {
                user: 0,
                cropDetails: 0,
            },
        },
    ]);
};

// Static method for preprocessed buyer request
inventorySchema.statics.getPreprocessedBuyerRequest = async function (
    buyerId,
    product
) {
    const buyerInventory = await this.findOne({
        userId: buyerId,
        role: "buyer",
    })
        .populate("userId")
        .populate({
            path: "crops",
            match: {
                name: product,
                status: { $in: ["available", "matched"] },
            },
        });

    if (!buyerInventory || !buyerInventory.userId) return null;

    const user = buyerInventory.userId;

    const totalNeeded = buyerInventory.crops.reduce((sum, crop) => {
        return sum + (crop.weightNeededKg || 0);
    }, 0);

    return {
        id: user._id,
        product,
        location: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        urgency: user.buyerInfo?.urgency || "medium",
        frequency: user.buyerInfo?.frequency || "weekly",
        qualityStandards: user.buyerInfo?.qualityStandards || "",
        budgetPerKg: buyerInventory.crops[0]?.budgetPerKg || 0,
        weightNeededKg: totalNeeded,
    };
};

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
