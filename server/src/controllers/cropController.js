import { hashUserId, hashCropKey } from "../utils/hash.js";

class CropController {
    constructor(CropModel) {
        this.CropModel = CropModel;
    }

    // Helper to hash crop response
    hashCropResponse(crop) {
        return {
            ...crop.toObject(),
            _id: hashCropKey(
                crop.farmerId ? crop.farmerId.toString() : "",
                crop._id.toString()
            ),
            farmerId: crop.farmerId
                ? hashUserId(crop.farmerId.toString())
                : null,
            buyerId: crop.buyerId ? hashUserId(crop.buyerId.toString()) : null,
        };
    }

    async createCrop(req, res) {
        console.log("createCrop called");
        try {
            console.log("Request user:", req.user);
            console.log("Request body:", req.body);

            // Ensure userId exists
            if (!req.user || !req.user._id || !req.user.role) {
                console.log("User not authenticated");
                return res
                    .status(401)
                    .json({ message: "User not authenticated." });
            }
            // Ensure currentWeight is set to initialWeight if not provided
            const { initialWeight, currentWeight, ...rest } = req.body;
            if (typeof initialWeight !== "number") {
                console.log("Invalid initialWeight:", initialWeight);
                return res.status(400).json({
                    message: "initialWeight is required and must be a number.",
                });
            }
            // Assign farmerId or buyerId based on user role
            let cropData = {
                ...rest,
                initialWeight,
                currentWeight:
                    typeof currentWeight === "number"
                        ? currentWeight
                        : initialWeight,
            };
            if (req.user.role === "farmer") {
                cropData.farmerId = req.user._id;
            } else if (req.user.role === "buyer") {
                cropData.buyerId = req.user._id;
            }
            console.log("Constructed cropData:", cropData);

            const crop = new this.CropModel(cropData);
            await crop.save();
            console.log("Crop saved:", crop);

            res.status(201).json(this.hashCropResponse(crop));
        } catch (error) {
            console.error("Error in createCrop:", error);
            res.status(400).json({ message: error.message });
        }
    }

    async getCrops(req, res) {
        console.log("getCrops called");
        try {
            // Only return crops belonging to the authenticated user
            let query = {};
            if (req.user && req.user.role === "farmer") {
                query.farmerId = req.user._id;
            } else if (req.user && req.user.role === "buyer") {
                query.buyerId = req.user._id;
            }
            const crops = await this.CropModel.find(query);
            console.log("Fetched crops:", crops.length);
            res.status(200).json(
                crops.map((crop) => this.hashCropResponse(crop))
            );
        } catch (error) {
            console.error("Error in getCrops:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateCrop(req, res) {
        console.log("updateCrop called");
        try {
            const { id } = req.params;
            const userId = req.user._id;
            console.log("Update crop id:", id, "User id:", userId);

            const crop = await this.CropModel.findById(id);

            if (!crop) {
                console.log("Crop not found:", id);
                return res.status(404).json({ message: "Crop not found" });
            }

            if (crop.farmerId.toString() !== userId.toString()) {
                console.log("Unauthorized update attempt by user:", userId);
                return res.status(403).json({
                    message: "You are not authorized to update this crop.",
                });
            }

            // Prevent initialWeight from being updated unless explicitly provided
            const updateData = { ...req.body };
            if (
                !Object.prototype.hasOwnProperty.call(
                    updateData,
                    "initialWeight"
                )
            ) {
                delete updateData.initialWeight;
            }
            console.log("Update data:", updateData);

            const updatedCrop = await this.CropModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
            console.log("Updated crop:", updatedCrop);

            res.status(200).json(this.hashCropResponse(updatedCrop));
        } catch (error) {
            console.error("Error in updateCrop:", error);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCrop(req, res) {
        console.log("deleteCrop called");
        try {
            const { id } = req.params;
            const userId = req.user._id;
            console.log("Delete crop id:", id, "User id:", userId);

            const crop = await this.CropModel.findById(id);

            if (!crop) {
                console.log("Crop not found:", id);
                return res.status(404).json({ message: "Crop not found" });
            }

            if (crop.farmerId.toString() !== userId.toString()) {
                console.log("Unauthorized delete attempt by user:", userId);
                return res.status(403).json({
                    message: "You are not authorized to delete this crop.",
                });
            }

            await this.CropModel.findByIdAndDelete(id);
            console.log("Crop deleted:", id);

            res.status(204).send();
        } catch (error) {
            console.error("Error in deleteCrop:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default CropController;
