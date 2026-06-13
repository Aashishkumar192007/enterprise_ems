const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

router.use(authMiddleware);

// GET all groups (everyone can view)
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } }
        },
        _count: { select: { tasks: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create group (Admin/HR only)
router.post('/', roleMiddleware('Admin', 'HR'), async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await prisma.group.create({
      data: { name, description: description || null },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
        _count: { select: { tasks: true } }
      }
    });

    res.status(201).json({ success: true, data: group, message: 'Group created' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'A group with this name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add member to group (Admin/HR only)
router.post('/:id/members', roleMiddleware('Admin', 'HR'), async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    const { user_id, role } = req.body;

    const member = await prisma.groupMember.create({
      data: {
        group_id: groupId,
        user_id: parseInt(user_id),
        role: role || 'Member'
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    res.status(201).json({ success: true, data: member, message: 'Member added' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'User is already a member of this group' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE remove member from group (Admin/HR only)
router.delete('/:id/members/:userId', roleMiddleware('Admin', 'HR'), async (req, res) => {
  try {
    await prisma.groupMember.delete({
      where: {
        group_id_user_id: {
          group_id: parseInt(req.params.id),
          user_id: parseInt(req.params.userId)
        }
      }
    });

    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE group (Admin only)
router.delete('/:id', roleMiddleware('Admin'), async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    // Remove members first
    await prisma.groupMember.deleteMany({ where: { group_id: groupId } });
    // Unlink tasks
    await prisma.task.updateMany({ where: { group_id: groupId }, data: { group_id: null } });
    await prisma.group.delete({ where: { id: groupId } });
    res.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
