import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

class AuthController {
    async register(req, res) {
        try {
            const { role, email, password, ...profileData } = req.body;

            if (!role || !["farmer", "buyer"].includes(role)) {
                return res
                    .status(400)
                    .json({ message: "Invalid user role specified." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                passwordHash: hashedPassword,
                role,
                ...profileData,
            });

            await newUser.save();

            res.status(201).json({
                message: `${role} registered successfully.`,
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
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Invalid credentials." });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: "Invalid credentials." });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.status(200).json({
                token,
                user: { id: user._id, email: user.email },
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();
