import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { TaskMap } from '../models/TaskMap.js';
import { Challenge } from '../models/Challenge.js';
import { INITIAL_DEMO_TASK_MAPS_SERVER } from '../data/demoTaskMaps.js';
import { INITIAL_DEMO_CHALLENGES_SERVER } from '../data/demoChallenges.js';
import { authenticateToken, generateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Utility to generate formatted Recovery Key (e.g. VOW-8K9P-4X2M-7Z1Q)
function generateRecoveryKey(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const segment = (len: number) => {
        let res = '';
        for (let i = 0; i < len; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    };
    return `VOW-${segment(4)}-${segment(4)}-${segment(4)}`;
}

// Signup (Pure Username + Password + Recovery Key)
router.post('/signup', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { username, password, name } = req.body;

        const cleanUsername = (username || '').toLowerCase().trim();
        if (!cleanUsername || cleanUsername.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existing = await User.findOne({ username: cleanUsername });
        if (existing) {
            return res.status(400).json({ error: 'This username is already taken. Please choose another.' });
        }

        // Generate private recovery key
        const recoveryKey = generateRecoveryKey();
        const passwordHash = await bcrypt.hash(password, 10);
        const recoveryKeyHash = await bcrypt.hash(recoveryKey, 10);

        const user = await User.create({
            username: cleanUsername,
            email: `${cleanUsername}@vow.user`,
            passwordHash,
            recoveryKeyHash,
            plainRecoveryKey: recoveryKey,
            name: name?.trim() || cleanUsername,
        });

        const token = generateToken(user._id.toString());

        return res.status(201).json({
            token,
            recoveryKey, // Returned once on signup for the "Save Your Private Key" modal
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                recoveryKey: user.plainRecoveryKey,
                createdAt: user.createdAt,
                hasPinSet: !!user.pinHash,
            },
        });
    } catch (err: any) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login (Username + Password)
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const identifier = (username || email || '').toLowerCase().trim();

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Search by username, fallback to email for backwards compatibility
        let user = await User.findOne({ username: identifier });
        if (!user && identifier.includes('@')) {
            user = await User.findOne({ email: identifier });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // If older account had no recovery key, provision one now
        if (!user.plainRecoveryKey) {
            const newKey = generateRecoveryKey();
            user.plainRecoveryKey = newKey;
            user.recoveryKeyHash = await bcrypt.hash(newKey, 10);
            await user.save();
        }

        const token = generateToken(user._id.toString());

        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                recoveryKey: user.plainRecoveryKey,
                createdAt: user.createdAt,
                hasPinSet: !!user.pinHash,
            },
        });
    } catch (err: any) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Failed to log in' });
    }
});

