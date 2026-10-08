import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost/resume-api/api/recruiter.php';

const statusBadge = (status) => {
    const map = {
        active: { label: 'Active', bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
        closed: { label: 'Closed', bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
        paused: { label: 'Paused', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    };
    const s = map[status] ?? map.closed;
    return (
        <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {s.label}
        </span>
    );
};

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState(null); // jobId to delete
    const navigate = useNavigate();

    const token = () => localStorage.getItem('recruiterToken');

    const fetchJobs = () => {
        const t = token();
        if (!t) { navigate('/recruiter/login'); return; }
        setLoading(true);
        fetch(`${API}/recruiter/jobs`, { headers: { Authorization: `Bearer ${t}` } })
            .then(r => r.json())
            .then(data => { setJobs(Array.isArray(data) ? data : []); })
            .catch(() => setError('Failed to load jobs'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchJobs, []);

    const toggleStatus = async (job) => {
        const newStatus = job.status === 'active' ? 'closed' : 'active';
        await fetch(`${API}/recruiter/jobs/${job.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchJobs();
    };

    const deleteJob = async (id) => {
        await fetch(`${API}/recruiter/jobs/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token()}` },
        });
        setConfirm(null);
        fetchJobs();
    };

    return (
        <div className="min-h-screen p-6 md:p-10">
            <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
                ← Back to Dashboard
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold"
                        style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        My Jobs
                    </h1>
                    <p className="text-gray-400 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
                </div>
                <Link to="/recruiter/post-job">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-6 py-3 rounded-xl font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
                    >
                        + Post New Job
                    </motion.button>
                </Link>
            </div>

            {loading && (
                <div className="flex justify-center py-20">
                    <div className="loading-spinner" />
                </div>
            )}

            {!loading && error && (
                <div className="glass rounded-2xl p-8 text-center text-red-400">{error}</div>
            )}

            {!loading && !error && jobs.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-3xl p-12 text-center"
                >
                    <p className="text-5xl mb-4">📭</p>
                    <p className="text-xl text-gray-300 font-semibold">No jobs posted yet</p>
                    <p className="text-gray-500 mb-6">Get started by posting your first job listing</p>
                    <Link to="/recruiter/post-job">
                        <button className="px-8 py-3 rounded-xl font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>
                            Post a Job
                        </button>
                    </Link>
                </motion.div>
            )}

            <div className="space-y-4">
                <AnimatePresence>
                    {jobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass rounded-2xl p-6"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                {/* Left */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h2 className="text-lg font-bold text-white">{job.job_title}</h2>
                                        {statusBadge(job.status)}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">
                                        {job.company_name} • {job.location} {job.salary_range ? `• ${job.salary_range}` : ''} {job.job_type ? `• ${job.job_type}` : ''}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(job.required_skills ?? '').split(',').slice(0, 5).map(s => (
                                            <span key={s} className="text-xs px-2 py-1 rounded-lg"
                                                style={{ background: 'rgba(102,126,234,0.15)', color: '#a5b4fc', border: '1px solid rgba(102,126,234,0.25)' }}>
                                                {s.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right – meta + actions */}
                                <div className="flex flex-col items-end gap-3 text-right flex-shrink-0">
                                    <div className="text-gray-400 text-sm">
                                        <span className="text-white font-semibold">{job.application_count ?? 0}</span> applicant{job.application_count !== 1 ? 's' : ''}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        Posted {new Date(job.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        <Link to={`/recruiter/applicants/${job.id}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                className="px-4 py-2 rounded-lg text-sm font-semibold"
                                                style={{ background: 'rgba(102,126,234,0.15)', color: '#a5b4fc', border: '1px solid rgba(102,126,234,0.3)' }}>
                                                👥 Applicants
                                            </motion.button>
                                        </Link>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => toggleStatus(job)}
                                            className="px-4 py-2 rounded-lg text-sm font-semibold"
                                            style={job.status === 'active'
                                                ? { background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }
                                                : { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                                            {job.status === 'active' ? '⏸ Close' : '▶ Reopen'}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => setConfirm(job.id)}
                                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400"
                                            style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
                                            🗑 Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {confirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="glass-strong rounded-2xl p-8 max-w-sm w-full text-center"
                        >
                            <p className="text-4xl mb-4">⚠️</p>
                            <h3 className="text-xl font-bold text-white mb-2">Delete this job?</h3>
                            <p className="text-gray-400 text-sm mb-6">This will also remove all associated applications. This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirm(null)}
                                    className="flex-1 py-3 rounded-xl font-semibold text-gray-300"
                                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                                    Cancel
                                </button>
                                <button onClick={() => deleteJob(confirm)}
                                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyJobs;
