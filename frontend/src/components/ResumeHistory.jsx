import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from '../api/axios';

const ResumeHistory = ({ resumes, onDelete, onSelect }) => {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this analysis?')) {
            return;
        }

        setDeleting(id);
        try {
            await axios.delete(`/resume/${id}`);
            onDelete(id);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete resume');
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    // Ensure resumes is always an array
    const resumeList = Array.isArray(resumes) ? resumes : [];

    if (resumeList.length === 0) {
        return (
            <div className="glass rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-400">No resume analyses yet. Upload your first resume to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold gradient-text mb-6">Resume History</h2>

            {resumeList.map((resume, index) => (
                <motion.div
                    key={resume._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    onClick={() => onSelect(resume)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">📄</span>
                                <h3 className="font-semibold text-lg">{resume.fileName}</h3>
                                <span className={`text-2xl font-bold ${getScoreColor(resume.analysis.atsScore)}`}>
                                    {resume.analysis.atsScore}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span>📅 {formatDate(resume.createdAt)}</span>
                                <span>📊 {resume.analysis.matchedSkills?.length || 0} skills matched</span>
                                {resume.jobDescription && (
                                    <span>🎯 Job-specific analysis</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(resume._id);
                            }}
                            disabled={deleting === resume._id}
                            className="btn-secondary px-4 py-2 text-sm hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                        >
                            {deleting === resume._id ? '...' : '🗑️ Delete'}
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ResumeHistory;
