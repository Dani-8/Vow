import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './db.js';
import { User } from './models/User.js';
import { Task } from './models/Task.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Vow', time: new Date().toISOString() });
});

// Seed default demo user & tasks if DB is clean
async function seedDemoData() {
    try {
        let demoUser = await User.findOne({ email: 'demo@vow.app' });
        if (!demoUser) {
            console.log('Seeding demo user for Vow app...');
            const passwordHash = await bcrypt.hash('demopass', 10);
            const pinHash = await bcrypt.hash('1234', 10);

            demoUser = await User.create({
                email: 'demo@vow.app',
                passwordHash,
                pinHash,
                name: 'Alex Rivera',
            });
        }

        const existingTasks = await Task.find({ userId: demoUser._id });
        if (existingTasks.length === 0) {
            console.log('Seeding demo tasks for demo user...');
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
                    userId: demoUser._id,
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
                    userId: demoUser._id,
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
                    userId: demoUser._id,
                    title: 'Full-Stack MERN Project: Scalable App & Cloud Deployment',
                    description: 'Architect, build, and ship a modern MERN (MongoDB/Firestore, Express, React 18, Node.js) web application with secure authentication and real-time updates.',
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
                    userId: demoUser._id,
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

            console.log('Demo data seeded successfully (User: demo@vow.app / demopass, PIN: 1234)');
        }
    } catch (err) {
        console.error('Error seeding demo data:', err);
    }
}

async function startServer() {
    try {
        await connectDB();
        await seedDemoData();
    } catch (err) {
        console.warn('Database initialization warning (server will continue with fallback):', err);
    }

    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
            configFile: path.resolve(process.cwd(), 'frontend/vite.config.ts'),
            root: path.resolve(process.cwd(), 'frontend'),
        });
        app.use(vite.middlewares);
        app.use('*', async (req, res, next) => {
            const url = req.originalUrl;
            try {
                let template = fs.readFileSync(path.resolve(process.cwd(), 'frontend/index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
            } catch (e) {
                vite.ssrFixStacktrace(e as Error);
                next(e);
            }
        });
    } else {
        const distPath = path.resolve(process.cwd(), 'frontend/dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Vow server running at http://0.0.0.0:${PORT}`);
    });
}

startServer();
