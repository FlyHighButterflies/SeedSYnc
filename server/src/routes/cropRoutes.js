import express from "express";
import CropController from "../controllers/cropController.js";
import Crop from "../models/CropModel.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const cropController = new CropController(Crop);

router.post(
    "/",
    authMiddleware,
    cropController.createCrop.bind(cropController)
);
router.get("/", cropController.getCrops.bind(cropController));
router.put(
    "/:id",
    authMiddleware,
    cropController.updateCrop.bind(cropController)
);
router.delete(
    "/:id",
    authMiddleware,
    cropController.deleteCrop.bind(cropController)
);

export default router;
