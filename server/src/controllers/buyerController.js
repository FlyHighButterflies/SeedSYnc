import Buyer from '../models/BuyerModel.js';

class BuyerController {
    async getBuyerProfile(req, res) {
        try {
            const buyerId = req.user._id; // Authenticated buyer's ID
            const buyer = await Buyer.findById(buyerId).select('-password'); // Exclude password

            if (!buyer) {
                return res.status(404).json({ message: 'Buyer profile not found.' });
            }

            res.status(200).json(buyer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateBuyerProfile(req, res) {
        try {
            const buyerId = req.user._id; // Authenticated buyer's ID
            const updates = req.body;

            // Prevent updating sensitive fields directly through this endpoint
            delete updates.email;
            delete updates.password;
            delete updates.role;

            const updatedBuyer = await Buyer.findByIdAndUpdate(buyerId, updates, { new: true, runValidators: true }).select('-password');

            if (!updatedBuyer) {
                return res.status(404).json({ message: 'Buyer profile not found.' });
            }

            res.status(200).json(updatedBuyer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new BuyerController();
