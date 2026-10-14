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
import taskMapRoutes from './routes/taskMapRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import feedRoutes from './routes/feedRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;