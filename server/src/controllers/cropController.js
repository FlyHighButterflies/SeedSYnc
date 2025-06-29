import { hashUserId, hashCropKey } from '../utils/hash.js';

class CropController {
    constructor(CropModel) {
        this.CropModel = CropModel;
    }

    // Helper to hash crop response
    hashCropResponse(crop) {
        return {
            ...crop.toObject(),
            _id: hashCropKey(crop.farmerId ? crop.farmerId.toString() : '', crop._id.toString()),
            farmerId: crop.farmerId ? hashUserId(crop.farmerId.toString()) : null,
            buyerId: crop.buyerId ? hashUserId(crop.buyerId.toString()) : null,
        };
    }

    async createCrop(req, res) {
        try {
            const crop = new this.CropModel(req.body);
            await crop.save();
            res.status(201).json(this.hashCropResponse(crop));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCrops(req, res) {
        try {
            const crops = await this.CropModel.find();
            res.status(200).json(crops.map(crop => this.hashCropResponse(crop)));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCrop(req, res) {
        try {
            const { id } = req.params;
            const crop = await this.CropModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!crop) {
                return res.status(404).json({ message: 'Crop not found' });
            }
            res.status(200).json(this.hashCropResponse(crop));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCrop(req, res) {
        try {
            const { id } = req.params;
            const crop = await this.CropModel.findByIdAndDelete(id);
            if (!crop) {
                return res.status(404).json({ message: 'Crop not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default CropController;