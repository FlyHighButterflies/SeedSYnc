import express from "express";
import authMiddleware from "../middleware/auth.js";
import matchController from "../controllers/matchController.js";

const router = express.Router();

router.post(
    "/match",
    authMiddleware,
    matchController.createMatch.bind(matchController)
);

router.get(
    "/match",
    authMiddleware,
    matchController.getMatch.bind(matchController)
);

router.post(
    "/recommendations",
    authMiddleware,
    matchController.createRecommendations.bind(matchController)
);

router.get(
    "/recommendations",
    authMiddleware,
    matchController.getRecommendations.bind(matchController)
);

export default router;
