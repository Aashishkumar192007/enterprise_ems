const prisma = require('../config/db');

class LeaveRepository {
  async createApplication(data) {
    return prisma.leaveApplication.create({ data });
  }

  async findApplicationById(id) {
    return prisma.leaveApplication.findUnique({
      where: { id },
      include: { leaveType: true, user: true }
    });
  }

  async getUserBalance(userId, leaveTypeId) {
    return prisma.leaveBalance.findUnique({
      where: { user_id_leave_type_id: { user_id: userId, leave_type_id: leaveTypeId } }
    });
  }

  async approveLeave(applicationId, approverId, status, comments) {
    return prisma.$transaction(async (prisma) => {
      const application = await prisma.leaveApplication.update({
        where: { id: applicationId },
        data: { status }
      });

      await prisma.approvalHistory.create({
        data: {
          leave_application_id: applicationId,
          approver_id: approverId,
          action: status,
          comments
        }
      });

      if (status === 'Approved') {
        const days = Math.ceil((new Date(application.end_date) - new Date(application.start_date)) / (1000 * 60 * 60 * 24)) + 1;
        
        await prisma.leaveBalance.update({
          where: {
            user_id_leave_type_id: {
              user_id: application.user_id,
              leave_type_id: application.leave_type_id
            }
          },
          data: {
            balance: { decrement: days }
          }
        });
      }

      await prisma.notification.create({
        data: {
          user_id: application.user_id,
          title: `Leave Application ${status}`,
          message: `Your leave from ${application.start_date.toISOString().split('T')[0]} to ${application.end_date.toISOString().split('T')[0]} has been ${status.toLowerCase()}.`
        }
      });

      return application;
    });
  }

  async findAllApplications(skip, take) {
    return prisma.leaveApplication.findMany({ skip, take, include: { user: true, leaveType: true } });
  }
}

module.exports = new LeaveRepository();
