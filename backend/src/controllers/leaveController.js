const leaveService = require('../services/leaveService');

exports.applyLeave = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const application = await leaveService.applyLeave(userId, req.body);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.processLeave = async (req, res, next) => {
  try {
    const applicationId = parseInt(req.params.id);
    const approverId = req.user.id;
    const { status, comments } = req.body;
    
    const application = await leaveService.processLeaveApproval(applicationId, approverId, status, comments);
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.getAllApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const applications = await leaveService.getAllApplications(page, limit);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

exports.getMyLeaves = async (req, res, next) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const userId = req.user.id;
    
    const leaves = await prisma.leaveApplication.findMany({
      where: { user_id: userId },
      include: { leaveType: true },
      orderBy: { start_date: 'desc' }
    });
    
    const balances = await prisma.leaveBalance.findMany({
      where: { user_id: userId },
      include: { leaveType: true }
    });
    
    res.status(200).json({ success: true, data: { leaves, balances } });
  } catch (error) {
    next(error);
  }
};

exports.getLeaveTypes = async (req, res, next) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const types = await prisma.leaveType.findMany();
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
};
