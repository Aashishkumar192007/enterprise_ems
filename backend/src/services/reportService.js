const prisma = require('../config/db');
const PDFDocument = require('pdfkit');
const xlsx = require('xlsx');
const { Parser } = require('json2csv');

class ReportService {
  async getEmployeeData() {
    const users = await prisma.user.findMany({
      include: {
        employeeProfile: {
          include: { department: true }
        }
      }
    });

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.employeeProfile?.department?.department_name || 'N/A',
      designation: u.employeeProfile?.designation || 'N/A',
      salary: u.employeeProfile?.salary || 0
    }));
  }

  async generatePDF(res) {
    const data = await this.getEmployeeData();
    const doc = new PDFDocument();
    
    res.setHeader('Content-disposition', 'attachment; filename="employees.pdf"');
    res.setHeader('Content-type', 'application/pdf');
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Employee Report', { align: 'center' });
    doc.moveDown();
    
    data.forEach(emp => {
      doc.fontSize(12).text(`ID: ${emp.id} | Name: ${emp.name} | Email: ${emp.email}`);
      doc.text(`Role: ${emp.role} | Department: ${emp.department} | Designation: ${emp.designation}`);
      doc.moveDown();
    });
    
    doc.end();
  }

  async generateExcel(res) {
    const data = await this.getEmployeeData();
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Employees");
    
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-disposition', 'attachment; filename="employees.xlsx"');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }

  async generateCSV(res) {
    const data = await this.getEmployeeData();
    const parser = new Parser();
    const csv = parser.parse(data);
    
    res.setHeader('Content-disposition', 'attachment; filename="employees.csv"');
    res.setHeader('Content-type', 'text/csv');
    res.send(csv);
  }
}

module.exports = new ReportService();
