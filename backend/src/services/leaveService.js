const leaveRepository = require('../repositories/leaveRepository');

class LeaveService {
  async applyLeave(userId, data) {
    const { leave_type_id, start_date, end_date, reason } = data;
    
    // Check balance
    const balance = await leaveRepository.getUserBalance(userId, leave_type_id);
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
    
    if (!balance || balance.balance < days) {
      const err = new Error('Insufficient leave balance');
      err.statusCode = 400;
      throw err;
    }

    return leaveRepository.createApplication({
      user_id: userId,
      leave_type_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      reason
    });
  }

  async processLeaveApproval(applicationId, approverId, status, comments) {
    const application = await leaveRepository.findApplicationById(applicationId);
    if (!application) {
      const err = new Error('Leave application not found');
      err.statusCode = 404;
      throw err;
    }

    if (application.status !== 'Pending') {
      const err = new Error('Leave application already processed');
      err.statusCode = 400;
      throw err;
    }

    return leaveRepository.approveLeave(applicationId, approverId, status, comments);
  }

  async getAllApplications(page, limit) {
    const skip = (page - 1) * limit;
    return leaveRepository.findAllApplications(skip, limit);
  }
}

module.exports = new LeaveService();
