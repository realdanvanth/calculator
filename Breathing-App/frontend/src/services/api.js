const API_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('calmspace_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('calmspace_token', token);
        } else {
            localStorage.removeItem('calmspace_token');
        }
    }

    getToken() {
        return this.token;
    }

    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    async register(email, password, name) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        this.setToken(data.token);
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(data.token);
        return data;
    }

    async getMe() {
        return this.request('/auth/me');
    }

    logout() {
        this.setToken(null);
    }

    // Sessions
    async createSession(sessionData) {
        return this.request('/sessions', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
    }

    async getSessions(page = 1, limit = 20, type = null) {
        let url = `/sessions?page=${page}&limit=${limit}`;
        if (type) url += `&type=${type}`;
        return this.request(url);
    }

    // Stats
    async getStats() {
        return this.request('/stats');
    }

    // Sync
    async getSettings() {
        return this.request('/sync/settings');
    }

    async updateSettings(settings) {
        return this.request('/sync/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    async getFullSync() {
        return this.request('/sync/full');
    }
}

const api = new ApiService();
export default api;
