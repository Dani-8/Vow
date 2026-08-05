import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateTaskEffectiveStreak, registerTaskCompletion, calculateMasterStreak } from '../utils/streaks.js';

const router = Router();

// Middleware helper to check PIN for private section access
async function verifyPinHeader(req: AuthenticatedRequest, res: Response): Promise<boolean> {
  const pin = req.headers['x-private-pin'] as string;
  if (!pin) {
    res.status(403).json({ error: 'Private section access requires PIN authentication' });
    return false;
  }

  const user = await User.findById(req.userId);
  if (!user || !user.pinHash) {
    res.status(400).json({ error: 'Personal growth section PIN not set up' });
    return false;
  }

  const isMatch = await bcrypt.compare(pin, user.pinHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid PIN for personal growth area' });
    return false;
  }

  return true;
}

// Get visible (public) tasks
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rawTasks = await Task.find({ userId: req.userId, isPrivate: false }).sort({ createdAt: -1 });

    const tasks = rawTasks.map((t) => {
      const streakInfo = calculateTaskEffectiveStreak(t);
      return {
        ...t.toObject(),
        effectiveCurrentStreak: streakInfo.currentStreak,
        effectiveBestStreak: streakInfo.bestStreak,
        completedToday: streakInfo.completedToday,
        missedPreviousDays: streakInfo.missedPreviousDays,
      };
    });

    return res.json({ tasks });
  } catch (err: any) {
    console.error('Error getting tasks:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get private tasks (Locked behind PIN)
router.post('/private-list', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pinVerified = await verifyPinHeader(req, res);
    if (!pinVerified) return;

    const rawTasks = await Task.find({ userId: req.userId, isPrivate: true }).sort({ createdAt: -1 });

    const tasks = rawTasks.map((t) => {
      const streakInfo = calculateTaskEffectiveStreak(t);
      return {
        ...t.toObject(),
        effectiveCurrentStreak: streakInfo.currentStreak,
        effectiveBestStreak: streakInfo.bestStreak,
        completedToday: streakInfo.completedToday,
        missedPreviousDays: streakInfo.missedPreviousDays,
      };
    });

    return res.json({ tasks });
  } catch (err: any) {
    console.error('Error getting private tasks:', err);
    return res.status(500).json({ error: 'Failed to fetch private tasks' });
  }
});

// Create task or habit
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, tags, startTime, endTime, isPrivate, isHabit } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (isPrivate) {
      const pinVerified = await verifyPinHeader(req, res);
      if (!pinVerified) return;
    }

    const task = await Task.create({
      userId: req.userId,
      title: title.trim(),
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      isPrivate: !!isPrivate,
      isHabit: !!isHabit,
      status: 'todo',
      currentStreak: 0,
      bestStreak: 0,
      completionHistory: [],
    });

    return res.status(201).json({ task });
  } catch (err: any) {
    console.error('Error creating task:', err);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tags, startTime, endTime, status, isHabit } = req.body;

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.isPrivate) {
      const pinVerified = await verifyPinHeader(req, res);
      if (!pinVerified) return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (tags !== undefined) task.tags = tags;
    if (startTime !== undefined) task.startTime = startTime ? new Date(startTime) : null;
    if (endTime !== undefined) task.endTime = endTime ? new Date(endTime) : null;
    if (status !== undefined) task.status = status;
    if (isHabit !== undefined) task.isHabit = isHabit;

    await task.save();

    const streakInfo = calculateTaskEffectiveStreak(task);

    return res.json({
      task: {
        ...task.toObject(),
        effectiveCurrentStreak: streakInfo.currentStreak,
        effectiveBestStreak: streakInfo.bestStreak,
        completedToday: streakInfo.completedToday,
      },
    });
  } catch (err: any) {
    console.error('Error updating task:', err);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

// Complete / Uncomplete Task (Streak logic)
router.post('/:id/complete', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.isPrivate) {
      const pinVerified = await verifyPinHeader(req, res);
      if (!pinVerified) return;
    }

    // Toggle completion status
    if (task.status === 'completed') {
      // Uncomplete
      task.status = 'todo';
    } else {
      // Complete
      task.status = 'completed';
      const streakResult = registerTaskCompletion(task);

      task.currentStreak = streakResult.currentStreak;
      task.bestStreak = streakResult.bestStreak;
      task.lastCompletedDate = streakResult.lastCompletedDate;

      // Append to completion history if not already present for today
      const today = new Date();
      task.completionHistory.push(today);
    }

    await task.save();

    const streakInfo = calculateTaskEffectiveStreak(task);

    return res.json({
      task: {
        ...task.toObject(),
        effectiveCurrentStreak: streakInfo.currentStreak,
        effectiveBestStreak: streakInfo.bestStreak,
        completedToday: streakInfo.completedToday,
      },
    });
  } catch (err: any) {
    console.error('Error toggling completion:', err);
    return res.status(500).json({ error: 'Failed to update completion status' });
  }
});

