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

      const now = new Date();
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      await Task.create([
        {
          userId: demoUser._id,
          title: '30-minute Morning Focus Meditation',
          description: 'Start the day with silent breathing and intention setting.',
          tags: ['Wellness', 'Routine'],
          status: 'completed',
          isPrivate: false,
          isHabit: true,
          currentStreak: 7,
          bestStreak: 14,
          lastCompletedDate: now,
          completionHistory: [threeDaysAgo, twoDaysAgo, yesterday, now],
        },
        {
          userId: demoUser._id,
          title: 'Draft Q3 Personal Growth Blueprint',
          description: 'Outline key milestones for skill acquisition and mental health goals.',
          tags: ['Growth', 'Strategy'],
          startTime: now,
          endTime: inTwoHours,
          status: 'in_progress',
          isPrivate: false,
          isHabit: false,
          currentStreak: 3,
          bestStreak: 5,
          lastCompletedDate: yesterday,
          completionHistory: [threeDaysAgo, twoDaysAgo, yesterday],
        },
        {
          userId: demoUser._id,
          title: 'Read 20 pages of "Atomic Habits"',
          description: 'Focus on identity-based habit formation chapters.',
          tags: ['Learning', 'Reading'],
          status: 'todo',
          isPrivate: false,
          isHabit: true,
          currentStreak: 4,
          bestStreak: 12,
          lastCompletedDate: yesterday,
          completionHistory: [threeDaysAgo, twoDaysAgo, yesterday],
        },
        {
          userId: demoUser._id,
          title: 'Digital Detox: No social media scrolling after 10 PM',
          description: 'Replace screen time with physical journaling or soft ambient music.',
          tags: ['Mindfulness', 'Personal'],
          status: 'completed',
          isPrivate: true,
          isHabit: true,
          currentStreak: 9,
          bestStreak: 9,
          lastCompletedDate: now,
          completionHistory: [threeDaysAgo, twoDaysAgo, yesterday, now],
        },
        {
          userId: demoUser._id,
          title: 'Overcome fear of public speaking (Practice presentation aloud)',
          description: 'Record 5-minute talk draft and analyze voice tone.',
          tags: ['Confidence', 'Private'],
          status: 'todo',
          isPrivate: true,
          isHabit: false,
          currentStreak: 2,
          bestStreak: 4,
          lastCompletedDate: yesterday,
          completionHistory: [twoDaysAgo, yesterday],
        },
      ]);

      console.log('Demo data seeded successfully (User: demo@vow.app / demopass, PIN: 1234)');
    }
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
}

async function startServer() {
  await connectDB();
  await seedDemoData();

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