// Reset Password via Recovery Key
router.post('/reset-password', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { username, recoveryKey, newPassword } = req.body;
        const cleanUsername = (username || '').toLowerCase().trim();
        const cleanKey = (recoveryKey || '').trim().toUpperCase();

        if (!cleanUsername || !cleanKey || !newPassword) {
            return res.status(400).json({ error: 'Username, recovery key, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const user = await User.findOne({ username: cleanUsername });
        if (!user) {
            return res.status(404).json({ error: 'Account not found with this username' });
        }

        // Validate recovery key (check hash or direct key match)
        let keyValid = false;
        if (user.recoveryKeyHash) {
            keyValid = await bcrypt.compare(cleanKey, user.recoveryKeyHash);
        }
        if (!keyValid && user.plainRecoveryKey) {
            keyValid = user.plainRecoveryKey.toUpperCase() === cleanKey;
        }

        if (!keyValid) {
            return res.status(401).json({ error: 'Invalid recovery key for this username' });
        }

        // Update password
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        const token = generateToken(user._id.toString());

        return res.json({
            message: 'Password successfully reset',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                recoveryKey: user.plainRecoveryKey,
                createdAt: user.createdAt,
                hasPinSet: !!user.pinHash,
            },
        });
    } catch (err: any) {
        console.error('Password reset error:', err);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Demo Bypass for Testing
router.post('/demo-bypass', async (req: AuthenticatedRequest, res: Response) => {
    try {
        let user = await User.findOne({ email: 'demo@vow.app' });
        if (!user) {
            const passwordHash = await bcrypt.hash('demopass', 10);
            const pinHash = await bcrypt.hash('1234', 10);
            user = await User.create({
                email: 'demo@vow.app',
                passwordHash,
                pinHash,
                name: 'Alex Rivera',
            });
        }

        // Ensure demo tasks exist for demo user
        const existingTasks = await Task.find({ userId: user._id });
        if (existingTasks.length === 0) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const fourDaysAgo = new Date();
            fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
            const now = new Date();
            const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

            await Task.create([
                {
                    _id: 'task_russian_mastery_r7u2k',
                    userId: user._id,
                    title: 'Russian Language Learning: Daily Fluency & Grammar Path',
                    description: 'Master Cyrillic script, top 1,000 core vocabulary words, noun cases (Accusative/Genitive/Prepositional), and daily conversational shadowing.',
                    tags: ['Russian', 'Language', 'Daily'],
                    startTime: now,
                    endTime: inTwoHours,
                    status: 'in_progress',
                    isPrivate: false,
                    isHabit: true,
                    currentStreak: 6,
                    bestStreak: 14,
                    lastCompletedDate: yesterday,
                    completionHistory: [fiveDaysAgo, fourDaysAgo, threeDaysAgo, twoDaysAgo, yesterday],
                    subTasks: [
                        {
                            id: 'sub_ru_1',
                            taskId: 'task_russian_mastery_r7u2k',
                            title: 'Cyrillic Alphabet & Phonetic Pronunciation Drills',
                            dateLabel: 'Completed',
                            status: 'completed',
                            priority: 'High',
                        },
                        {
                            id: 'sub_ru_2',
                            taskId: 'task_russian_mastery_r7u2k',
                            title: 'Top 500 High-Frequency Russian Vocabulary & Spaced Repetition',
                            dateLabel: 'Today',
                            status: 'in_progress',
                            priority: 'High',
                        },
                        {
                            id: 'sub_ru_3',
                            taskId: 'task_russian_mastery_r7u2k',
                            title: 'Russian Noun Cases & 1st/2nd Verb Conjugations',
                            dateLabel: 'Today',
                            status: 'in_progress',
                            priority: 'Medium',
                        },
                        {
                            id: 'sub_ru_4',
                            taskId: 'task_russian_mastery_r7u2k',
                            title: '20-Minute Daily Russian Podcast Listening (Slow Russian)',
                            dateLabel: 'Tomorrow',
                            status: 'pending',
                            priority: 'Medium',
                        },
                        {
                            id: 'sub_ru_5',
                            taskId: 'task_russian_mastery_r7u2k',
                            title: 'Conversational Dialogue Shadowing & Voice Journaling',
                            dateLabel: 'This Week',
                            status: 'pending',
                            priority: 'Low',
                        },
                    ],
                },
                {
                    _id: 'task_ai_engineer_a8x4m',
                    userId: user._id,
                    title: 'AI Engineering: Production Agents, RAG & LLM Workflows',
                    description: 'Build production-grade AI systems with Gemini API, Function Calling, Multi-agent orchestration, RAG vector pipelines, and evaluation metrics.',
                    tags: ['AI_Eng', 'LLM', 'Agents', 'Gemini'],
                    startTime: now,
                    endTime: inTwoHours,
                    status: 'in_progress',
                    isPrivate: false,
                    isHabit: false,
                    currentStreak: 4,
                    bestStreak: 10,
                    lastCompletedDate: yesterday,
                    completionHistory: [threeDaysAgo, twoDaysAgo, yesterday],
                    subTasks: [
                        {
                            id: 'sub_ai_1',
                            taskId: 'task_ai_engineer_a8x4m',
                            title: 'Gemini 2.5 API Integration & Structured Schema Outputs',
                            dateLabel: 'Completed',
                            status: 'completed',
                            priority: 'High',
                        },
                        {
                            id: 'sub_ai_2',
                            taskId: 'task_ai_engineer_a8x4m',
                            title: 'Tool Calling & Autonomous Agent Execution Loop',
                            dateLabel: 'Today',
                            status: 'in_progress',
                            priority: 'High',
                        },
                        {
                            id: 'sub_ai_3',
                            taskId: 'task_ai_engineer_a8x4m',
                            title: 'Hybrid RAG Pipeline with Embeddings & Vector Search',
                            dateLabel: 'Tomorrow',
                            status: 'in_progress',
                            priority: 'High',
                        },
                        {
                            id: 'sub_ai_4',
                            taskId: 'task_ai_engineer_a8x4m',
                            title: 'Multi-Turn Context Management & Token Cost Optimization',
                            dateLabel: 'This Week',
                            status: 'pending',
                            priority: 'Medium',
                        },
                        {
                            id: 'sub_ai_5',
                            taskId: 'task_ai_engineer_a8x4m',
                            title: 'End-to-End Autonomous Agent Architecture Benchmark',
                            dateLabel: 'Next Week',
                            status: 'pending',
                            priority: 'High',
                        },
                    ],
                },
                {
                    _id: 'task_mern_project_m3k9p',
                    userId: user._id,
                    title: 'Full-Stack MERN Project: Scalable App & Cloud Deployment',
                    description: 'Architect, build, and ship a modern MERN web application with secure authentication and real-time updates.',
                    tags: ['MERN', 'FullStack', 'React', 'Express'],
                    startTime: now,
                    endTime: inTwoHours,
                    status: 'in_progress',
                    isPrivate: false,
                    isHabit: false,
                    currentStreak: 5,
                    bestStreak: 12,
                    lastCompletedDate: yesterday,
                    completionHistory: [fourDaysAgo, threeDaysAgo, twoDaysAgo, yesterday],
                    subTasks: [
                        {
                            id: 'sub_mern_1',
                            taskId: 'task_mern_project_m3k9p',
                            title: 'Express RESTful API Architecture & JWT Auth Middleware',
                            dateLabel: 'Completed',
                            status: 'completed',
                            priority: 'High',
                        },
                        {
                            id: 'sub_mern_2',
                            taskId: 'task_mern_project_m3k9p',
                            title: 'Database Schema Models, Indexing & Validation',
                            dateLabel: 'Completed',
                            status: 'completed',
                            priority: 'High',
                        },
                        {
                            id: 'sub_mern_3',
                            taskId: 'task_mern_project_m3k9p',
                            title: 'React 18 Modular Components, Tailwind CSS & Motion',
                            dateLabel: 'Today',
                            status: 'in_progress',
                            priority: 'High',
                        },
                        {
                            id: 'sub_mern_4',
                            taskId: 'task_mern_project_m3k9p',
                            title: 'Global State Management & Optimistic CRUD Updates',
                            dateLabel: 'Tomorrow',
                            status: 'in_progress',
                            priority: 'Medium',
                        },
                        {
                            id: 'sub_mern_5',
                            taskId: 'task_mern_project_m3k9p',
                            title: 'Docker Containerization & Production Cloud Run Deploy',
                            dateLabel: 'Next Week',
                            status: 'pending',
                            priority: 'High',
                        },
                    ],
                },
                {
                    _id: 'task_private_clarity_9vbt1',
                    userId: user._id,
                    title: 'Personal High-Performance Vow & Growth Tracker',
                    description: 'Long-range personal milestones, deep work discipline, and private reflections on focus.',
                    tags: ['Discipline', 'Private', 'Focus'],
                    status: 'in_progress',
                    isPrivate: true,
                    isHabit: false,
                    currentStreak: 5,
                    bestStreak: 12,
                    lastCompletedDate: yesterday,
                    completionHistory: [threeDaysAgo, twoDaysAgo, yesterday],
                },
            ]);
        }

        // Ensure demo task maps exist for demo user
        const existingMaps = await TaskMap.find({ userId: user._id });
        if (existingMaps.length === 0) {
            for (const mapData of INITIAL_DEMO_TASK_MAPS_SERVER) {
                await TaskMap.create({
                    ...mapData,
                    userId: user._id,
                });
            }
        }

        // Ensure demo challenges exist for demo user
        const existingChallenges = await Challenge.find({ userId: user._id });
        if (existingChallenges.length === 0) {
            for (const chData of INITIAL_DEMO_CHALLENGES_SERVER) {
                await Challenge.create({
                    ...chData,
                    userId: user._id,
                });
            }
        }

        const token = generateToken(user._id.toString());