import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';
import api from '../services/api';

// Achievement definitions
const ACHIEVEMENTS = [
    { id: 'first_steps', name: 'First Steps', icon: '👣', description: 'Complete your first session', requirement: 'Complete 1 session' },
    { id: 'week_warrior', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak', requirement: '7-day streak' },
    { id: 'zen_master', name: 'Zen Master', icon: '🧘', description: 'Achieve a 30-day streak', requirement: '30-day streak' },
    { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Complete a session before 7 AM', requirement: 'Session before 7 AM' },
    { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Complete a session after 10 PM', requirement: 'Session after 10 PM' },
    { id: 'century', name: 'Century Club', icon: '💯', description: 'Complete 100 sessions', requirement: '100 sessions' },
    { id: 'dedicated', name: 'Dedicated', icon: '⭐', description: 'Complete 50 sessions', requirement: '50 sessions' },
    { id: 'getting_started', name: 'Getting Started', icon: '🚀', description: 'Complete 10 sessions', requirement: '10 sessions' },
    { id: 'hour_power', name: 'Hour Power', icon: '⏱️', description: 'Meditate for 60 minutes in one day', requirement: '60 min in one day' },
    { id: 'half_hour', name: 'Half Hour Hero', icon: '🕐', description: 'Complete a 30-minute session', requirement: '30 min session' },
    { id: 'pattern_explorer', name: 'Pattern Explorer', icon: '🔄', description: 'Try all 4 breathing patterns', requirement: 'Use all patterns' },
    { id: 'focus_champion', name: 'Focus Champion', icon: '🍅', description: 'Complete 5 focus sessions', requirement: '5 focus sessions' },
    { id: 'mindful_monday', name: 'Mindful Monday', icon: '📅', description: 'Complete a session on Monday', requirement: 'Session on Monday' },
    { id: 'weekend_warrior', name: 'Weekend Warrior', icon: '🎯', description: 'Complete sessions on both Saturday and Sunday', requirement: 'Sat & Sun sessions' },
    { id: 'consistency', name: 'Consistency King', icon: '👑', description: 'Complete sessions for 14 days straight', requirement: '14-day streak' },
];

function Achievements() {
    const { isAuthenticated, sessionsCompleted, currentStreak } = useSensory();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unlockedIds, setUnlockedIds] = useState(new Set());

    useEffect(() => {
        if (isAuthenticated) {
            loadSessions();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        checkAchievements();
    }, [sessions, sessionsCompleted, currentStreak]);

    const loadSessions = async () => {
        try {
            const { sessions: data } = await api.getSessions(1, 200);
            setSessions(data);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkAchievements = () => {
        const unlocked = new Set();

        // First Steps
        if (sessionsCompleted >= 1) unlocked.add('first_steps');

        // Getting Started
        if (sessionsCompleted >= 10) unlocked.add('getting_started');

        // Dedicated
        if (sessionsCompleted >= 50) unlocked.add('dedicated');

        // Century
        if (sessionsCompleted >= 100) unlocked.add('century');

        // Week Warrior
        if (currentStreak >= 7) unlocked.add('week_warrior');

        // Consistency King
        if (currentStreak >= 14) unlocked.add('consistency');

        // Zen Master
        if (currentStreak >= 30) unlocked.add('zen_master');

        // Time-based achievements from sessions
        sessions.forEach(session => {
            const hour = new Date(session.createdAt).getHours();
            const day = new Date(session.createdAt).getDay();

            if (hour < 7) unlocked.add('early_bird');
            if (hour >= 22) unlocked.add('night_owl');
            if (day === 1) unlocked.add('mindful_monday');
            if (session.duration >= 1800) unlocked.add('half_hour');
            if (session.type === 'focus') {
                const focusSessions = sessions.filter(s => s.type === 'focus');
                if (focusSessions.length >= 5) unlocked.add('focus_champion');
            }
        });

        // Check weekend warrior
        const saturdays = sessions.some(s => new Date(s.createdAt).getDay() === 6);
        const sundays = sessions.some(s => new Date(s.createdAt).getDay() === 0);
        if (saturdays && sundays) unlocked.add('weekend_warrior');

        // Check patterns used
        const patterns = new Set(sessions.filter(s => s.pattern).map(s => s.pattern));
        if (patterns.size >= 4) unlocked.add('pattern_explorer');

        // Check hour power (60 mins in one day)
        const dayMinutes = {};
        sessions.forEach(s => {
            const date = new Date(s.createdAt).toDateString();
            dayMinutes[date] = (dayMinutes[date] || 0) + s.duration / 60;
        });
        if (Object.values(dayMinutes).some(m => m >= 60)) unlocked.add('hour_power');

        setUnlockedIds(unlocked);
    };

    const unlockedCount = unlockedIds.size;
    const totalCount = ACHIEVEMENTS.length;
    const progressPercent = Math.round((unlockedCount / totalCount) * 100);

    if (!isAuthenticated) {
        return (
            <div className="achievements-container">
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>🏆 Achievements</h2>
                    <p style={{ color: 'var(--text-tertiary)' }}>
                        Sign in to track your achievements and unlock badges.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="achievements-container">
            {/* Progress Card */}
            <div className="card achievement-progress-card">
                <div className="achievement-progress-header">
                    <h3>Your Progress</h3>
                    <span className="achievement-count">{unlockedCount} / {totalCount}</span>
                </div>
                <div className="progress-track" style={{ height: '8px', marginTop: 'var(--space-4)' }}>
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                    {progressPercent}% complete
                </p>
            </div>

            {/* Achievements Grid */}
            <div className="achievements-grid">
                {ACHIEVEMENTS.map(achievement => {
                    const isUnlocked = unlockedIds.has(achievement.id);
                    return (
                        <div
                            key={achievement.id}
                            className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                        >
                            <div className="achievement-icon">
                                {isUnlocked ? achievement.icon : '🔒'}
                            </div>
                            <div className="achievement-info">
                                <h4 className="achievement-name">{achievement.name}</h4>
                                <p className="achievement-desc">{achievement.description}</p>
                                <span className="achievement-req">{achievement.requirement}</span>
                            </div>
                            {isUnlocked && (
                                <div className="achievement-unlocked-badge">✓</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Achievements;
