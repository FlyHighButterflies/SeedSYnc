import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

class AuthController {
    async register(req, res) {
        try {
            let { role, email, password, location, ...profileData } = req.body;

            // Ensure role is lower case and valid
            if (!role || !["farmer", "buyer"].includes(role.toLowerCase())) {
                return res
                    .status(400)
                    .json({ message: "Invalid user role specified." });
            }
            role = role.toLowerCase();

            // Ensure location.address is provided
            if (!location || !location.address) {
                return res
                    .status(400)
                    .json({ message: "Location address is required." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                passwordHash: hashedPassword,
                role,
                location,
                ...profileData,
            });

            await newUser.save();

            res.status(201).json({
                message: `${
                    role.charAt(0).toUpperCase() + role.slice(1)
                } registered successfully.`,
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
            let { email, password, role } = req.body;

            if (!role || !["farmer", "buyer"].includes(role.toLowerCase())) {
                return res
                    .status(400)
                    .json({ message: "Invalid user role specified." });
            }
            role = role.toLowerCase();

            const user = await User.findOne({ email, role });

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
