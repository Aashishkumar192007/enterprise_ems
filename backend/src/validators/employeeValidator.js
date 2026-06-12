const Joi = require('joi');

const createEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'HR', 'Manager', 'User').optional(),
  department_id: Joi.number().integer().required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  designation: Joi.string().required(),
  salary: Joi.number().optional(),
  skills: Joi.array().items(Joi.number().integer()).optional(), // array of skill IDs
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().optional(),
  role: Joi.string().valid('Admin', 'HR', 'Manager', 'User').optional(),
  department_id: Joi.number().integer().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  designation: Joi.string().optional(),
  salary: Joi.number().optional(),
  skills: Joi.array().items(Joi.number().integer()).optional(),
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
};
