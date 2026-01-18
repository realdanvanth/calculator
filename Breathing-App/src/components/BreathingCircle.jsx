import React, { useState, useEffect, useCallback } from 'react';
import { useSensory } from '../context/SensoryContext';
import Button from './Button';
import SoundPlayer from './SoundPlayer';

// Breathing patterns
const PATTERNS = {
    relaxed: { name: 'Relaxed', inhale: 4000, hold: 2000, exhale: 4000, holdOut: 0 },
    box: { name: 'Box Breathing', inhale: 4000, hold: 4000, exhale: 4000, holdOut: 4000 },
    '478': { name: '4-7-8 Sleep', inhale: 4000, hold: 7000, exhale: 8000, holdOut: 0 },
    energize: { name: 'Energize', inhale: 2000, hold: 1000, exhale: 2000, holdOut: 0 },
};

const SPEED_MULTIPLIERS = {
    slow: 1,
    slower: 1.25,
    slowest: 1.5
};

function BreathingCircle() {
    const { breathingSpeed, setBreathingSpeed, breathingPattern, setBreathingPattern, motionEnabled, completeSession } = useSensory();
    const [phase, setPhase] = useState('idle');
    const [prompt, setPrompt] = useState('Ready when you are');
    const [scale, setScale] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);

    const pattern = PATTERNS[breathingPattern] || PATTERNS.relaxed;
    const multiplier = SPEED_MULTIPLIERS[breathingSpeed] || 1;

    // Session timer
    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => setSessionTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    // Keyboard shortcut
    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                setIsActive(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    useEffect(() => {
        if (!isActive) {
            setPhase('idle');
            setPrompt('Ready when you are');
            setScale(1);
            return;
        }

        let timeout;
        const runCycle = () => {
            // Inhale
            setPhase('inhale');
            setPrompt('Breathe in');
            setScale(1.4);

            timeout = setTimeout(() => {
                // Hold after inhale
                if (pattern.hold > 0) {
                    setPhase('hold');
                    setPrompt('Hold');

                    timeout = setTimeout(() => {
                        exhalePhase();
                    }, pattern.hold * multiplier);
                } else {
                    exhalePhase();
                }
            }, pattern.inhale * multiplier);
        };

        const exhalePhase = () => {
            setPhase('exhale');
            setPrompt('Breathe out');
            setScale(1);

            timeout = setTimeout(() => {
                // Hold after exhale (for box breathing)
                if (pattern.holdOut > 0) {
                    setPhase('holdOut');
                    setPrompt('Hold');

                    timeout = setTimeout(runCycle, pattern.holdOut * multiplier);
                } else {
                    runCycle();
                }
            }, pattern.exhale * multiplier);
        };

        runCycle();
        return () => clearTimeout(timeout);
    }, [isActive, breathingPattern, breathingSpeed]);

    const handleStop = () => {
        setIsActive(false);
        if (sessionTime > 30) {
            completeSession(Math.round(sessionTime / 60));
        }
        setSessionTime(0);
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="breathing-container">
            {isActive && (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: '-1rem' }}>
                    {formatTime(sessionTime)}
                </div>
            )}

            <div className="breathing-prompt" aria-live="polite">{prompt}</div>

            <div className="circle-wrapper">
                <div
                    className="circle-glow"
                    style={{
                        transform: `scale(${scale})`,
                        opacity: phase === 'inhale' || phase === 'hold' ? 0.25 : 0.1
                    }}
                />
                <div
                    className="circle-main"
                    style={{
                        transform: `scale(${scale})`,
                        transition: motionEnabled
                            ? `transform ${phase === 'inhale' ? pattern.inhale * multiplier : phase === 'exhale' ? pattern.exhale * multiplier : 0}ms ease-in-out`
                            : 'none'
                    }}
                    role="img"
                    aria-label={`Breathing circle: ${phase}`}
                />
            </div>

            <div className="breathing-controls">
                {!isActive ? (
                    <Button variant="primary" onClick={() => setIsActive(true)} className="btn-lg">
                        Start
                    </Button>
                ) : (
                    <Button variant="secondary" onClick={handleStop} className="btn-lg">
                        Stop
                    </Button>
                )}
            </div>

            {/* Pattern Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Pattern
                </span>
                <div className="speed-selector">
                    {Object.entries(PATTERNS).map(([key, p]) => (
                        <button
                            key={key}
                            className={`speed-btn ${breathingPattern === key ? 'active' : ''}`}
                            onClick={() => setBreathingPattern(key)}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Speed Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Speed
                </span>
                <div className="speed-selector">
                    {Object.keys(SPEED_MULTIPLIERS).map(speed => (
                        <button
                            key={speed}
                            className={`speed-btn ${breathingSpeed === speed ? 'active' : ''}`}
                            onClick={() => setBreathingSpeed(speed)}
                        >
                            {speed.charAt(0).toUpperCase() + speed.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ambient Sounds */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ambient Sound
                </span>
                <SoundPlayer compact />
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-4)' }}>
                Press <kbd style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem' }}>Space</kbd> to start/stop
            </p>
        </div>
    );
}

export default BreathingCircle;
