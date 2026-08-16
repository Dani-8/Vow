import { Router, Response } from 'express';
import { TaskMap } from '../models/TaskMap.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all task maps for the current user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rawMaps = await TaskMap.find({ userId: req.userId });
    const maps = rawMaps.map((m) => m.toObject());
    return res.json({ maps });
  } catch (err: any) {
    console.error('Error getting task maps:', err);
    return res.status(500).json({ error: 'Failed to fetch task maps' });
  }
});

// Get a single task map by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const map = await TaskMap.findOne({ id: req.params.id, userId: req.userId });
    if (!map) {
      return res.status(404).json({ error: 'Task map not found' });
    }
    return res.json({ map: map.toObject() });
  } catch (err: any) {
    console.error('Error fetching task map:', err);
    return res.status(500).json({ error: 'Failed to fetch task map' });
  }
});

// Create a new task map
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, name, description, color, isPrimary, nodes, connections } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Map name is required' });
    }

    const created = await TaskMap.create({
      id,
      userId: req.userId,
      name: name.trim(),
      description: description || '',
      color: color || 'purple',
      isPrimary: !!isPrimary,
      nodes: Array.isArray(nodes) ? nodes : [],
      connections: Array.isArray(connections) ? connections : [],
    });

    return res.status(201).json({ map: created.toObject() });
  } catch (err: any) {
    console.error('Error creating task map:', err);
    return res.status(500).json({ error: 'Failed to create task map' });
  }
});

// Update an existing task map
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const map = await TaskMap.findOne({ id: req.params.id, userId: req.userId });
    if (!map) {
      // If doesn't exist yet, create it with this ID
      const created = await TaskMap.create({
        id: req.params.id,
        userId: req.userId,
        name: req.body.name || 'Untitled Map',
        description: req.body.description || '',
        color: req.body.color || 'purple',
        isPrimary: !!req.body.isPrimary,
        nodes: Array.isArray(req.body.nodes) ? req.body.nodes : [],
        connections: Array.isArray(req.body.connections) ? req.body.connections : [],
      });
      return res.json({ map: created.toObject() });
    }

    if (req.body.name !== undefined) map.name = String(req.body.name);
    if (req.body.description !== undefined) map.description = String(req.body.description);
    if (req.body.color !== undefined) map.color = String(req.body.color);
    if (req.body.isPrimary !== undefined) map.isPrimary = Boolean(req.body.isPrimary);
    if (Array.isArray(req.body.nodes)) map.nodes = req.body.nodes;
    if (Array.isArray(req.body.connections)) map.connections = req.body.connections;

    await map.save();
    return res.json({ map: map.toObject() });
  } catch (err: any) {
    console.error('Error updating task map:', err);
    return res.status(500).json({ error: 'Failed to update task map' });
  }
});

// Bulk sync/save all task maps for the user
router.post('/bulk-sync', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { maps } = req.body;
    if (!Array.isArray(maps)) {
      return res.status(400).json({ error: 'Expected array of maps' });
    }

    const savedMaps = [];
    for (const m of maps) {
      if (!m || !m.name) continue;
      const targetId = m.id || m._id;
      let existing = targetId ? await TaskMap.findOne({ id: targetId, userId: req.userId }) : null;
      if (existing) {
        existing.name = m.name;
        existing.description = m.description || '';
        existing.color = m.color || 'purple';
        existing.isPrimary = !!m.isPrimary;
        if (Array.isArray(m.nodes)) existing.nodes = m.nodes;
        if (Array.isArray(m.connections)) existing.connections = m.connections;
        await existing.save();
        savedMaps.push(existing.toObject());
      } else {
        const created = await TaskMap.create({
          id: targetId,
          userId: req.userId,
          name: m.name,
          description: m.description || '',
          color: m.color || 'purple',
          isPrimary: !!m.isPrimary,
          nodes: Array.isArray(m.nodes) ? m.nodes : [],
          connections: Array.isArray(m.connections) ? m.connections : [],
        });
        savedMaps.push(created.toObject());
      }
    }

    return res.json({ maps: savedMaps, success: true });
  } catch (err: any) {
    console.error('Error bulk syncing task maps:', err);
    return res.status(500).json({ error: 'Failed to bulk sync task maps' });
  }
});

// Delete a task map
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await TaskMap.deleteOne({ id: req.params.id, userId: req.userId });
    return res.json({ success: true, message: 'Task map deleted' });
  } catch (err: any) {
    console.error('Error deleting task map:', err);
    return res.status(500).json({ error: 'Failed to delete task map' });
  }
});

export default router;
