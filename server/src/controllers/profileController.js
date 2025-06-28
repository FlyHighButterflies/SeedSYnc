import Account from '../models/AccountModel.js';

class ProfileController {
    async getMyProfile(req, res) {
        try {
            // req.user is populated by authMiddleware
            const user = await Account.findById(req.user._id).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'Profile not found.' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateMyProfile(req, res) {
        try {
            const updates = req.body;

            // Prevent updating sensitive fields directly
            delete updates.email;
            delete updates.password;
            delete updates.role;

            const updatedUser = await Account.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');

            if (!updatedUser) {
                return res.status(404).json({ message: 'Profile not found.' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new ProfileController();
