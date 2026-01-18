import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';
import api from '../services/api';

function History() {
    const { isAuthenticated } = useSensory();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMonth, setViewMonth] = useState(new Date());

    useEffect(() => {
        if (isAuthenticated) {
            loadSessions();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const loadSessions = async () => {
        try {
            const { sessions: data } = await api.getSessions(1, 100);
            setSessions(data);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    // Generate calendar days for current month
    const getCalendarDays = () => {
        const year = viewMonth.getFullYear();
        const month = viewMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();

        const days = [];

        // Add padding for days before month starts
        for (let i = 0; i < startPadding; i++) {
            days.push({ date: null, sessions: [] });
        }

        // Add all days of the month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            const dateStr = date.toDateString();
            const daySessions = sessions.filter(s =>
                new Date(s.createdAt).toDateString() === dateStr
            );
            days.push({ date, sessions: daySessions });
        }

        return days;
    };

    const getIntensity = (sessionCount) => {
        if (sessionCount === 0) return 0;
        if (sessionCount === 1) return 1;
        if (sessionCount <= 3) return 2;
        if (sessionCount <= 5) return 3;
        return 4;
    };

    const formatDuration = (seconds) => {
        const mins = Math.round(seconds / 60);
        return mins === 1 ? '1 min' : `${mins} mins`;
    };

    const navigateMonth = (delta) => {
        setViewMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + delta);
            return newMonth;
        });
        setSelectedDate(null);
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarDays = getCalendarDays();
    const selectedDaySessions = selectedDate
        ? sessions.filter(s => new Date(s.createdAt).toDateString() === selectedDate.toDateString())
        : [];

    if (!isAuthenticated) {
        return (
            <div className="history-container">
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>📅 Session History</h2>
                    <p style={{ color: 'var(--text-tertiary)' }}>
                        Sign in to track your sessions and see your progress calendar.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            {/* Calendar Card */}
            <div className="card calendar-card">
                <div className="calendar-header">
                    <button className="calendar-nav" onClick={() => navigateMonth(-1)}>
                        ←
                    </button>
                    <h3 className="calendar-title">
                        {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                    </h3>
                    <button className="calendar-nav" onClick={() => navigateMonth(1)}>
                        →
                    </button>
                </div>

                <div className="calendar-weekdays">
                    {dayNames.map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                </div>

                <div className="calendar-grid">
                    {calendarDays.map((day, i) => (
                        <button
                            key={i}
                            className={`calendar-day ${!day.date ? 'empty' : ''} ${selectedDate?.toDateString() === day.date?.toDateString() ? 'selected' : ''
                                } intensity-${getIntensity(day.sessions.length)}`}
                            onClick={() => day.date && setSelectedDate(day.date)}
                            disabled={!day.date}
                        >
                            {day.date?.getDate()}
                            {day.sessions.length > 0 && (
                                <span className="session-dot"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="calendar-legend">
                    <span>Less</span>
                    <div className="legend-squares">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className={`legend-square intensity-${i}`}></div>
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDate && (
                <div className="card session-detail-card">
                    <h4 className="detail-date">
                        {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h4>

                    {selectedDaySessions.length === 0 ? (
                        <p className="no-sessions">No sessions on this day</p>
                    ) : (
                        <div className="session-list">
                            {selectedDaySessions.map((session, i) => (
                                <div key={i} className="session-item">
                                    <div className="session-icon">
                                        {session.type === 'breathing' ? '🌬️' : session.type === 'focus' ? '🍅' : '🧘'}
                                    </div>
                                    <div className="session-info">
                                        <span className="session-type">
                                            {session.type === 'breathing' ? 'Breathing' :
                                                session.type === 'focus' ? 'Focus Session' : 'Meditation'}
                                            {session.pattern && ` • ${session.pattern}`}
                                        </span>
                                        <span className="session-time">
                                            {new Date(session.createdAt).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit'
                                            })} • {formatDuration(session.duration)}
                                        </span>
                                    </div>
                                    {(session.moodBefore || session.moodAfter) && (
                                        <div className="session-mood">
                                            {session.moodBefore && <span>Before: {'😔😕😐🙂😊'.charAt(session.moodBefore - 1)}</span>}
                                            {session.moodAfter && <span>After: {'😔😕😐🙂😊'.charAt(session.moodAfter - 1)}</span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Stats Summary */}
            <div className="card stats-summary-card">
                <div className="stats-row">
                    <div className="stat-item">
                        <span className="stat-number">{sessions.length}</span>
                        <span className="stat-label">Total Sessions</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}
                        </span>
                        <span className="stat-label">Minutes</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {new Set(sessions.map(s => new Date(s.createdAt).toDateString())).size}
                        </span>
                        <span className="stat-label">Active Days</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
