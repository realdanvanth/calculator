import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SensoryContext = createContext();

// Local storage keys
const STORAGE_KEY = 'calmspace_settings';

// Load from localStorage
const loadSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

// Save to localStorage
const saveSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // Ignore storage errors
    }
};

export function SensoryProvider({ children }) {
    const saved = loadSettings();

    // Auth state
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Settings state with persistence
    const [theme, setTheme] = useState(saved?.theme || 'light');
    const [motionEnabled, setMotionEnabled] = useState(saved?.motionEnabled ?? true);
    const [breathingSpeed, setBreathingSpeed] = useState(saved?.breathingSpeed || 'slow');
    const [breathingPattern, setBreathingPattern] = useState(saved?.breathingPattern || 'relaxed');

    // Stats tracking
    const [totalMinutes, setTotalMinutes] = useState(saved?.totalMinutes || 0);
    const [sessionsCompleted, setSessionsCompleted] = useState(saved?.sessionsCompleted || 0);
    const [currentStreak, setCurrentStreak] = useState(saved?.currentStreak || 0);
    const [lastSessionDate, setLastSessionDate] = useState(saved?.lastSessionDate || null);

    // Check for existing auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (api.getToken()) {
                try {
                    const { user: userData } = await api.getMe();
                    setUser(userData);
                    // Sync settings from server
                    if (userData.settings) {
                        setTheme(userData.settings.theme || 'light');
                        setBreathingSpeed(userData.settings.breathingSpeed || 'slow');
                        setBreathingPattern(userData.settings.breathingPattern || 'relaxed');
                        setMotionEnabled(userData.settings.motionEnabled ?? true);
                    }
                    if (userData.stats) {
                        setTotalMinutes(userData.stats.totalMinutes || 0);
                        setSessionsCompleted(userData.stats.sessionsCompleted || 0);
                        setCurrentStreak(userData.stats.currentStreak || 0);
                        setLastSessionDate(userData.stats.lastSessionDate || null);
                    }
                } catch (err) {
                    console.log('Auth check failed:', err);
                    api.logout();
                }
            }
            setAuthLoading(false);
        };
        checkAuth();
    }, []);

    // Persist settings locally
    useEffect(() => {
        saveSettings({
            theme,
            motionEnabled,
            breathingSpeed,
            breathingPattern,
            totalMinutes,
            sessionsCompleted,
            currentStreak,
            lastSessionDate
        });
    }, [theme, motionEnabled, breathingSpeed, breathingPattern, totalMinutes, sessionsCompleted, currentStreak, lastSessionDate]);

    // Apply theme to body
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Sync settings to server when changed (if logged in)
    const syncSettingsToServer = async (newSettings) => {
        if (user) {
            try {
                await api.updateSettings(newSettings);
            } catch (err) {
                console.error('Failed to sync settings:', err);
            }
        }
    };

    // Auth methods
    const login = async (email, password) => {
        const { user: userData } = await api.login(email, password);
        setUser(userData);
        // Sync from server
        if (userData.settings) {
            setTheme(userData.settings.theme || 'light');
            setBreathingSpeed(userData.settings.breathingSpeed || 'slow');
            setBreathingPattern(userData.settings.breathingPattern || 'relaxed');
            setMotionEnabled(userData.settings.motionEnabled ?? true);
        }
        if (userData.stats) {
            setTotalMinutes(userData.stats.totalMinutes || 0);
            setSessionsCompleted(userData.stats.sessionsCompleted || 0);
            setCurrentStreak(userData.stats.currentStreak || 0);
        }
        return userData;
    };

    const register = async (email, password, name) => {
        const { user: userData } = await api.register(email, password, name);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        api.logout();
        setUser(null);
    };

    // Track session completion
    const completeSession = async (minutes = 1, type = 'breathing', pattern = null, moodBefore = null, moodAfter = null) => {
        const today = new Date().toDateString();

        // Update local state
        setTotalMinutes(prev => prev + minutes);
        setSessionsCompleted(prev => prev + 1);

        // Update streak
        if (lastSessionDate) {
            const lastDate = new Date(lastSessionDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.toDateString() === yesterday.toDateString() || lastDate.toDateString() === today) {
                if (lastDate.toDateString() !== today) {
                    setCurrentStreak(prev => prev + 1);
                }
            } else {
                setCurrentStreak(1);
            }
        } else {
            setCurrentStreak(1);
        }

        setLastSessionDate(today);

        // Sync to server if logged in
        if (user) {
            try {
                const sessionData = {
                    type,
                    duration: minutes * 60,
                    pattern,
                    moodBefore,
                    moodAfter
                };
                const { stats } = await api.createSession(sessionData);
                // Update with server stats
                if (stats) {
                    setTotalMinutes(stats.totalMinutes);
                    setSessionsCompleted(stats.sessionsCompleted);
                    setCurrentStreak(stats.currentStreak);
                }
            } catch (err) {
                console.error('Failed to sync session:', err);
            }
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        syncSettingsToServer({ theme: newTheme });
    };

    const updateBreathingSpeed = (speed) => {
        setBreathingSpeed(speed);
        syncSettingsToServer({ breathingSpeed: speed });
    };

    const updateBreathingPattern = (pattern) => {
        setBreathingPattern(pattern);
        syncSettingsToServer({ breathingPattern: pattern });
    };

    const value = {
        // Auth
        user,
        authLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        // Settings
        theme,
        setTheme,
        toggleTheme,
        motionEnabled,
        setMotionEnabled,
        breathingSpeed,
        setBreathingSpeed: updateBreathingSpeed,
        breathingPattern,
        setBreathingPattern: updateBreathingPattern,
        // Stats
        totalMinutes,
        sessionsCompleted,
        currentStreak,
        completeSession
    };

    return (
        <SensoryContext.Provider value={value}>
            {children}
        </SensoryContext.Provider>
    );
}

export function useSensory() {
    const context = useContext(SensoryContext);
    if (!context) {
        throw new Error('useSensory must be used within a SensoryProvider');
    }
    return context;
}
