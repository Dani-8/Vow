import { Router, Response } from 'express';
import { Challenge, IChallengeLog } from '../models/Challenge.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all challenges for the authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const rawChallenges = await Challenge.find({ userId: req.userId });
        const challenges = rawChallenges.map((c) => c.toObject());
        return res.json({ challenges });
    } catch (err: any) {
        console.error('Error fetching challenges:', err);
        return res.status(500).json({ error: 'Failed to fetch challenges' });
    }
});

// Get a single challenge by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const challenge = await Challenge.findOne({ id: req.params.id, userId: req.userId });
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        return res.json({ challenge: challenge.toObject() });
    } catch (err: any) {
        console.error('Error fetching challenge:', err);
        return res.status(500).json({ error: 'Failed to fetch challenge' });
    }
});

// Create a new challenge
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            id,
            title,
            description,
            category,
            color,
            icon,
            targetDays,
            startDate,
            targetEndDate,
            rule,
            consequenceOfSkipping,
            consequencesOfSkipping,
            tags,
            status,
            logs,
            sprints,
            currentSprintId,
        } = req.body;

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Challenge title is required' });
        }

        const consequences = Array.isArray(consequencesOfSkipping)
            ? consequencesOfSkipping
            : (consequenceOfSkipping ? [consequenceOfSkipping] : []);

        const created = await Challenge.create({
            id,
            userId: req.userId,
            title: title.trim(),
            description: description || '',
            category: category || 'engineering',
            color: color || 'purple',
            icon: icon || 'target',
            targetDays: Number(targetDays) || 30,
            startDate: startDate || new Date().toISOString(),
            targetEndDate,
            rule: rule || '',
            consequenceOfSkipping: consequenceOfSkipping || (consequences[0] || ''),
            consequencesOfSkipping: consequences,
            tags: Array.isArray(tags) ? tags : [],
            status: status || 'active',
            logs: Array.isArray(logs) ? logs : [],
            sprints: Array.isArray(sprints) ? sprints : [],
            currentSprintId,
        });

        return res.status(201).json({ challenge: created.toObject() });
    } catch (err: any) {
        console.error('Error creating challenge:', err);
        return res.status(500).json({ error: 'Failed to create challenge' });
    }
});

// Update an existing challenge
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const challenge = await Challenge.findOne({ id: req.params.id, userId: req.userId });
        if (!challenge) {
            // Create if doesn't exist
            const created = await Challenge.create({
                id: req.params.id,
                userId: req.userId,
                ...req.body,
            });
            return res.json({ challenge: created.toObject() });
        }

        if (req.body.title !== undefined) challenge.title = String(req.body.title).trim();
        if (req.body.description !== undefined) challenge.description = String(req.body.description);
        if (req.body.category !== undefined) challenge.category = String(req.body.category);
        if (req.body.color !== undefined) challenge.color = String(req.body.color);
        if (req.body.icon !== undefined) challenge.icon = String(req.body.icon);
        if (req.body.targetDays !== undefined) challenge.targetDays = Number(req.body.targetDays);
        if (req.body.startDate !== undefined) challenge.startDate = String(req.body.startDate);
        if (req.body.targetEndDate !== undefined) challenge.targetEndDate = String(req.body.targetEndDate);
        if (req.body.rule !== undefined) challenge.rule = String(req.body.rule);
        if (req.body.consequencesOfSkipping !== undefined) {
            challenge.consequencesOfSkipping = Array.isArray(req.body.consequencesOfSkipping) ? req.body.consequencesOfSkipping : [];
            challenge.consequenceOfSkipping = challenge.consequencesOfSkipping[0] || '';
        } else if (req.body.consequenceOfSkipping !== undefined) {
            challenge.consequenceOfSkipping = String(req.body.consequenceOfSkipping);
            challenge.consequencesOfSkipping = challenge.consequenceOfSkipping ? [challenge.consequenceOfSkipping] : [];
        }
