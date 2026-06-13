const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authMiddleware);

// Get all attendance (Admin/HR/Manager)
router.get('/', roleMiddleware('Admin', 'HR', 'Manager'), async (req, res) => {
  try {
    const { date } = req.query;
    let queryDate = new Date();
    if (date) {
      queryDate = new Date(date);
    }
    queryDate.setHours(0, 0, 0, 0);

    const records = await prisma.attendance.findMany({
      where: { date: queryDate },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } }
      },
      orderBy: { user: { name: 'asc' } }
    });

    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
  }
});

// Clock in
router.post('/clock-in', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.upsert({
      where: {
        user_id_date: {
          user_id: userId,
          date: today
        }
      },
      update: {
        clock_in: new Date()
      },
      create: {
        user_id: userId,
        date: today,
        clock_in: new Date(),
        status: 'Present'
      }
    });

    res.json({ success: true, message: 'Clocked in successfully', data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clock in' });
  }
});

// Clock out
router.post('/clock-out', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.update({
      where: {
        user_id_date: {
          user_id: userId,
          date: today
        }
      },
      data: {
        clock_out: new Date()
      }
    });

    res.json({ success: true, message: 'Clocked out successfully', data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clock out' });
  }
});

// Get My Attendance
router.get('/my-attendance', async (req, res) => {
  try {
    const userId = req.user.id;
    // Get last 7 days for dashboard
    const history = await prisma.attendance.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
      take: 7
    });

    // Also get today's specific record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecord = history.find(a => new Date(a.date).getTime() === today.getTime());

    res.json({ success: true, data: { history, today: todayRecord } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

module.exports = router;
