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
