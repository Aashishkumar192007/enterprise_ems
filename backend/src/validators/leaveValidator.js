const Joi = require('joi');

const applyLeaveSchema = Joi.object({
  leave_type_id: Joi.number().integer().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
  reason: Joi.string().optional(),
});

const approveLeaveSchema = Joi.object({
  status: Joi.string().valid('Approved', 'Rejected').required(),
  comments: Joi.string().optional(),
});

module.exports = { applyLeaveSchema, approveLeaveSchema };
