const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authMiddleware);

// GET all tasks (Admin/HR see all, Manager sees team, User sees assigned)
router.get('/', async (req, res) => {
  try {
    const { role, id } = req.user;
    let where = {};

    if (role === 'User') {
      where = { assigned_to: id };
    } else if (role === 'Manager') {
      where = { OR: [{ assigned_to: id }, { created_by: id }] };
    }
    // Admin/HR see all

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create task (Admin/HR/Manager only)
router.post('/', roleMiddleware('Admin', 'HR', 'Manager'), async (req, res) => {
  try {
    const { title, description, priority, due_date, assigned_to, group_id } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'Medium',
        due_date: due_date ? new Date(due_date) : null,
        created_by: req.user.id,
        assigned_to: assigned_to ? parseInt(assigned_to) : null,
        group_id: group_id ? parseInt(group_id) : null
      },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        group: { select: { id: true, name: true } }
      }
    });

    res.status(201).json({ success: true, data: task, message: 'Task created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update task status (assignee or creator)
router.put('/:id/status', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Only assignee, creator, admin, or HR can update status
    const canUpdate = task.assigned_to === req.user.id || task.created_by === req.user.id
      || req.user.role === 'Admin' || req.user.role === 'HR';

    if (!canUpdate) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        group: { select: { id: true, name: true } }
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update full task (creator, Admin, HR)
router.put('/:id', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, priority, due_date, assigned_to, group_id, status } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const canEdit = task.created_by === req.user.id || req.user.role === 'Admin' || req.user.role === 'HR';
    if (!canEdit) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this task' });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(assigned_to !== undefined && { assigned_to: assigned_to ? parseInt(assigned_to) : null }),
        ...(group_id !== undefined && { group_id: group_id ? parseInt(group_id) : null })
      },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        group: { select: { id: true, name: true } }
      }
    });

    res.json({ success: true, data: updated, message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE task (Admin/HR only)
router.delete('/:id', roleMiddleware('Admin', 'HR'), async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
