const prisma = require('../config/db');

class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data) {
    return prisma.user.create({ data });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(id, hashedPassword) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async createPasswordReset(userId, token, expiresAt) {
    return prisma.passwordReset.create({
      data: { user_id: userId, token, expires_at: expiresAt },
    });
  }

  async findPasswordReset(token) {
    return prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deletePasswordReset(id) {
    return prisma.passwordReset.delete({ where: { id } });
  }
}

module.exports = new UserRepository();
