const cron = require('node-cron');
const logger = require('./logger');
const prisma = require('./db');
const { sendEmail } = require('../utils/email');

// Schedule a daily leave report at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    logger.info('Running daily leave report cron job...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leaves = await prisma.leaveApplication.findMany({
      where: {
        status: 'Approved',
        start_date: { lte: today },
        end_date: { gte: today }
      },
      include: { user: true }
    });

    if (leaves.length > 0) {
      const emailText = leaves.map(l => `${l.user.name} is on leave today (until ${l.end_date.toISOString().split('T')[0]}).`).join('\n');
      
      // Assume Admin/HR group email or we fetch Admin users
      await sendEmail('hr@ems.local', 'Daily Leave Report', emailText, `<pre>${emailText}</pre>`);
      logger.info('Daily leave report sent successfully');
    } else {
      logger.info('No one is on leave today.');
    }
  } catch (error) {
    logger.error('Error running daily leave report cron job', { error: error.message });
  }
});
