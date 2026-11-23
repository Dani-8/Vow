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
