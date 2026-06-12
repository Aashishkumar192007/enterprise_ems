const prisma = require('../config/db');

class EmployeeRepository {
  async findAll(skip, take, search) {
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeProfile: { designation: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    return prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        employeeProfile: {
          include: {
            department: true,
            skills: { include: { skill: true } }
          }
        }
      }
    });
  }

  async countAll(search) {
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeProfile: { designation: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    return prisma.user.count({ where });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        employeeProfile: {
          include: {
            department: true,
            skills: { include: { skill: true } }
          }
        }
      }
    });
  }

  async updateProfile(userId, profileData, skillIds) {
    return prisma.$transaction(async (prisma) => {
      let profile = await prisma.employeeProfile.findUnique({ where: { user_id: userId } });
      
      if (profile) {
        profile = await prisma.employeeProfile.update({
          where: { user_id: userId },
          data: profileData
        });
      } else {
        profile = await prisma.employeeProfile.create({
          data: { ...profileData, user_id: userId }
        });
      }

      if (skillIds && Array.isArray(skillIds)) {
        await prisma.employeeSkill.deleteMany({ where: { employee_profile_id: profile.id } });
        await prisma.employeeSkill.createMany({
          data: skillIds.map(skill_id => ({ employee_profile_id: profile.id, skill_id }))
        });
      }

      return profile;
    });
  }

  async delete(id) {
    // Delete profile and skills first, then user. Handled safely with relations or manual transaction.
    return prisma.$transaction([
      prisma.employeeSkill.deleteMany({ where: { employeeProfile: { user_id: id } } }),
      prisma.employeeProfile.deleteMany({ where: { user_id: id } }),
      prisma.user.delete({ where: { id } })
    ]);
  }
}

module.exports = new EmployeeRepository();
