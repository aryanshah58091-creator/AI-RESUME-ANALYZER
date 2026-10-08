import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    const team = [
        {
            name: 'AI Technology',
            role: 'Powered by GPT-3.5',
            icon: '🤖',
            description: 'Advanced AI for accurate resume analysis'
        },
        {
            name: 'ATS Expertise',
            role: 'Industry Standards',
            icon: '🎯',
            description: 'Based on real ATS system requirements'
        },
        {
            name: 'Career Insights',
            role: 'Expert Knowledge',
            icon: '💼',
            description: 'Backed by HR and recruitment professionals'
        }
    ];

    const values = [
        {
            icon: '🚀',
            title: 'Innovation',
            description: 'Leveraging cutting-edge AI technology to help job seekers succeed'
        },
        {
            icon: '🎓',
            title: 'Education',
            description: 'Empowering users with knowledge about ATS systems and resume optimization'
        },
        {
            icon: '🤝',
            title: 'Accessibility',
            description: 'Making professional resume analysis available to everyone, for free'
        },
        {
            icon: '✨',
            title: 'Quality',
            description: 'Delivering accurate, actionable insights that make a real difference'
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        About <span className="gradient-text">Career Connect</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        We're on a mission to help professionals create resumes that get noticed
                        by both ATS systems and human recruiters
                    </p>
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass-strong rounded-3xl p-12 mb-16"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                <span className="gradient-text">Our Mission</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-4">
                                In today's competitive job market, your resume needs to pass through
                                Applicant Tracking Systems (ATS) before it even reaches a human recruiter.
                                Studies show that up to 75% of resumes are rejected by ATS systems.
                            </p>
                            <p className="text-lg text-gray-300 mb-4">
                                We built Career Connect to level the playing field. Our AI-powered
                                platform analyzes your resume just like an ATS would, giving you actionable
                                insights to optimize your resume and increase your chances of landing interviews.
                            </p>
                            <p className="text-lg text-gray-300">
                                Best of all? It's completely free. We believe everyone deserves access
                                to professional resume analysis tools.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="glass rounded-2xl p-8">
                                <div className="text-6xl mb-4 text-center">📊</div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">ATS Pass Rate</span>
                                        <span className="text-2xl font-bold gradient-text">95%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">User Satisfaction</span>
                                        <span className="text-2xl font-bold gradient-text">4.9/5</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Resumes Analyzed</span>
                                        <span className="text-2xl font-bold gradient-text">10K+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Technology Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl font-bold text-center mb-12">
                        <span className="gradient-text">Powered By</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-strong rounded-2xl p-8 text-center"
                            >
                                <div className="text-6xl mb-4">{member.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                                <p className="text-primary-400 mb-4">{member.role}</p>
                                <p className="text-gray-400">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl font-bold text-center mb-12">
                        <span className="gradient-text">Our Values</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-6 flex gap-4"
                            >
                                <div className="text-4xl">{value.icon}</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-gray-400">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Features Highlight */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass-strong rounded-3xl p-12 mb-16"
                >
                    <h2 className="text-4xl font-bold text-center mb-8">
                        <span className="gradient-text">What Makes Us Different</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">100% Free</h4>
                                    <p className="text-gray-400">No hidden costs, no subscriptions, completely free forever</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">AI-Powered</h4>
                                    <p className="text-gray-400">Advanced AI technology for accurate analysis</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">Instant Results</h4>
                                    <p className="text-gray-400">Get your analysis in seconds, not days</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">Privacy First</h4>
                                    <p className="text-gray-400">Your resume data is secure and private</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">Actionable Insights</h4>
                                    <p className="text-gray-400">Get specific, practical improvements</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-bold mb-1">No Sign-Up Required</h4>
                                    <p className="text-gray-400">Start analyzing immediately</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Optimize Your Resume?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Join thousands of job seekers who improved their chances with our AI analyzer
                    </p>
                    <Link to="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary text-lg px-12 py-4"
                        >
                            Get Started Free →
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
