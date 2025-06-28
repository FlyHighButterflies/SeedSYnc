import jwt from 'jsonwebtoken';
import Farmer from '../models/FarmerModel.js';
import Buyer from '../models/BuyerModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = null;
        if (decoded.role === 'Farmer') {
            user = await Farmer.findById(decoded.id);
        } else if (decoded.role === 'Buyer') {
            user = await Buyer.findById(decoded.id);
        } else {
            return res.status(401).json({ message: 'Unauthorized access: Invalid user role in token' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
};

export default authMiddleware;