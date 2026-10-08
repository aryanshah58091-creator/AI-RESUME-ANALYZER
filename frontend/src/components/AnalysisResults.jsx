import { motion } from 'framer-motion';

const AnalysisResults = ({ analysis }) => {
    if (!analysis) return null;

    const { atsScore, matchedSkills, missingSkills, matchedKeywords, missingKeywords, strengths, improvements, summary } = analysis;

    // Calculate score color
    const getScoreColor = (score) => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 60) return 'from-yellow-400 to-orange-500';
        return 'from-red-400 to-pink-500';
    };

    const scorePercentage = `${atsScore}%`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* ATS Score */}
            <div className="glass-strong rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 gradient-text">Analysis Results</h2>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Score Circle */}
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full flex items-center justify-center relative">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 88}`}
                                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - atsScore / 100)}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" className="text-primary-500" stopColor="currentColor" />
                                        <stop offset="100%" className="text-accent-500" stopColor="currentColor" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold gradient-text">{atsScore}</span>
                                <span className="text-sm text-gray-400">ATS Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3">Summary</h3>
                        <p className="text-gray-300 leading-relaxed">{summary}</p>
                    </div>
                </div>
            </div>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h3 className="text-xl font-semibold">Matched Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-1 rounded-lg bg-green-500/20 text-green-300 text-sm font-medium border border-green-500/30"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">⚠️</span>
                        <h3 className="text-xl font-semibold">Missing Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-sm font-medium border border-orange-500/30"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Keywords Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Matched Keywords */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">🔑</span>
                        <h3 className="text-xl font-semibold">Matched Keywords</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {matchedKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Missing Keywords */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">🔍</span>
                        <h3 className="text-xl font-semibold">Missing Keywords</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Strengths */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">💪</span>
                    <h3 className="text-xl font-semibold">Strengths</h3>
                </div>
                <ul className="space-y-3">
                    {strengths.map((strength, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3"
                        >
                            <span className="text-green-400 mt-1">✓</span>
                            <span className="text-gray-300">{strength}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Improvements */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">🎯</span>
                    <h3 className="text-xl font-semibold">Suggested Improvements</h3>
                </div>
                <ul className="space-y-3">
                    {improvements.map((improvement, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3"
                        >
                            <span className="text-primary-400 mt-1">→</span>
                            <span className="text-gray-300">{improvement}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default AnalysisResults;
