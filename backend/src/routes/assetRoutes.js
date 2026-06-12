const express = require('express');
const assetController = require('../controllers/assetController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', assetController.getAllAssets);
router.post('/', roleMiddleware('Admin', 'HR'), assetController.createAsset);
router.post('/:id/allocate', roleMiddleware('Admin', 'HR'), assetController.allocateAsset);

module.exports = router;
