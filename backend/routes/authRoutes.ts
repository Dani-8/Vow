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

// Signup
router.post('/signup', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name || email.split('@')[0],
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        hasPinSet: !!user.pinHash,
      },
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        hasPinSet: !!user.pinHash,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in' });
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
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        hasPinSet: !!user.pinHash,
      },
    });
  } catch (err: any) {
    console.error('Demo bypass error:', err);
    return res.status(500).json({ error: 'Demo bypass failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        hasPinSet: !!user.pinHash,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Set or Update Personal Growth Section PIN
router.post('/set-pin', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { pin } = req.body;

    if (!pin || typeof pin !== 'string' || pin.length < 4) {
      return res.status(400).json({ error: 'PIN must be at least 4 digits' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pinHash = await bcrypt.hash(pin, 10);
    user.pinHash = pinHash;
    await user.save();

    return res.json({ message: 'Personal Growth Section PIN successfully set!', hasPinSet: true });
  } catch (err: any) {
    console.error('Set PIN error:', err);
    return res.status(500).json({ error: 'Failed to set PIN' });
  }
});

// Verify Personal Growth Section PIN
router.post('/verify-pin', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { pin } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.pinHash) {
      return res.status(400).json({ error: 'No PIN has been configured yet' });
    }

    const isMatch = await bcrypt.compare(pin, user.pinHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect PIN' });
    }

    return res.json({ success: true, message: 'Private area unlocked' });
  } catch (err: any) {
    console.error('Verify PIN error:', err);
    return res.status(500).json({ error: 'Failed to verify PIN' });
  }
});

export default router;
