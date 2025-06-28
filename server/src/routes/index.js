import express from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import cropRoutes from "./cropRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import matchRoutes from "./matchRoutes.js";
import messageRoutes from "./messageRoutes.js";
import chatLogRoutes from "./chatLogRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import tradeRoutes from "./tradeRoutes.js";
import searchRoutes from "./searchRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes); // New unified profile route
router.use("/crops", cropRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/trades", tradeRoutes);
router.use("/matches", matchRoutes);
router.use("/messages", messageRoutes);
router.use("/chatlogs", chatLogRoutes);
router.use("/notifications", notificationRoutes);
router.use("/", searchRoutes);

export default router;