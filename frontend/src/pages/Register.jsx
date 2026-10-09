import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Zap
} from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/workspace/ats-diagnostics', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      // Seamlessly transition into the modern workspace flow!
      navigate('/workspace/ingestion');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow nodes */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-dark-800/90 border border-dark-600 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden z-10 my-8"
      >
        {/* Top gradient glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green via-brand-teal to-brand-purple"></div>

        {/* Header */}
        <div className="text-left mb-6">
          <div className="inline-flex items-center space-x-2 mb-2">
            <span className="font-bold text-xl tracking-tight text-white">
              Resume<span className="text-brand-green">AI</span><span className="text-brand-teal">.Pro</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Candidate Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access enterprise ATS diagnostic tools, JD tailoring, and AI mock interviews.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
                className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.johnson@example.com"
                required
                className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                Confirm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-emerald-600 text-dark-900 font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-neon-green flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Profile & Synchronizing Database...</span>
              </>
            ) : (
              <>
                <span>Create Account & Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-4 border-t border-dark-700/70 text-center flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-brand-green hover:underline font-semibold">
              Sign in
            </Link>
          </span>
          <button
            onClick={() => navigate('/workspace/ingestion')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Enter as Guest &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
