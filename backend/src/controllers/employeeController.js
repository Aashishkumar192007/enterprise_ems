const employeeService = require('../services/employeeService');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await employeeService.getAllEmployees(page, limit, search);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const employee = await employeeService.getEmployeeById(id);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const employee = await employeeService.updateEmployee(id, req.body);
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await employeeService.deleteEmployee(id);
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.uploadDocuments = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const files = req.files; // Array of files from Multer
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const result = await employeeService.processDocuments(id, files);
    res.status(200).json({ success: true, message: 'Documents uploaded', data: result });
  } catch (error) {
    next(error);
  }
};
