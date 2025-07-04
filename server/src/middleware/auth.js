import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Unauthorized access: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized access: Token missing" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("[authMiddleware] JWT_SECRET not set in environment");
            return res.status(500).json({ message: "Server misconfiguration" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error("[authMiddleware] JWT verification failed:", err);
            return res
                .status(401)
                .json({ message: "Unauthorized access: Invalid token" });
        }

        if (!decoded || !decoded.id) {
            // Only check for id
            return res.status(401).json({
                message: "Unauthorized access: Invalid token payload",
            });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            // Remove role check
            return res.status(401).json({
                message: "Unauthorized access: User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("[authMiddleware] Error:", error);
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

export default authMiddleware;
