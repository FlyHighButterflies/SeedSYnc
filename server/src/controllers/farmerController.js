import Farmer from '../models/FarmerModel.js';

class FarmerController {
    async getFarmerProfile(req, res) {
        try {
            const farmerId = req.user._id; // Authenticated farmer's ID
            const farmer = await Farmer.findById(farmerId).select('-password'); // Exclude password

            if (!farmer) {
                return res.status(404).json({ message: 'Farmer profile not found.' });
            }

            res.status(200).json(farmer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateFarmerProfile(req, res) {
        try {
            const farmerId = req.user._id; // Authenticated farmer's ID
            const updates = req.body;

            // Prevent updating sensitive fields directly through this endpoint
            delete updates.email;
            delete updates.password;
            delete updates.role;

            const updatedFarmer = await Farmer.findByIdAndUpdate(farmerId, updates, { new: true, runValidators: true }).select('-password');

            if (!updatedFarmer) {
                return res.status(404).json({ message: 'Farmer profile not found.' });
            }

            res.status(200).json(updatedFarmer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new FarmerController();
