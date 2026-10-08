import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost/resume-api/api/recruiter.php';

const scoreColor = (score) => {
    if (score >= 75) return { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' };
    if (score >= 50) return { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' };
    return { color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' };
};

const statusOptions = ['pending', 'shortlisted', 'rejected', 'hired'];

const StatusPill = ({ status }) => {
    const map = {
        pending: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
        shortlisted: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' },
        rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
        hired: { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    };
    const s = map[status] ?? map.pending;
    return (
        <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {status}
        </span>
    );
};

const Applicants = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();

    const token = () => localStorage.getItem('recruiterToken');

    const fetchApplicants = () => {
        const t = token();
        if (!t) { navigate('/recruiter/login'); return; }
        setLoading(true);

        const url = jobId
            ? `${API}/recruiter/jobs/${jobId}/applicants`
            : `${API}/recruiter/applicants`;

        fetch(url, { headers: { Authorization: `Bearer ${t}` } })
            .then(r => r.json())
            .then(data => {
                if (data.job) { setJob(data.job); setApps(data.applicants ?? []); }
                else if (Array.isArray(data)) setApps(data);
                else setError(data.message || 'Failed to load applicants');
            })
            .catch(() => setError('Connection error.'))
            .finally(() => setLoading(false));
    };

    useEffect(fetchApplicants, [jobId]);

    const updateStatus = async (appId, status) => {
        await fetch(`${API}/recruiter/applications/${appId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ status }),
        });
        setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    };

    const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

    return (
        <div className="min-h-screen p-6 md:p-10">
            <Link to="/recruiter/my-jobs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
                ← Back to My Jobs
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold"
                    style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {job ? `Applicants – ${job.job_title}` : 'All Applicants'}
                </h1>
                <p className="text-gray-400 mt-1">{apps.length} total applicant{apps.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['all', ...statusOptions].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all"
                        style={filter === f
                            ? { background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }
                            : { background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }
                        }
                    >
                        {f} {f === 'all' ? `(${apps.length})` : `(${apps.filter(a => a.status === f).length})`}
                    </button>
                ))}
            </div>

            {loading && <div className="flex justify-center py-20"><div className="loading-spinner" /></div>}

            {!loading && error && (
                <div className="glass rounded-2xl p-8 text-center text-red-400">{error}</div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass rounded-3xl p-12 text-center">
                    <p className="text-5xl mb-4">🕵️</p>
                    <p className="text-xl text-gray-300 font-semibold">No applicants {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
                </motion.div>
            )}

            <div className="space-y-4">
                <AnimatePresence>
                    {filtered.map((app, i) => {
                        const sc = scoreColor(app.match_score ?? 0);
                        const isOpen = expanded === app.id;
                        let analysis = null;
                        try { analysis = app.analysis ? JSON.parse(app.analysis) : null; } catch { }

                        return (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="glass rounded-2xl overflow-hidden"
                            >
                                {/* Card Header */}
                                <div
                                    className="p-6 flex flex-wrap items-center gap-4 cursor-pointer"
                                    onClick={() => setExpanded(isOpen ? null : app.id)}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
                                        {(app.applicant_name ?? '?')[0].toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white">{app.applicant_name}</p>
                                        <p className="text-gray-400 text-sm">{app.applicant_email}</p>
                                    </div>

                                    {/* Score */}
                                    <div className="px-4 py-2 rounded-xl text-center flex-shrink-0"
                                        style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                                        <p className="text-xs text-gray-400">Match</p>
                                        <p className="text-xl font-bold" style={{ color: sc.color }}>{app.match_score ?? 0}%</p>
                                    </div>

                                    {/* Status badge */}
                                    <div className="flex-shrink-0">
                                        <StatusPill status={app.status ?? 'pending'} />
                                    </div>

                                    <span className="text-gray-500 text-lg">{isOpen ? '▲' : '▼'}</span>
                                </div>

                                {/* Expanded Detail */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-white/10"
                                        >
                                            <div className="p-6 space-y-5">
                                                {/* Applied on */}
                                                <p className="text-gray-400 text-sm">
                                                    Applied on: <span className="text-white">{new Date(app.applied_at).toLocaleString()}</span>
                                                </p>

                                                {/* Skills from analysis */}
                                                {analysis?.matchedSkills?.length > 0 && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-300 mb-2">Matched Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysis.matchedSkills.map(s => (
                                                                <span key={s} className="text-xs px-2 py-1 rounded-lg"
                                                                    style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                                                                    ✓ {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Resume file */}
                                                {app.resume_file && (
                                                    <p className="text-sm text-gray-400">
                                                        Resume: <span className="text-primary-400">{app.resume_file}</span>
                                                    </p>
                                                )}

                                                {/* Change status */}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-300 mb-3">Update Status</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {statusOptions.map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={() => updateStatus(app.id, s)}
                                                                className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                                                                style={(app.status ?? 'pending') === s
                                                                    ? { background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }
                                                                    : { background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }
                                                                }
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Applicants;
