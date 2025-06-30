class CropController {
    constructor(CropModel) {
        this.CropModel = CropModel;
    }

    async createCrop(req, res) {
        try {
            const crop = new this.CropModel(req.body);
            await crop.save();
            res.status(201).json(crop);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCrops(req, res) {
        try {
            const crops = await this.CropModel.find();
            res.status(200).json(crops);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCrop(req, res) {
        try {
            const { id } = req.params;
            const update = req.body;
            // Fetch the original crop to compare weights
            const originalCrop = await this.CropModel.findById(id);
            if (!originalCrop) {
                return res.status(404).json({ message: 'Crop not found' });
            }

            const prevWeight = originalCrop.currentWeightKg;
            const prevInitialWeight = originalCrop.initialWeightKg;

            // Update the crop
            const crop = await this.CropModel.findByIdAndUpdate(id, update, { new: true });
            if (!crop) {
                return res.status(404).json({ message: 'Crop not found after update' });
            }

            // If weight changed, auto-trigger inventory analysis
            let alertInfo = null;
            if (
                (typeof update.currentWeightKg === 'number' && update.currentWeightKg !== prevWeight) ||
                (typeof update.initialWeightKg === 'number' && update.initialWeightKg !== prevInitialWeight)
            ) {
                // Dynamically import setInventoryAlerts to avoid circular deps
                const { setInventoryAlerts } = await import('../utils/inventoryAnalytics.js');
                const [analyzedCrop] = setInventoryAlerts([crop.toObject()]);
                alertInfo = analyzedCrop.alert || null;

                // Optionally, store the alert in the crop document for quick retrieval
                crop.alert = alertInfo;
                await crop.save();
            }

            res.status(200).json({
                ...crop.toObject(),
                autoAlert: alertInfo
            });
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