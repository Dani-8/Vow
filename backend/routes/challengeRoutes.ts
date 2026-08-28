import { Router, Response } from 'express';
import { Challenge, IChallengeLog } from '../models/Challenge.js';
import { INITIAL_DEMO_CHALLENGES_SERVER } from '../data/demoChallenges.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get all challenges for the authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        let rawChallenges = await Challenge.find({ userId: req.userId });

        // If user has no challenges yet (e.g. fresh session), auto-seed the demo challenges
        if (rawChallenges.length === 0 && INITIAL_DEMO_CHALLENGES_SERVER.length > 0) {
            for (const chData of INITIAL_DEMO_CHALLENGES_SERVER) {
                await Challenge.create({
                    ...chData,
                    userId: req.userId,
                });
            }
            rawChallenges = await Challenge.find({ userId: req.userId });
        } else {
            // Update or enrich existing Russian challenge with multi-phase demo sprints if needed
            const russianDemo = INITIAL_DEMO_CHALLENGES_SERVER.find(
                (c) => c.id === 'ch-russian-phases' || c.title === 'Learn Conversational Russian'
            );
            if (russianDemo) {
                for (const ch of rawChallenges) {
                    if (
                        (ch.id === 'ch-russian-phases' ||
                            ch.id === 'challenge-russian-mastery-3' ||
                            ch.title === 'Learn Conversational Russian') &&
                        (!ch.sprints || ch.sprints.length <= 1)
                    ) {
                        ch.sprints = russianDemo.sprints;
                        ch.currentSprintId = russianDemo.currentSprintId;
                        ch.targetDays = russianDemo.targetDays;
                        ch.rule = russianDemo.rule;
                        ch.logs = russianDemo.logs;
                        await ch.save();
                    }
                }
            }
        }

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
        let challenge = await Challenge.findOne({ id: req.params.id, userId: req.userId });
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Migrate Russian challenge if needed
        if (
            (challenge.id === 'ch-russian-phases' ||
                challenge.id === 'challenge-russian-mastery-3' ||
                challenge.title === 'Learn Conversational Russian') &&
            (!challenge.sprints || challenge.sprints.length <= 1)
        ) {
            const russianDemo = INITIAL_DEMO_CHALLENGES_SERVER.find(
                (c) => c.id === 'ch-russian-phases' || c.title === 'Learn Conversational Russian'
            );
            if (russianDemo) {
                challenge.sprints = russianDemo.sprints;
                challenge.currentSprintId = russianDemo.currentSprintId;
                challenge.targetDays = russianDemo.targetDays;
                challenge.rule = russianDemo.rule;
                challenge.logs = russianDemo.logs;
                await challenge.save();
            }
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
            tags,
            status,
            logs,
        } = req.body;

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Challenge title is required' });
        }

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
            tags: Array.isArray(tags) ? tags : [],
            status: status || 'active',
            logs: Array.isArray(logs) ? logs : [],
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
        if (Array.isArray(req.body.tags)) challenge.tags = req.body.tags;
        if (req.body.status !== undefined) challenge.status = req.body.status;
        if (Array.isArray(req.body.logs)) challenge.logs = req.body.logs;
        if (Array.isArray(req.body.sprints)) challenge.sprints = req.body.sprints;
        if (req.body.currentSprintId !== undefined) challenge.currentSprintId = req.body.currentSprintId;

        await challenge.save();
        return res.json({ challenge: challenge.toObject() });
    } catch (err: any) {
        console.error('Error updating challenge:', err);
        return res.status(500).json({ error: 'Failed to update challenge' });
    }
});

// Add or update a day log in a challenge
router.post('/:id/log', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const challenge = await Challenge.findOne({ id: req.params.id, userId: req.userId });
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        const { dayNumber, date, status, note, timeSpent, imageUrl, sprintId } = req.body;
        const targetDay = Number(dayNumber) || 1;
        const logDate = date || new Date().toISOString().split('T')[0];
        const logStatus = status || 'completed';

        const existingIndex = challenge.logs.findIndex((l) => Number(l.dayNumber) === targetDay);

        const newLog: IChallengeLog = {
            id: existingIndex >= 0 ? challenge.logs[existingIndex].id : `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            dayNumber: targetDay,
            date: logDate,
            status: logStatus,
            note: note || '',
            timeSpent: timeSpent || '',
            imageUrl: imageUrl || '',
            createdAt: existingIndex >= 0 ? challenge.logs[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {