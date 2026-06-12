const express = require('express');
const leaveController = require('../controllers/leaveController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateRequest } = require('../validators/authValidator'); // Generic validator
const { applyLeaveSchema, approveLeaveSchema } = require('../validators/leaveValidator');

const router = express.Router();

router.use(authMiddleware);

router.post('/apply', validateRequest(applyLeaveSchema), leaveController.applyLeave);
router.post('/:id/process', roleMiddleware('Admin', 'HR', 'Manager'), validateRequest(approveLeaveSchema), leaveController.processLeave);
router.get('/', roleMiddleware('Admin', 'HR'), leaveController.getAllApplications);
router.get('/my-leaves', leaveController.getMyLeaves);
router.get('/types', leaveController.getLeaveTypes);

module.exports = router;
