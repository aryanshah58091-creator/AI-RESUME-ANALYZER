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
    const [sandboxClaimed, setSandboxClaimed] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed.sandbox_claimed !== undefined) {
                    return Boolean(parsed.sandbox_claimed);
                }
            } catch (e) {}
        }
        return localStorage.getItem('sandbox_claimed') === 'true';
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
                if (parsed.sandbox_claimed !== undefined) {
                    setSandboxClaimed(Boolean(parsed.sandbox_claimed));
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
                        if (res.data.sandbox_claimed !== undefined) {
                            const claimed = Boolean(res.data.sandbox_claimed);
                            setSandboxClaimed(claimed);
                            localStorage.setItem('sandbox_claimed', String(claimed));
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

        const claimed = Boolean(userData.sandbox_claimed);
        setSandboxClaimed(claimed);
        localStorage.setItem('sandbox_claimed', String(claimed));

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

        setSandboxClaimed(false);
        localStorage.setItem('sandbox_claimed', 'false');

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('ai_credits');
        localStorage.removeItem('sandbox_claimed');
        setUser(null);
        setAiCredits(100);
        setSandboxClaimed(false);
    };

    const deductCredits = (amount = 10) => {
        setAiCredits(prev => {
            const next = Math.max(0, prev - amount);
            localStorage.setItem('ai_credits', String(next));
            return next;
        });
    };

    const refillCredits = async (amount = 50, options = {}) => {
        try {
            const payload = {
                amount,
                is_sandbox: options.is_sandbox === true,
                is_purchase: options.is_purchase === true,
            };
            const response = await axios.post('/auth/credits/refill', payload);
            const nextCredits = response.data?.ai_credits !== undefined
                ? Number(response.data.ai_credits)
                : aiCredits + amount;
            setAiCredits(nextCredits);
            localStorage.setItem('ai_credits', String(nextCredits));

            if (response.data?.sandbox_claimed !== undefined) {
                const claimed = Boolean(response.data.sandbox_claimed);
                setSandboxClaimed(claimed);
                localStorage.setItem('sandbox_claimed', String(claimed));
            } else if (options.is_sandbox) {
                setSandboxClaimed(true);
                localStorage.setItem('sandbox_claimed', 'true');
            }

            setUser(prev => prev ? {
                ...prev,
                ai_credits: nextCredits,
                sandbox_claimed: response.data?.sandbox_claimed !== undefined ? Boolean(response.data.sandbox_claimed) : prev.sandbox_claimed
            } : prev);

            return {
                success: true,
                ai_credits: nextCredits,
                message: response.data?.message || 'Credits successfully added!'
            };
        } catch (error) {
            if (error.response?.data?.alreadyClaimed || error.response?.status === 403) {
                setSandboxClaimed(true);
                localStorage.setItem('sandbox_claimed', 'true');
                return {
                    success: false,
                    alreadyClaimed: true,
                    message: error.response?.data?.message || 'Free Sandbox Refill (+50) has already been claimed for this account.',
                    ai_credits: aiCredits,
                };
            }
            console.warn('Backend refill error:', error.message);
            // Simulated purchase fallback if server is unreachable
            if (options.is_purchase) {
                const nextCredits = aiCredits + amount;
                setAiCredits(nextCredits);
                localStorage.setItem('ai_credits', String(nextCredits));
                return { success: true, ai_credits: nextCredits, message: `🎉 Payment Confirmed: Added ${amount} Credits!` };
            }
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to refill credits.'
            };
        }
    };

    const value = {
        user,
        aiCredits,
        setAiCredits,
        sandboxClaimed,
        setSandboxClaimed,
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
