import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Cpu,
  ShieldCheck,
  Zap,
  Target,
  Brain,
  Activity,
  Layers
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigate straight into the 4-step modern workspace flow!
      navigate('/workspace/ingestion');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow nodes */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-8">
        
        {/* Left Column (5 cols): Platform Showcase & 10 LPA Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              Enterprise ATS Gateway &bull; v2.5
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Elevate Your Resume for <span className="gradient-text-neon">10 LPA+</span> Tech Roles.
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Full-stack ATS diagnostics, Google X-Y-Z bullet auto-tailoring, and real-time AI technical interview simulations backed by Node.js & MySQL.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/80 border border-dark-600/70">
              <div className="w-8 h-8 rounded-lg bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">4-Pillar ATS Health Diagnostics</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Eliminates parsing bottlenecks, tables, and passive phrasing before recruiters review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/80 border border-dark-600/70">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Target-JD Semantic Parity Compiler</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Injects missing high-weight keywords and quantifies metrics to project +18 ATS delta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/80 border border-dark-600/70">
              <div className="w-8 h-8 rounded-lg bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal shrink-0 mt-0.5">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Technical Mock Interview Studio</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real-time 1–10 grading with senior developer model answers tailored to your tech stack.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2 border-t border-dark-700">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              MySQL Protected
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-brand-teal" />
              Node.js v20+ Engine
            </span>
          </div>
        </motion.div>

        {/* Right Column (7 cols): High-Tech Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 flex flex-col items-center"
        >
          <div className="w-full max-w-md bg-dark-800/90 border border-dark-600 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Top gradient glow line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green via-brand-teal to-brand-purple"></div>

            {/* Active User Session Notice (if logged in) */}
            {user && (
              <div className="mb-6 p-3.5 rounded-2xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-green block">
                    Signed in as {user.name || user.email}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Active session ready in workspace
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/workspace/ingestion')}
                    className="bg-brand-green hover:bg-emerald-400 text-dark-900 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                  >
                    Enter Workspace
                  </button>
                  <button
                    onClick={logout}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="text-left mb-6">
              <div className="inline-flex items-center space-x-2 mb-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  Resume<span className="text-brand-green">AI</span><span className="text-brand-teal">.Pro</span>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your candidate workspace, ATS audit reports, and mock interviews.
              </p>
            </div>

            {/* Quick 1-Click Demo Fillers */}
            <div className="mb-5 p-3 rounded-xl bg-dark-900 border border-dark-700 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-teal" />
                1-Click Quick Demo Sign-in:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('candidate@careerconnect.com', 'demo123')}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 border border-dark-600 text-xs font-medium text-left transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">Candidate (Fresher)</span>
                  <ArrowRight className="w-3 h-3 text-brand-green opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@careerconnect.com', 'admin123')}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 border border-dark-600 text-xs font-medium text-left transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">Admin / SDE-1</span>
                  <ArrowRight className="w-3 h-3 text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    placeholder="candidate@careerconnect.com"
                    required
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Default demo: <code className="text-brand-green">demo123</code>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                    <span>Verifying Credentials & Synchronizing Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-dark-700/70 text-center flex items-center justify-between text-xs">
              <span className="text-slate-400">
                New candidate?{' '}
                <Link to="/register" className="text-brand-green hover:underline font-semibold">
                  Create account
                </Link>
              </span>
              <button
                onClick={() => navigate('/workspace/ingestion')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Enter as Guest &rarr;
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Login;
