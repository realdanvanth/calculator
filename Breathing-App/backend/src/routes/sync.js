import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticate);

// Get settings
router.get('/settings', async (req, res) => {
    res.json({
        settings: req.user.settings,
        stats: req.user.stats
    });
});

// Update settings
router.put('/settings', [
    body('theme').optional().isIn(['light', 'dark']),
    body('breathingSpeed').optional().isIn(['slow', 'slower', 'slowest']),
    body('breathingPattern').optional().isIn(['relaxed', 'box', '478', 'energize']),
    body('motionEnabled').optional().isBoolean(),
    validate
], async (req, res) => {
    try {
        const { theme, breathingSpeed, breathingPattern, motionEnabled } = req.body;
        const user = req.user;

        if (theme !== undefined) user.settings.theme = theme;
        if (breathingSpeed !== undefined) user.settings.breathingSpeed = breathingSpeed;
        if (breathingPattern !== undefined) user.settings.breathingPattern = breathingPattern;
        if (motionEnabled !== undefined) user.settings.motionEnabled = motionEnabled;

        await user.save();

        res.json({
            message: 'Settings updated',
            settings: user.settings
        });
    } catch (error) {
        console.error('Sync settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Full sync - get all user data
router.get('/full', async (req, res) => {
    res.json({
        user: req.user,
        settings: req.user.settings,
        stats: req.user.stats
    });
});

export default router;
