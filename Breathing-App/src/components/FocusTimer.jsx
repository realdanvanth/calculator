import React, { useState, useEffect, useCallback } from 'react';
import { useSensory } from '../context/SensoryContext';
import Button from './Button';
import SoundPlayer from './SoundPlayer';

const MODES = {
    work: { name: 'Focus', duration: 25 * 60, color: 'var(--accent)' },
    shortBreak: { name: 'Short Break', duration: 5 * 60, color: '#22C55E' },
    longBreak: { name: 'Long Break', duration: 15 * 60, color: '#8B5CF6' }
};

function FocusTimer() {
    const { completeSession, isAuthenticated } = useSensory();
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [totalFocusTime, setTotalFocusTime] = useState(0);

    const currentMode = MODES[mode];

    // Timer countdown
    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => t - 1);
                if (mode === 'work') {
                    setTotalFocusTime(t => t + 1);
                }
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    // Keyboard shortcut
    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                setIsRunning(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const handleTimerComplete = useCallback(() => {
        setIsRunning(false);

        // Play notification sound
        try {
            const audio = new AudioContext();
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.frequency.value = 440;
            gain.gain.value = 0.3;
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.5);
            oscillator.stop(audio.currentTime + 0.5);
        } catch (e) { }

        if (mode === 'work') {
            const newCount = completedPomodoros + 1;
            setCompletedPomodoros(newCount);

            // Log session if authenticated
            if (isAuthenticated) {
                completeSession(25, 'focus', 'pomodoro');
            }

            // Switch to break
            if (newCount % 4 === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('work');
        }
    }, [mode, completedPomodoros, isAuthenticated]);

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(MODES[newMode].duration);
        setIsRunning(false);
    };

    const resetTimer = () => {
        setTimeLeft(MODES[mode].duration);
        setIsRunning(false);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="focus-container">
            {/* Mode Selector */}
            <div className="focus-modes">
                {Object.entries(MODES).map(([key, m]) => (
                    <button
                        key={key}
                        className={`focus-mode-btn ${mode === key ? 'active' : ''}`}
                        onClick={() => switchMode(key)}
                        style={{ '--mode-color': m.color }}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            {/* Timer Circle */}
            <div className="focus-timer-wrapper">
                <svg className="focus-timer-svg" viewBox="0 0 260 260">
                    <circle
                        className="focus-timer-bg"
                        cx="130"
                        cy="130"
                        r="120"
                        fill="none"
                        strokeWidth="8"
                    />
                    <circle
                        className="focus-timer-progress"
                        cx="130"
                        cy="130"
                        r="120"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        style={{
                            stroke: currentMode.color,
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%'
                        }}
                    />
                </svg>
                <div className="focus-timer-display">
                    <span className="focus-time">{formatTime(timeLeft)}</span>
                    <span className="focus-mode-label">{currentMode.name}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="focus-controls">
                <Button
                    variant={isRunning ? 'secondary' : 'primary'}
                    onClick={() => setIsRunning(!isRunning)}
                    className="btn-lg"
                >
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button variant="ghost" onClick={resetTimer}>
                    Reset
                </Button>
            </div>

            {/* Stats */}
            <div className="focus-stats">
                <div className="focus-stat">
                    <span className="focus-stat-value">{completedPomodoros}</span>
                    <span className="focus-stat-label">Pomodoros</span>
                </div>
                <div className="focus-stat">
                    <span className="focus-stat-value">{Math.floor(totalFocusTime / 60)}</span>
                    <span className="focus-stat-label">Minutes Focused</span>
                </div>
            </div>

            {/* Sound Player */}
            <div style={{ marginTop: 'var(--space-6)' }}>
                <SoundPlayer compact />
            </div>

            {/* Tips */}
            <div className="focus-tips">
                <h4>🍅 The Pomodoro Technique</h4>
                <ol>
                    <li>Work for 25 minutes with full focus</li>
                    <li>Take a 5-minute break</li>
                    <li>After 4 pomodoros, take a 15-minute break</li>
                </ol>
            </div>

            <p className="focus-shortcut">
                Press <kbd>Space</kbd> to start/pause
            </p>
        </div>
    );
}

export default FocusTimer;
