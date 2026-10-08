import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';

const UploadSection = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;
        const name = (selectedFile.name || '').toLowerCase();
        const isPdfOrDoc = name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.doc') || name.endsWith('.txt');

        if (!isPdfOrDoc) {
            setError('Please upload a PDF, DOCX, or TXT file');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jobDescription);

            const response = await axios.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onAnalysisComplete(response.data);
            setFile(null);
            setJobDescription('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-8"
        >
            <h2 className="text-2xl font-bold mb-6 gradient-text">Upload Your Resume</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragActive
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-600 hover:border-primary-500'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                    />

                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="space-y-4">
                            <div className="text-6xl">📎</div>
                            <div>
                                <p className="text-lg font-semibold">
                                    {file ? file.name : 'Drop your resume here or click to browse'}
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Supports PDF and DOCX (Max 5MB)
                                </p>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Job Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Job Description (Optional)
                    </label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here to get tailored analysis..."
                        className="input-field min-h-[150px] resize-none"
                        rows="6"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        💡 Adding a job description will provide more accurate skills matching and keyword analysis
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !file}
                    className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="loading-spinner w-5 h-5"></div>
                            <span>Analyzing Resume...</span>
                        </div>
                    ) : (
                        '🚀 Analyze Resume'
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default UploadSection;
