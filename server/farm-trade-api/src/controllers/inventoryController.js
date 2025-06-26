class InventoryController {
    constructor(InventoryModel) {
        this.InventoryModel = InventoryModel;
    }

    async createInventory(req, res) {
        try {
            const inventoryData = req.body;
            const newInventory = await this.InventoryModel.create(inventoryData);
            res.status(201).json(newInventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getInventory(req, res) {
        try {
            const inventory = await this.InventoryModel.find();
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateInventory(req, res) {
        try {
            const { id } = req.params;
            const updatedInventory = await this.InventoryModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedInventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }
            res.status(200).json(updatedInventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteInventory(req, res) {
        try {
            const { id } = req.params;
            const deletedInventory = await this.InventoryModel.findByIdAndDelete(id);
            if (!deletedInventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default InventoryController;