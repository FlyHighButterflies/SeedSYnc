import express from "express";
import CropController from "../controllers/cropController.js";
import Crop from "../models/CropModel.js";
import authMiddleware, { authorizeRoles, checkOwnership } from "../middleware/auth.js";
import { 
    validateCropCreation, 
    validateCropUpdate, 
    validateCropId,
    handleValidationErrors,
    sanitizeInputs
} from "../validators/index.js";

const router = express.Router();
const cropController = new CropController(Crop);

// All crop routes require authentication
router.use(authMiddleware);

// Create crop - farmers only
router.post("/", 
    authorizeRoles('farmer'),
    validateCropCreation,
    handleValidationErrors,
    sanitizeInputs,
    cropController.createCrop.bind(cropController)
);

// Get crops - authenticated users can view
router.get("/", 
    cropController.getCrops.bind(cropController)
);

// Update crop - farmers only, own crops only
router.put("/:id", 
    validateCropId,
    handleValidationErrors,
    authorizeRoles('farmer'),
    validateCropUpdate,
    handleValidationErrors,
    sanitizeInputs,
    checkOwnership('farmerId'),
    cropController.updateCrop.bind(cropController)
);

// Delete crop - farmers only, own crops only
router.delete("/:id", 
    validateCropId,
    handleValidationErrors,
    authorizeRoles('farmer'),
    checkOwnership('farmerId'),
    cropController.deleteCrop.bind(cropController)
);

export default router;
