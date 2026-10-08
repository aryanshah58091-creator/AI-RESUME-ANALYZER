import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UploadSection from '../components/UploadSection';
import AnalysisResults from '../components/AnalysisResults';
import ResumeHistory from '../components/ResumeHistory';
import axios from '../api/axios';

const Dashboard = () => {
    const [currentAnalysis, setCurrentAnalysis] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await axios.get('/resume/history');
            setResumes(response.data || []);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
            // Set empty array on error so dashboard still shows
            setResumes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalysisComplete = (newResume) => {
        setCurrentAnalysis(newResume.analysis);
        setResumes([newResume, ...resumes]);

        // Scroll to results
        setTimeout(() => {
            document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleDelete = (id) => {
        setResumes(resumes.filter(r => r._id !== id));
        if (currentAnalysis && resumes.find(r => r._id === id)) {
            setCurrentAnalysis(null);
        }
    };

    const handleSelectResume = (resume) => {
        setCurrentAnalysis(resume.analysis);
        setTimeout(() => {
            document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Career Connect</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Get instant ATS scores, skills matching, and improvement suggestions
                    </p>
                </motion.div>

                {/* Upload Section */}
                <div className="mb-12">
                    <UploadSection onAnalysisComplete={handleAnalysisComplete} />
                </div>

                {/* Results Section */}
                {currentAnalysis && (
                    <div id="results" className="mb-12">
                        <AnalysisResults analysis={currentAnalysis} />
                    </div>
                )}

                {/* History Section */}
                <div>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <ResumeHistory
                            resumes={resumes}
                            onDelete={handleDelete}
                            onSelect={handleSelectResume}
                        />
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 py-8 text-center text-gray-500 text-sm">
                <p>© 2026 Career Connect. Empowering Your Career Journey.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
