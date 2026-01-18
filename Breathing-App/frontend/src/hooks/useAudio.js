import { useState, useRef, useEffect, useCallback } from 'react';

// Ambient sound URLs (royalty-free sources)
export const SOUNDS = {
    rain: {
        name: 'Rain',
        icon: '🌧️',
        // Using a simple oscillator-based rain sound generator
        type: 'generated'
    },
    ocean: {
        name: 'Ocean Waves',
        icon: '🌊',
        type: 'generated'
    },
    forest: {
        name: 'Forest',
        icon: '🌲',
        type: 'generated'
    },
    fire: {
        name: 'Fireplace',
        icon: '🔥',
        type: 'generated'
    },
    wind: {
        name: 'Gentle Wind',
        icon: '💨',
        type: 'generated'
    },
    none: {
        name: 'Silence',
        icon: '🔇',
        type: 'none'
    }
};

// Generate ambient sounds using Web Audio API
class AmbientSoundGenerator {
    constructor() {
        this.audioContext = null;
        this.nodes = [];
        this.gainNode = null;
        this.isPlaying = false;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.3;
        }
        return this.audioContext;
    }

    setVolume(value) {
        if (this.gainNode) {
            this.gainNode.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.1);
        }
    }

    stop() {
        this.nodes.forEach(node => {
            try {
                node.stop?.();
                node.disconnect?.();
            } catch (e) { }
        });
        this.nodes = [];
        this.isPlaying = false;
    }

    generateRain() {
        this.init();
        this.stop();

        // Brown noise for rain
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        noise.connect(filter);
        filter.connect(this.gainNode);
        noise.start();

        this.nodes.push(noise, filter);
        this.isPlaying = true;
    }

    generateOcean() {
        this.init();
        this.stop();

        // Create oscillating volume for wave effect
        const bufferSize = 4 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            const wave = Math.sin(t * 0.5) * 0.5 + 0.5; // Slow wave cycle
            const noise = Math.random() * 2 - 1;
            data[i] = noise * wave * 0.5;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;

        noise.connect(filter);
        filter.connect(this.gainNode);
        noise.start();

        this.nodes.push(noise, filter);
        this.isPlaying = true;
    }

    generateForest() {
        this.init();
        this.stop();

        // Pink noise for forest ambiance
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.15;
            b6 = white * 0.115926;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        noise.connect(filter);
        filter.connect(this.gainNode);
        noise.start();

        this.nodes.push(noise, filter);
        this.isPlaying = true;
    }

    generateFire() {
        this.init();
        this.stop();

        // Crackling fire - combination of filtered noise
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Base rumble + occasional crackles
            const base = (Math.random() * 2 - 1) * 0.3;
            const crackle = Math.random() > 0.998 ? (Math.random() * 2 - 1) * 0.8 : 0;
            data[i] = base + crackle;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const lowFilter = this.audioContext.createBiquadFilter();
        lowFilter.type = 'lowpass';
        lowFilter.frequency.value = 200;

        noise.connect(lowFilter);
        lowFilter.connect(this.gainNode);
        noise.start();

        this.nodes.push(noise, lowFilter);
        this.isPlaying = true;
    }

    generateWind() {
        this.init();
        this.stop();

        // Soft wind - heavily filtered noise
        const bufferSize = 4 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            const modulation = Math.sin(t * 0.3) * 0.3 + 0.7;
            data[i] = (Math.random() * 2 - 1) * modulation * 0.4;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 0.3;

        noise.connect(filter);
        filter.connect(this.gainNode);
        noise.start();

        this.nodes.push(noise, filter);
        this.isPlaying = true;
    }

    play(soundType) {
        switch (soundType) {
            case 'rain': this.generateRain(); break;
            case 'ocean': this.generateOcean(); break;
            case 'forest': this.generateForest(); break;
            case 'fire': this.generateFire(); break;
            case 'wind': this.generateWind(); break;
            default: this.stop();
        }
    }
}

// Singleton instance
let soundGenerator = null;

export function useAudio() {
    const [currentSound, setCurrentSound] = useState('none');
    const [volume, setVolume] = useState(0.3);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!soundGenerator) {
            soundGenerator = new AmbientSoundGenerator();
        }
    }, []);

    const playSound = useCallback((soundType) => {
        if (!soundGenerator) {
            soundGenerator = new AmbientSoundGenerator();
        }

        if (soundType === 'none' || soundType === currentSound) {
            soundGenerator.stop();
            setCurrentSound('none');
            setIsPlaying(false);
        } else {
            soundGenerator.play(soundType);
            soundGenerator.setVolume(volume);
            setCurrentSound(soundType);
            setIsPlaying(true);
        }
    }, [currentSound, volume]);

    const updateVolume = useCallback((newVolume) => {
        setVolume(newVolume);
        if (soundGenerator) {
            soundGenerator.setVolume(newVolume);
        }
    }, []);

    const stopSound = useCallback(() => {
        if (soundGenerator) {
            soundGenerator.stop();
        }
        setCurrentSound('none');
        setIsPlaying(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (soundGenerator) {
                soundGenerator.stop();
            }
        };
    }, []);

    return {
        currentSound,
        volume,
        isPlaying,
        playSound,
        updateVolume,
        stopSound,
        sounds: SOUNDS
    };
}
