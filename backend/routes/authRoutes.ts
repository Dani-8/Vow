import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
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
