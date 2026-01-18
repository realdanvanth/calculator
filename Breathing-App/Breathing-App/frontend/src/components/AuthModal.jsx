import React, { useState } from 'react';
import Button from './Button';

function AuthModal({ onClose, onSuccess }) {
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await onSuccess('login', formData.email, formData.password);
            } else {
                await onSuccess('register', formData.email, formData.password, formData.name);
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}>×</button>

                <h2 className="auth-title">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="auth-subtitle">
                    {mode === 'login'
                        ? 'Sign in to sync your progress'
                        : 'Start your mindfulness journey'}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'register' && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <Button
                        type="submit"
                        variant="primary"
                        className="btn-lg auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </Button>
                </form>

                <p className="auth-switch">
                    {mode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button onClick={() => setMode('register')}>Sign up</button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => setMode('login')}>Sign in</button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default AuthModal;
