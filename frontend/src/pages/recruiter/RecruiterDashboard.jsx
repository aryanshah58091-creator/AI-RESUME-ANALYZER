import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = 'http://localhost/resume-api/api/recruiter.php';

const StatCard = ({ icon, label, value, accent }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="glass rounded-2xl p-6 flex items-center gap-4"
    >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: accent + '22', border: `1px solid ${accent}44` }}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-3xl font-bold text-white">{value ?? '–'}</p>
        </div>
    </motion.div>
);

const RecruiterDashboard = () => {
    const [recruiter, setRecruiter] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('recruiter');
        const token = localStorage.getItem('recruiterToken');
        if (!stored || !token) { navigate('/recruiter/login'); return; }
        setRecruiter(JSON.parse(stored));

        fetch(`${API}/recruiter/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(setStats)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('recruiterToken');
        localStorage.removeItem('recruiter');
        navigate('/recruiter/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );
    }

    const statCards = [
        { icon: '📋', label: 'Total Jobs Posted', value: stats?.totalJobs, accent: '#10b981' },
        { icon: '✅', label: 'Active Jobs', value: stats?.activeJobs, accent: '#34d399' },
        { icon: '👥', label: 'Total Applications', value: stats?.totalApplications, accent: '#667eea' },
        { icon: '⏳', label: 'Pending Applications', value: stats?.pendingApplications, accent: '#f59e0b' },
    ];

    return (
        <div className="min-h-screen p-6 md:p-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-between gap-4 mb-10"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold"
                        style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Recruiter Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Welcome back, <span className="text-white font-semibold">{recruiter?.name}</span>
                        {recruiter?.company && <> — <span style={{ color: '#34d399' }}>{recruiter.company}</span></>}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                    Logout
                </button>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {statCards.map((s, i) => (
                    <motion.div key={s.label} transition={{ delay: i * 0.1 }}>
                        <StatCard {...s} />
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-8"
            >
                <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { to: '/recruiter/post-job', icon: '➕', label: 'Post a New Job', accent: '#10b981' },
                        { to: '/recruiter/my-jobs', icon: '📂', label: 'Manage My Jobs', accent: '#667eea' },
                        { to: '/recruiter/applicants', icon: '👀', label: 'View All Applicants', accent: '#f59e0b' },
                    ].map(({ to, icon, label, accent }) => (
                        <Link key={to} to={to}>
                            <motion.div
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-xl p-5 flex items-center gap-3 cursor-pointer transition-all"
                                style={{ background: accent + '14', border: `1px solid ${accent}33` }}
                            >
                                <span className="text-2xl">{icon}</span>
                                <span className="font-semibold text-white">{label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default RecruiterDashboard;
