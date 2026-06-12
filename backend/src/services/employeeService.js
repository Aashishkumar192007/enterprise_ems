const employeeRepository = require('../repositories/employeeRepository');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

class EmployeeService {
  async getAllEmployees(page, limit, search) {
    const skip = (page - 1) * limit;
    const employees = await employeeRepository.findAll(skip, limit, search);
    const total = await employeeRepository.countAll(search);
    return {
      employees,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getEmployeeById(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }
    return employee;
  }

  async createEmployee(data) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      const err = new Error('Email already exists');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'User'
    });

    const profileData = {
      department_id: data.department_id,
      phone: data.phone,
      address: data.address,
      designation: data.designation,
      salary: data.salary,
    };

    await employeeRepository.updateProfile(user.id, profileData, data.skills);

    return this.getEmployeeById(user.id);
  }

  async updateEmployee(id, data) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }

    if (data.name || data.role) {
      await userRepository.updatePassword(id, user.password); // Using update as simple user update, let's fix it later.
      // Actually we need a user update method for name/role.
      const prisma = require('../config/db');
      await prisma.user.update({
        where: { id },
        data: {
          name: data.name !== undefined ? data.name : user.name,
          role: data.role !== undefined ? data.role : user.role,
        }
      });
    }

    const profileData = {};
    if (data.department_id !== undefined) profileData.department_id = data.department_id;
    if (data.phone !== undefined) profileData.phone = data.phone;
    if (data.address !== undefined) profileData.address = data.address;
    if (data.designation !== undefined) profileData.designation = data.designation;
    if (data.salary !== undefined) profileData.salary = data.salary;

    if (Object.keys(profileData).length > 0 || data.skills) {
      await employeeRepository.updateProfile(id, profileData, data.skills);
    }

    return this.getEmployeeById(id);
  }

  async deleteEmployee(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }
    await employeeRepository.delete(id);
  }

  async processDocuments(id, files) {
    // files is an array of uploaded files from Multer
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }

    const fileRecords = files.map(f => ({
      filename: f.filename,
      path: f.path,
      mimetype: f.mimetype,
      size: f.size
    }));

    // In a real app we might store these file paths in a Documents table.
    // For now, we return them.
    return fileRecords;
  }
}

module.exports = new EmployeeService();
