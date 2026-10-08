import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = 'http://localhost/resume-api/api/recruiter.php';

const RecruiterRegister = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API}/recruiter/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
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
                setError(data.message || 'Registration failed');
            }
        } catch {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Recruiter' },
        { name: 'email', label: 'Work Email', type: 'email', placeholder: 'jane@company.com' },
        { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Acme Corp' },
        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full blur-3xl top-0 right-0"
                    style={{ background: 'rgba(34,197,94,0.12)' }} />
                <div className="absolute w-80 h-80 rounded-full blur-3xl bottom-0 left-0"
                    style={{ background: 'rgba(16,185,129,0.10)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-strong rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg,#059669 0%,#10b981 100%)' }}>
                        <span className="text-3xl">🏢</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2"
                        style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Create Recruiter Account
                    </h1>
                    <p className="text-gray-400">Start hiring the best talent today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {fields.map(f => (
                        <div key={f.name}>
                            <label className="block text-sm font-medium mb-2 text-gray-300">{f.label}</label>
                            <input
                                type={f.type}
                                name={f.name}
                                value={form[f.name]}
                                onChange={handleChange}
                                placeholder={f.placeholder}
                                className="input-field"
                                required
                            />
                        </div>
                    ))}

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
                        className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 mt-2"
                        style={{ background: 'linear-gradient(135deg,#059669 0%,#10b981 100%)', boxShadow: '0 4px 15px rgba(16,185,129,0.35)' }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="loading-spinner w-5 h-5" />
                                Creating Account…
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/recruiter/login" className="font-semibold" style={{ color: '#34d399' }}>
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RecruiterRegister;
