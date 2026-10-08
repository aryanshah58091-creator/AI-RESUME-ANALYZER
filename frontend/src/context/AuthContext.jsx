import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [aiCredits, setAiCredits] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed.ai_credits !== undefined && parsed.ai_credits !== null) {
                    return Number(parsed.ai_credits);
                }
            } catch (e) {}
        }
        const cached = localStorage.getItem('ai_credits');
        return cached ? Number(cached) : 100;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                if (parsed.ai_credits !== undefined && parsed.ai_credits !== null) {
                    setAiCredits(Number(parsed.ai_credits));
                }
            } catch (e) {}
        }

        // Sync with backend if token exists
        if (token) {
            axios.get('/auth/me')
                .then(res => {
                    if (res.data) {
                        setUser(prev => ({ ...prev, ...res.data }));
                        if (res.data.ai_credits !== undefined && res.data.ai_credits !== null) {
                            const val = Number(res.data.ai_credits);
                            setAiCredits(val);
                            localStorage.setItem('ai_credits', String(val));
                        }
                    }
                })
                .catch(err => {
                    console.warn('Silent sync error on auth/me:', err.message);
                });
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/auth/login', { email, password });
        const { token, ...userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        const credits = userData.ai_credits !== undefined && userData.ai_credits !== null ? Number(userData.ai_credits) : 100;
        setAiCredits(credits);
        localStorage.setItem('ai_credits', String(credits));

        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await axios.post('/auth/register', { name, email, password });
        const { token, ...userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        const credits = userData.ai_credits !== undefined && userData.ai_credits !== null ? Number(userData.ai_credits) : 100;
        setAiCredits(credits);
        localStorage.setItem('ai_credits', String(credits));

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('ai_credits');
        setUser(null);
        setAiCredits(100);
    };

    const deductCredits = (amount = 10) => {
        setAiCredits(prev => {
            const next = Math.max(0, prev - amount);
            localStorage.setItem('ai_credits', String(next));
            return next;
        });
    };

    const refillCredits = async (amount = 50) => {
        try {
            const response = await axios.post('/auth/credits/refill', { amount });
            const nextCredits = response.data?.ai_credits !== undefined
                ? Number(response.data.ai_credits)
                : aiCredits + amount;
            setAiCredits(nextCredits);
            localStorage.setItem('ai_credits', String(nextCredits));
            setUser(prev => prev ? { ...prev, ai_credits: nextCredits } : prev);
            return { success: true, ai_credits: nextCredits };
        } catch (error) {
            console.warn('Backend refill error, applying resilient local refill:', error.message);
            const nextCredits = aiCredits + amount;
            setAiCredits(nextCredits);
            localStorage.setItem('ai_credits', String(nextCredits));
            return { success: true, ai_credits: nextCredits };
        }
    };

    const value = {
        user,
        aiCredits,
        setAiCredits,
        deductCredits,
        refillCredits,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
