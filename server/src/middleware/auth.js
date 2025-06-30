import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
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

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(", ")}`,
            });
        }

        next();
    };
};

// Ownership check middleware
export const checkOwnership = (ownerField = "userId") => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const resourceId = req.params.id;
            if (!resourceId) {
                return res.status(400).json({
                    success: false,
                    message: "Resource ID required",
                });
            }

            // For new resources (POST requests), allow creation
            if (req.method === "POST") {
                return next();
            }

            // Find the resource in the appropriate model based on the route
            let Model;
            const routePath = req.route?.path || req.path;

            if (routePath.includes("crop")) {
                const Crop = (await import("../models/CropModel.js")).default;
                Model = Crop;
            } else if (routePath.includes("trade")) {
                const Trade = (await import("../models/TradeModel.js")).default;
                Model = Trade;
            } else if (routePath.includes("inventory")) {
                const Inventory = (await import("../models/InventoryModel.js")).default;
                Model = Inventory;
            } else if (routePath.includes("review")) {
                const Review = (await import("../models/ReviewModel.js")).default;
                Model = Review;
            } else if (routePath.includes("message")) {
                const Message = (await import("../models/MessageModel.js")).default;
                Model = Message;
            } else {
                // Generic check - allow if user is admin or if ownerField matches user ID
                if (req.user.role === "admin") {
                    return next();
                }
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            if (Model) {
                const resource = await Model.findById(resourceId);
                if (!resource) {
                    return res.status(404).json({
                        success: false,
                        message: "Resource not found",
                    });
                }

                // Check if user owns the resource or is admin
                if (
                    req.user.role === "admin" ||
                    resource[ownerField]?.toString() === req.user._id.toString()
                ) {
                    return next();
                }
            }

            return res.status(403).json({
                success: false,
                message: "Access denied: You don't own this resource",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error checking ownership",
            });
        }
    };
};

// Optional authentication middleware (for routes that can work with or without auth)
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            // No token provided, continue without user
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== decoded.role) {
            // Invalid token, continue without user
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        // Token verification failed, continue without user
        req.user = null;
        next();
    }
};

export default authMiddleware;
