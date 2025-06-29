import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || user.role !== decoded.role) {
            return res.status(401).json({
                message: "Unauthorized access: User not found or role mismatch",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

export default authMiddleware;
