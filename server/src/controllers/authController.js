import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Farmer from '../models/FarmerModel.js';
import Buyer from '../models/BuyerModel.js';

class AuthController {
    async register(req, res) {
        try {
            const { role, email, password, ...profileData } = req.body;

            if (!role || !['farmer', 'buyer'].includes(role)) {
                return res.status(400).json({ message: 'Invalid user role specified.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            let newUser;
            if (role === 'farmer') {
                newUser = new Farmer({ email, password: hashedPassword, ...profileData });
            } else {
                newUser = new Buyer({ email, password: hashedPassword, ...profileData });
            }

            await newUser.save();

            res.status(201).json({ message: `${role} registered successfully.` });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email already registered.' });
            }
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password, role } = req.body;

            if (!role || !['farmer', 'buyer'].includes(role)) {
                return res.status(400).json({ message: 'Invalid user role specified.' });
            }

            let user = null;
            if (role === 'farmer') {
                user = await Farmer.findOne({ email });
            } else {
                user = await Buyer.findOne({ email });
            }

            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            const token = jwt.sign(
                { id: user._id, role: user.constructor.modelName }, // Store modelName as role
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.constructor.modelName } });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();
