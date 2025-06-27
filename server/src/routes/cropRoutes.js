import express from "express";
import CropController from "../controllers/cropController.js";
import Crop from "../models/CropModel.js";

const router = express.Router();
const cropController = new CropController(Crop);

router.post("/", cropController.createCrop.bind(cropController));
router.get("/", cropController.getCrops.bind(cropController));
router.put("/:id", cropController.updateCrop.bind(cropController));
router.delete("/:id", cropController.deleteCrop.bind(cropController));

export default router;
