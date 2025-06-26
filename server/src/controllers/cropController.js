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
            const crop = await this.CropModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!crop) {
                return res.status(404).json({ message: 'Crop not found' });
            }
            res.status(200).json(crop);
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