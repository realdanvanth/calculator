import React from 'react';
import { useSensory } from '../context/SensoryContext';
import Button from './Button';

function Dashboard({ onNavigate }) {
    const { totalMinutes, sessionsCompleted, currentStreak } = useSensory();

    const weeklyData = [3, 5, 4, 7, 2, 6, Math.min(sessionsCompleted, 10)];
    const maxVal = Math.max(...weeklyData, 1);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Daily quotes
    const quotes = [
        "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.",
        "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
        "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
        "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    ];
    const todayQuote = quotes[new Date().getDay() % quotes.length];

    return (
        <div className="card-grid">
            {/* Hero Card */}
            <div className="card" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Welcome back
                    </h2>
                    <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px' }}>
                        "{todayQuote}"
                    </p>
                </div>
                <Button variant="primary" onClick={() => onNavigate('breathing')} className="btn-lg">
                    Start Session
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="card">
                <span className="stat-label">Total Minutes</span>
                <div className="stat-value">{totalMinutes}</div>
                <div className="progress-track" style={{ marginTop: '1rem' }}>
                    <div className="progress-fill" style={{ width: `${Math.min((totalMinutes / 200) * 100, 100)}%` }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                    {Math.round((totalMinutes / 200) * 100)}% of 200 min goal
                </p>
            </div>

            <div className="card">
                <span className="stat-label">Current Streak</span>
                <div className="stat-value">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                    {sessionsCompleted} total sessions
                </p>
            </div>

            {/* Activity Chart */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
                <span className="stat-label" style={{ marginBottom: '1.5rem', display: 'block' }}>This Week</span>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px' }}>
                    {weeklyData.map((val, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                            <div style={{
                                width: '24px',
                                height: `${(val / maxVal) * 100}px`,
                                background: 'var(--accent)',
                                borderRadius: '4px',
                                opacity: i === weeklyData.length - 1 ? 1 : 0.6
                            }}></div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{days[i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <span className="stat-label" style={{ marginBottom: '1rem', display: 'block' }}>Quick Start</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Button variant="secondary" onClick={() => onNavigate('breathing')} style={{ width: '100%', justifyContent: 'flex-start' }}>
                        Box Breathing (4-4-4-4)
                    </Button>
                    <Button variant="secondary" onClick={() => onNavigate('meditation')} style={{ width: '100%', justifyContent: 'flex-start' }}>
                        1-min Calm Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
