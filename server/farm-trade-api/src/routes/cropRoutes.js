const express = require('express');
const CropController = require('../controllers/cropController');

const router = express.Router();
const cropController = new CropController();

router.post('/', cropController.createCrop.bind(cropController));
router.get('/', cropController.getCrops.bind(cropController));
router.put('/:id', cropController.updateCrop.bind(cropController));
router.delete('/:id', cropController.deleteCrop.bind(cropController));

module.exports = router;