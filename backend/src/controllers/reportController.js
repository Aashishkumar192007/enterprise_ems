const reportService = require('../services/reportService');

exports.exportEmployees = async (req, res, next) => {
  try {
    const format = req.query.format || 'csv';

    if (format === 'pdf') {
      await reportService.generatePDF(res);
    } else if (format === 'excel') {
      await reportService.generateExcel(res);
    } else {
      await reportService.generateCSV(res);
    }
  } catch (error) {
    next(error);
  }
};
