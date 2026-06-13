const express = require('express');
const employeeController = require('../controllers/employeeController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validators/employeeValidator');
const { validateRequest } = require('../validators/authValidator');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

// Only Admin or HR can create/update/delete employees
router.post('/', roleMiddleware('Admin', 'HR'), validateRequest(createEmployeeSchema), employeeController.createEmployee);
router.put('/:id', roleMiddleware('Admin', 'HR'), validateRequest(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:id', roleMiddleware('Admin', 'HR'), employeeController.deleteEmployee);

// Upload up to 5 documents (profile, Aadhar, Resume, Certificate)
router.post('/:id/documents', roleMiddleware('Admin', 'HR', 'User'), upload.array('documents', 5), employeeController.uploadDocuments);

module.exports = router;
