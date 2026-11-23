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
