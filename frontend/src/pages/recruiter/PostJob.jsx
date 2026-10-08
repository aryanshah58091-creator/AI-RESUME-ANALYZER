import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = 'http://localhost/resume-api/api/recruiter.php';

const PostJob = () => {
    const [form, setForm] = useState({
        job_title: '',
        company_name: '',
        location: '',
        salary_range: '',
        required_skills: '',
        description: '',
        job_type: 'full-time',
        experience_level: 'mid',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // Pre-fill company from stored recruiter profile
    useState(() => {
        const stored = localStorage.getItem('recruiter');
        if (stored) {
            const r = JSON.parse(stored);
            setForm(f => ({ ...f, company_name: r.company ?? '' }));
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('recruiterToken');
        if (!token) { navigate('/recruiter/login'); return; }

        try {
            const res = await fetch(`${API}/recruiter/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess('🎉 Job posted successfully!');
                setForm({ job_title: '', company_name: form.company_name, location: '', salary_range: '', required_skills: '', description: '', job_type: 'full-time', experience_level: 'mid' });
            } else {
                setError(data.message || 'Failed to post job');
            }
        } catch {
            setError('Connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
            {/* Back */}
            <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
                ← Back to Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-3xl p-8"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold"
                        style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Post a New Job
                    </h1>
                    <p className="text-gray-400 mt-1">Fill in the details to attract the right candidates</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Job Title *</label>
                            <input name="job_title" value={form.job_title} onChange={handleChange} placeholder="e.g. Senior React Developer" className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Company Name *</label>
                            <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Acme Corp" className="input-field" required />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Location *</label>
                            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote / Mumbai" className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Salary Range</label>
                            <input name="salary_range" value={form.salary_range} onChange={handleChange} placeholder="e.g. ₹8L–12L / $60k–80k" className="input-field" />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Job Type</label>
                            <select name="job_type" value={form.job_type} onChange={handleChange} className="input-field">
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Experience Level</label>
                            <select name="experience_level" value={form.experience_level} onChange={handleChange} className="input-field">
                                <option value="fresher">Fresher (0–1 yr)</option>
                                <option value="junior">Junior (1–3 yrs)</option>
                                <option value="mid">Mid-level (3–5 yrs)</option>
                                <option value="senior">Senior (5+ yrs)</option>
                                <option value="lead">Lead / Manager</option>
                            </select>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Required Skills * <span className="text-gray-500 font-normal">(comma-separated)</span>
                        </label>
                        <input
                            name="required_skills"
                            value={form.required_skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MySQL, REST APIs"
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Job Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, requirements, and any perks…"
                            rows={6}
                            className="input-field resize-none"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="rounded-xl p-4 text-sm font-medium"
                            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}>
                            {success}
                        </motion.div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#059669 0%,#10b981 100%)', boxShadow: '0 4px 15px rgba(16,185,129,0.35)' }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="loading-spinner w-5 h-5" /> Posting…
                                </span>
                            ) : '🚀 Post Job'}
                        </button>
                        <Link to="/recruiter/my-jobs"
                            className="px-6 py-4 rounded-xl font-semibold text-gray-300 transition-all hover:bg-white/5"
                            style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                            View My Jobs
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PostJob;
