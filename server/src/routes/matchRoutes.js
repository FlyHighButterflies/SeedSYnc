import express from "express";
import matchController from "../controllers/matchController.js";
import Inventory from "../models/InventoryModel.js";
import axios from "axios";

const router = express.Router();

router.post("/recommend", async (req, res) => {
    try {
        const { buyerId, product } = req.body;

        const buyer = await Inventory.getPreprocessedBuyerRequest(
            buyerId,
            product
        );
        const farmers = await Inventory.getPreprocessedFarmers(product);

        const response = await axios.post("http://ai-agent:8000/match", {
            buyer,
            farmers,
            options: {
                use_astar: true,
                use_bmhs: true,
                use_branch_and_bound: false,
                use_hashing: false,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("AI Match Error:", error);
        res.status(500).json({ error: "AI recommendation failed" });
    }
});

router.post("/", matchController.createMatch);

export default router;
