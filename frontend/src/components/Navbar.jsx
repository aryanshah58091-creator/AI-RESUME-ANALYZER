import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

/* ── Status config helper ─────────────────────────────────────── */
const STATUS_CFG = {
    accepted: {
        label: 'Accepted',
        icon: '✅',
        pill: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)' },
        dot: '#34d399',
    },
    rejected: {
        label: 'Rejected',
        icon: '❌',
        pill: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)' },
        dot: '#f87171',
    },
    pending: {
        label: 'Pending',
        icon: '⏳',
        pill: { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.35)' },
        dot: '#fbbf24',
    },
};

/* ── Status Pill ──────────────────────────────────────────────── */
const StatusPill = ({ status }) => {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
    return (
        <span style={{
            ...cfg.pill,
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
        }}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

/* ── Navbar ───────────────────────────────────────────────────── */
const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /* Application‑status notification state */
    const [applications, setApplications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    /* Fetch user's applications whenever auth state changes */
    useEffect(() => {
        if (!isAuthenticated) { setApplications([]); return; }
        axios.get('/jobs/my-applications')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setApplications(res.data);
                } else if (res.data && Array.isArray(res.data.data)) {
                    setApplications(res.data.data);
                } else {
                    setApplications([]);
                }
            })
            .catch(() => setApplications([]));
    }, [isAuthenticated]);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); setIsMobileMenuOpen(false); };
    const isActive = (path) => location.pathname === path;

    /* Notification counts */
    const acceptedCount = applications.filter(a => a.status === 'accepted').length;
    const rejectedCount = applications.filter(a => a.status === 'rejected').length;
    const hasNew = acceptedCount + rejectedCount > 0;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];
    const authenticatedLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/jobs', label: 'Job Matching' },
    ];
    const adminLinks = [{ path: '/admin', label: 'Admin Panel' }];

    /* ── Notification Bell ──────────────────────────────────────── */
    const NotifBell = () => (
        <div ref={notifRef} style={{ position: 'relative' }}>
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowNotif(p => !p)}
                style={{
                    position: 'relative',
                    background: showNotif ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    fontWeight: 600,
                }}
            >
                <span style={{ fontSize: '18px' }}>🔔</span>
                <span style={{ fontSize: '13px' }}>Applications</span>
                {/* Badge */}
                {hasNew && (
                    <span style={{
                        position: 'absolute',
                        top: '-6px', right: '-6px',
                        background: acceptedCount > 0 ? '#10b981' : '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px', height: '18px',
                        fontSize: '10px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #1a1a2e',
                    }}>
                        {acceptedCount + rejectedCount}
                    </span>
                )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            right: 0,
                            width: '340px',
                            background: 'linear-gradient(135deg,rgba(15,15,35,0.98),rgba(20,20,50,0.98))',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '16px',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                            zIndex: 9999,
                            backdropFilter: 'blur(20px)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '14px 18px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#f9fafb' }}>
                                📋 My Applications ({applications.length})
                            </span>
                            {/* Summary badges */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {acceptedCount > 0 && (
                                    <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                        ✅ {acceptedCount} Accepted
                                    </span>
                                )}
                                {rejectedCount > 0 && (
                                    <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                        ❌ {rejectedCount} Rejected
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Application list */}
                        <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                            {applications.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    <p style={{ fontSize: '28px', marginBottom: '8px' }}>📭</p>
                                    <p style={{ fontSize: '13px' }}>No applications yet</p>
                                </div>
                            ) : (
                                applications.map((app, i) => {
                                    const cfg = STATUS_CFG[app.status] ?? STATUS_CFG.pending;
                                    return (
                                        <div key={app.id ?? i} style={{
                                            padding: '12px 18px',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'background .15s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                {/* Dot indicator */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                    <span style={{
                                                        width: '7px', height: '7px', borderRadius: '50%',
                                                        background: cfg.dot, flexShrink: 0,
                                                        boxShadow: `0 0 6px ${cfg.dot}`,
                                                    }} />
                                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#f9fafb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {app.job_title}
                                                    </p>
                                                </div>
                                                <p style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '13px' }}>
                                                    {app.company_name} · {app.location}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#6b7280', marginLeft: '13px', marginTop: '2px' }}>
                                                    Applied {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <StatusPill status={app.status ?? 'pending'} />
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                            <Link
                                to="/jobs"
                                onClick={() => setShowNotif(false)}
                                style={{ fontSize: '13px', color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}
                            >
                                View All Jobs →
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <nav className="glass-strong sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2">
                            <div className="text-3xl">💼</div>
                            <span className="text-xl font-bold gradient-text">Career Connect</span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Public Links */}
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg transition-all ${isActive(link.path) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5'}`}
                                >
                                    {link.label}
                                </motion.button>
                            </Link>
                        ))}

                        {/* Authenticated Links */}
                        {isAuthenticated && authenticatedLinks.map((link) => (
                            <Link key={link.path} to={link.path}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg transition-all ${isActive(link.path) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5'}`}
                                >
                                    {link.label}
                                </motion.button>
                            </Link>
                        ))}

                        {/* Admin Links */}
                        {isAuthenticated && user?.role === 'admin' && adminLinks.map((link) => (
                            <Link key={link.path} to={link.path}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg transition-all ${isActive(link.path) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5'}`}
                                >
                                    👑 {link.label}
                                </motion.button>
                            </Link>
                        ))}

                        {/* Recruiter Portal Link (shown when not logged in) */}
                        {!isAuthenticated && (
                            <Link to="/recruiter/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg transition-all ${location.pathname.startsWith('/recruiter') ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-white/5'}`}
                                >
                                    🏢 Recruiters
                                </motion.button>
                            </Link>
                        )}

                        {/* Auth Buttons / Notification Bell */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3 ml-4">
                                {/* 🔔 Application Status Bell */}
                                <NotifBell />

                                <div className="text-sm text-gray-400">
                                    Welcome, <span className="text-primary-400 font-semibold">{user?.name}</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                >
                                    Logout
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 ml-4">
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
                                    >
                                        Login
                                    </motion.button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="btn-primary px-4 py-2"
                                    >
                                        Sign Up
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-white/5 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* Public Links */}
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className={`block px-4 py-3 rounded-lg transition-all ${isActive(link.path) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5'}`}>
                                        {link.label}
                                    </div>
                                </Link>
                            ))}

                            {/* Authenticated Links */}
                            {isAuthenticated && authenticatedLinks.map((link) => (
                                <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className={`block px-4 py-3 rounded-lg transition-all ${isActive(link.path) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5'}`}>
                                        {link.label}
                                    </div>
                                </Link>
                            ))}

                            {/* Admin Links */}
                            {isAuthenticated && user?.role === 'admin' && adminLinks.map((link) => (
                                <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className={`block px-4 py-3 rounded-lg transition-all ${isActive(link.path) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5'}`}>
                                        👑 {link.label}
                                    </div>
                                </Link>
                            ))}

                            {/* Recruiter Link */}
                            {!isAuthenticated && (
                                <Link to="/recruiter/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className={`block px-4 py-3 rounded-lg transition-all ${location.pathname.startsWith('/recruiter') ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-white/5'}`}>
                                        🏢 Recruiter Portal
                                    </div>
                                </Link>
                            )}

                            {/* Mobile Application Status */}
                            {isAuthenticated && applications.length > 0 && (
                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', marginTop: '8px' }}>
                                    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        🔔 My Applications
                                    </div>
                                    {applications.slice(0, 5).map((app, i) => (
                                        <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#f9fafb' }}>{app.job_title}</p>
                                                <p style={{ fontSize: '11px', color: '#6b7280' }}>{app.company_name}</p>
                                            </div>
                                            <StatusPill status={app.status ?? 'pending'} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Auth Buttons */}
                            {isAuthenticated ? (
                                <div className="pt-4 border-t border-white/10 space-y-2">
                                    <div className="px-4 py-2 text-sm text-gray-400">
                                        Welcome, <span className="text-primary-400 font-semibold">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-left"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-white/10 space-y-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-all">Login</div>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="block px-4 py-3 rounded-lg btn-primary text-center">Sign Up</div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