// Move task between visible and private sections
router.post('/:id/toggle-private', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const pinVerified = await verifyPinHeader(req, res);
    if (!pinVerified) return;

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.isPrivate = !task.isPrivate;
    await task.save();

    return res.json({
      message: task.isPrivate ? 'Moved to Personal Growth section' : 'Moved to Public Tasks section',
      task,
    });
  } catch (err: any) {
    console.error('Error toggling private status:', err);
    return res.status(500).json({ error: 'Failed to transfer task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.isPrivate) {
      const pinVerified = await verifyPinHeader(req, res);
      if (!pinVerified) return;
    }

    await Task.deleteOne({ _id: id });

    return res.json({ message: 'Task removed successfully' });
  } catch (err: any) {
    console.error('Error deleting task:', err);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Direct Daily Check-in from Master Streak banner
router.post('/checkin-today', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let defaultTask = await Task.findOne({
      userId: req.userId,
      title: 'Daily Vow Check-in',
      isHabit: true,
    });

    if (!defaultTask) {
      defaultTask = await Task.create({
        userId: req.userId,
        title: 'Daily Vow Check-in',
        description: 'Daily operational commitment and streak check-in',
        tags: ['Daily', 'Habit'],
        isHabit: true,
        isPrivate: false,
        status: 'todo',
        currentStreak: 0,
        bestStreak: 0,
        completionHistory: [],
      });
    }

    if (defaultTask.status !== 'completed') {
      defaultTask.status = 'completed';
      const streakResult = registerTaskCompletion(defaultTask);

      defaultTask.currentStreak = streakResult.currentStreak;
      defaultTask.bestStreak = streakResult.bestStreak;
      defaultTask.lastCompletedDate = streakResult.lastCompletedDate;

      const today = new Date();
      defaultTask.completionHistory.push(today);

      await defaultTask.save();
    }

    const allTasks = await Task.find({ userId: req.userId });
    const stats = calculateMasterStreak(allTasks);

    return res.json({
      message: 'Checked in successfully for today!',
      stats,
    });
  } catch (err: any) {
    console.error('Error logging check-in:', err);
    return res.status(500).json({ error: 'Failed to log daily check-in' });
  }
});

// Master Streak & Overall Stats
router.get('/stats/master', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allTasks = await Task.find({ userId: req.userId });

    const stats = calculateMasterStreak(allTasks);

    return res.json({
      masterStreak: stats.masterStreak,
      activeToday: stats.activeToday,
      totalCheckIns: stats.totalCheckIns,
      completedDaysSet: stats.completedDaysSet,
      totalTasks: allTasks.filter((t) => !t.isHabit).length,
      totalHabits: allTasks.filter((t) => t.isHabit).length,
    });
  } catch (err: any) {
    console.error('Error fetching master stats:', err);
    return res.status(500).json({ error: 'Failed to compute stats' });
  }
});

export default router;
