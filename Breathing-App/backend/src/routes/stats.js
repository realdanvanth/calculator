import express from 'express';
import Session from '../models/Session.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get aggregated stats
router.get('/', async (req, res) => {
    try {
        const user = req.user;

        // Get weekly data (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);

        const weeklyData = await Session.aggregate([
            {
                $match: {
                    userId: user._id,
                    createdAt: { $gte: weekAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    count: { $sum: 1 },
                    totalMinutes: { $sum: { $divide: ['$duration', 60] } }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Get mood trends
        const moodTrends = await Session.aggregate([
            {
                $match: {
                    userId: user._id,
                    moodBefore: { $exists: true, $ne: null },
                    moodAfter: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    avgMoodBefore: { $avg: '$moodBefore' },
                    avgMoodAfter: { $avg: '$moodAfter' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format weekly data for chart
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyChart = days.map((day, index) => {
            const dayData = weeklyData.find(d => d._id === index + 1);
            return {
                day,
                sessions: dayData?.count || 0,
                minutes: Math.round(dayData?.totalMinutes || 0)
            };
        });

        res.json({
            stats: user.stats,
            weeklyChart,
            moodTrends: moodTrends[0] || { avgMoodBefore: 0, avgMoodAfter: 0, count: 0 }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
