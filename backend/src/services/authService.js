const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const { sendEmail } = require('../utils/email');

class AuthService {
  async register(data) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const payload = { id: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return; // Silent return for security

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await userRepository.createPasswordReset(user.id, token, expiresAt);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await sendEmail(
      user.email,
      'Password Reset - i-SOFTZONE',
      `Click the following link to reset your password: ${resetLink}`,
      `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    );
  }

  async resetPassword(token, newPassword) {
    const resetRecord = await userRepository.findPasswordReset(token);
    if (!resetRecord || resetRecord.expires_at < new Date()) {
      const err = new Error('Invalid or expired reset token');
      err.statusCode = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(resetRecord.user_id, hashedPassword);
    await userRepository.deletePasswordReset(resetRecord.id);
  }
}

module.exports = new AuthService();
