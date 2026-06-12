const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Public route to fetch all active jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
});

// Public route to apply for a job
router.post('/:id/apply', async (req, res) => {
  try {
    const { name, email, cover_letter } = req.body;
    const jobId = parseInt(req.params.id);

    const application = await prisma.jobApplication.create({
      data: {
        job_id: jobId,
        name,
        email,
        cover_letter
      }
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
});

// Protected route to create a job (mocking auth check for brevity or use existing middleware if needed)
router.post('/', async (req, res) => {
  try {
    const { title, description, location, department } = req.body;
    const job = await prisma.job.create({
      data: { title, description, location, department }
    });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create job' });
  }
});

module.exports = router;
