import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';
import Button from './Button';
import SoundPlayer from './SoundPlayer';

const SCRIPT = [
    { text: "Find a comfortable position.", duration: 4000 },
    { text: "Close your eyes if you'd like.", duration: 4000 },
    { text: "Let your shoulders relax.", duration: 4000 },
    { text: "Notice how your body feels.", duration: 5000 },
    { text: "Take a deep breath in...", duration: 4000 },
    { text: "And slowly let it out.", duration: 4000 },
    { text: "Feel the calm spreading through you.", duration: 5000 },
    { text: "You are safe. You are at peace.", duration: 5000 },
    { text: "Well done.", duration: 3000 },
];

function Meditation() {
    const { completeSession } = useSensory();
    const [state, setState] = useState('idle');
    const [step, setStep] = useState(0);

    const progress = Math.round(((step + 1) / SCRIPT.length) * 100);

    useEffect(() => {
        if (state !== 'playing') return;

        const timer = setTimeout(() => {
            if (step < SCRIPT.length - 1) {
                setStep(s => s + 1);
            } else {
                setState('complete');
                completeSession(1);
            }
        }, SCRIPT[step].duration);

        return () => clearTimeout(timer);
    }, [state, step]);

    // Keyboard shortcut
    useEffect(() => {
        const handleKey = (e) => {
            if (e.code === 'Escape' && state === 'playing') {
                setState('idle');
                setStep(0);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [state]);

    const start = () => {
        setStep(0);
        setState('playing');
    };

    const reset = () => {
        setState('idle');
        setStep(0);
    };

    if (state === 'idle') {
        return (
            <div className="meditation-container">
                <div className="card meditation-card">
                    <h2 className="meditation-title">Guided Calm</h2>
                    <p className="meditation-subtitle">A short session to reset your mind. About 1 minute.</p>

                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <SoundPlayer compact />
                    </div>

                    <Button variant="primary" onClick={start} className="btn-lg">
                        Begin
                    </Button>
                </div>
            </div>
        );
    }

    if (state === 'complete') {
        return (
            <div className="meditation-container">
                <div className="card meditation-card">
                    <h2 className="meditation-title">Session Complete</h2>
                    <p className="meditation-subtitle">You took a moment for yourself. That matters.</p>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', marginBottom: 'var(--space-4)' }}>
                        +1 minute added to your stats
                    </div>
                    <Button variant="secondary" onClick={reset}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="meditation-container">
            <div className="card meditation-card">
                <div className="progress-track" style={{ marginBottom: '2rem' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <p className="meditation-text" aria-live="polite">
                    {SCRIPT[step].text}
                </p>

                <div style={{ marginTop: '2rem' }}>
                    <Button variant="ghost" onClick={() => { setState('idle'); setStep(0); }}>
                        End Session
                    </Button>
                </div>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-4)' }}>
                    Press <kbd style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem' }}>Esc</kbd> to exit
                </p>
            </div>
        </div>
    );
}

export default Meditation;
