const express = require('express');
const reportController = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('Admin', 'HR'));

router.get('/employees', reportController.exportEmployees);

module.exports = router;
