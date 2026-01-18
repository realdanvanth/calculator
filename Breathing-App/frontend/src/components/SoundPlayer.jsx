import React from 'react';
import { useAudio, SOUNDS } from '../hooks/useAudio';

function SoundPlayer({ compact = false }) {
    const { currentSound, volume, playSound, updateVolume } = useAudio();

    if (compact) {
        return (
            <div className="sound-player-compact">
                <div className="sound-pills">
                    {Object.entries(SOUNDS).map(([key, sound]) => (
                        <button
                            key={key}
                            className={`sound-pill ${currentSound === key ? 'active' : ''}`}
                            onClick={() => playSound(key)}
                            title={sound.name}
                        >
                            {sound.icon}
                        </button>
                    ))}
                </div>
                {currentSound !== 'none' && (
                    <div className="volume-slider-compact">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => updateVolume(parseFloat(e.target.value))}
                            className="volume-range"
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="sound-player">
            <div className="sound-player-header">
                <span className="sound-player-label">Ambient Sounds</span>
                {currentSound !== 'none' && (
                    <span className="sound-playing">
                        {SOUNDS[currentSound]?.icon} Playing
                    </span>
                )}
            </div>

            <div className="sound-grid">
                {Object.entries(SOUNDS).filter(([key]) => key !== 'none').map(([key, sound]) => (
                    <button
                        key={key}
                        className={`sound-card ${currentSound === key ? 'active' : ''}`}
                        onClick={() => playSound(key)}
                    >
                        <span className="sound-icon">{sound.icon}</span>
                        <span className="sound-name">{sound.name}</span>
                    </button>
                ))}
            </div>

            <div className="volume-control">
                <span className="volume-label">🔊</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => updateVolume(parseFloat(e.target.value))}
                    className="volume-range"
                />
                <span className="volume-value">{Math.round(volume * 100)}%</span>
            </div>

            {currentSound !== 'none' && (
                <button className="sound-stop" onClick={() => playSound('none')}>
                    Stop Sound
                </button>
            )}
        </div>
    );
}

export default SoundPlayer;
