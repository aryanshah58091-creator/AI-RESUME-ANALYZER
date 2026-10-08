import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = 'http://localhost/resume-api/api/recruiter.php';

const RecruiterLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API}/recruiter/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('recruiterToken', data.token);
                localStorage.setItem('recruiter', JSON.stringify({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    company: data.company,
                    role: 'recruiter',
                }));
                navigate('/recruiter/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full blur-3xl -top-48 -right-48 animate-pulse-slow"
                    style={{ background: 'rgba(34,197,94,0.15)' }} />
                <div className="absolute w-96 h-96 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse-slow"
                    style={{ background: 'rgba(16,185,129,0.12)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-strong rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10"
            >
                {/* Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg,#059669 0%,#10b981 100%)' }}>
                        <span className="text-3xl">🏢</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2"
                        style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Recruiter Portal
                    </h1>
                    <p className="text-gray-400">Sign in to manage your job listings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="recruiter@company.com"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg,#059669 0%,#10b981 100%)', boxShadow: '0 4px 15px rgba(16,185,129,0.35)' }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="loading-spinner w-5 h-5" />
                                Signing in…
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 space-y-2 text-center text-sm text-gray-400">
                    <p>
                        No account yet?{' '}
                        <Link to="/recruiter/register" className="font-semibold" style={{ color: '#34d399' }}>
                            Register as Recruiter
                        </Link>
                    </p>
                    <p>
                        Job seeker?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                            User Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RecruiterLogin;
