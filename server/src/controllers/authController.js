import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

class AuthController {
    async register(req, res) {
        try {
            const { role, email, password, ...profileData } = req.body;

            // Normalize role to lowercase to match model and frontend
            const normalizedRole = role?.toLowerCase();

            if (!normalizedRole || !["farmer", "buyer"].includes(normalizedRole)) {
                return res
                    .status(400)
                    .json({ message: "Invalid user role specified." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                password: hashedPassword,
                role: normalizedRole,
                ...profileData,
            });

            await newUser.save();

            res.status(201).json({
                message: `${normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} registered successfully.`,
            });
        } catch (error) {
            if (error.code === 11000) {
                return res
                    .status(400)
                    .json({ message: "Email already registered." });
            }
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password, role } = req.body;

            // Normalize role to lowercase to match model and frontend
            const normalizedRole = role?.toLowerCase();

            if (!normalizedRole || !["farmer", "buyer"].includes(normalizedRole)) {
                return res
                    .status(400)
                    .json({ message: "Invalid user role specified." });
            }

            const user = await User.findOne({ email, role: normalizedRole });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Invalid credentials." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: "Invalid credentials." });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token,
                user: { id: user._id, email: user.email, role: user.role },
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();
