import express from 'express';
import { body, query } from 'express-validator';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create session
router.post('/', [
    body('type').isIn(['breathing', 'meditation', 'focus']).withMessage('Type must be breathing, meditation, or focus'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('pattern').optional().isString(),
    body('moodBefore').optional().isInt({ min: 1, max: 5 }),
    body('moodAfter').optional().isInt({ min: 1, max: 5 }),
    body('notes').optional().isString().isLength({ max: 500 }),
    validate
], async (req, res) => {
    try {
        const { type, duration, pattern, moodBefore, moodAfter, notes } = req.body;

        // Create session
        const session = new Session({
            userId: req.userId,
            type,
            duration,
            pattern,
            moodBefore,
            moodAfter,
            notes
        });
        await session.save();

        // Update user stats
        const user = req.user;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const minutes = Math.round(duration / 60);
        user.stats.totalMinutes += minutes;
        user.stats.sessionsCompleted += 1;

        // Update streak
        if (user.stats.lastSessionDate) {
            const lastDate = new Date(user.stats.lastSessionDate);
            lastDate.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.getTime() === yesterday.getTime()) {
                user.stats.currentStreak += 1;
            } else if (lastDate.getTime() !== today.getTime()) {
                user.stats.currentStreak = 1;
            }
        } else {
            user.stats.currentStreak = 1;
        }

        user.stats.lastSessionDate = new Date();
        await user.save();

        res.status(201).json({
            message: 'Session recorded',
            session,
            stats: user.stats
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get sessions (with pagination)
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('type').optional().isIn(['breathing', 'meditation']),
    validate
], async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = { userId: req.userId };
        if (req.query.type) {
            filter.type = req.query.type;
        }

        const [sessions, total] = await Promise.all([
            Session.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Session.countDocuments(filter)
        ]);

        res.json({
            sessions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
