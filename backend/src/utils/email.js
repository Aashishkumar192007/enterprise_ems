const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// We use Ethereal as a mock service since no SMTP credentials were provided
let transporter;

const createTransporter = async () => {
  if (transporter) return transporter;
  const account = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
  logger.info('Ethereal Email initialized');
  return transporter;
};

const sendEmail = async (to, subject, text, html) => {
  try {
    const tp = await createTransporter();
    const info = await tp.sendMail({
      from: '"i-SOFTZONE" <noreply@ems.local>',
      to,
      subject,
      text,
      html,
    });
    logger.info(`Message sent: ${info.messageId}`);
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
  } catch (error) {
    logger.error('Error sending email', { error: error.message });
    throw new Error('Email sending failed');
  }
};

module.exports = { sendEmail };
