import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    const features = [
        {
            icon: '🎯',
            title: 'ATS Score Analysis',
            description: 'Get instant ATS compatibility scores and understand how recruiters see your resume'
        },
        {
            icon: '💼',
            title: 'Skills Matching',
            description: 'Identify matched and missing skills based on job descriptions'
        },
        {
            icon: '🔑',
            title: 'Keyword Optimization',
            description: 'Discover important keywords to boost your resume visibility'
        },
        {
            icon: '✨',
            title: 'AI-Powered Insights',
            description: 'Receive personalized improvement suggestions powered by AI'
        },
        {
            icon: '📊',
            title: 'Detailed Reports',
            description: 'Access comprehensive analysis with strengths and areas for improvement'
        },
        {
            icon: '🚀',
            title: 'Instant Results',
            description: 'Get your resume analyzed in seconds, not hours'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Resumes Analyzed' },
        { number: '95%', label: 'Success Rate' },
        { number: '4.9/5', label: 'User Rating' },
        { number: '24/7', label: 'Availability' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">Transform Your Career</span>
                            <br />
                            <span className="text-white">With Career Connect</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Get instant AI-powered insights to optimize your resume for ATS systems
                            and stand out from the competition
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary text-lg px-8 py-4"
                                    >
                                        Go to Dashboard →
                                    </motion.button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="btn-primary text-lg px-8 py-4"
                                        >
                                            Get Started Free →
                                        </motion.button>
                                    </Link>
                                    <Link to="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="glass-strong text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            Sign In
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>

                        <p className="text-sm text-gray-400 mt-4">
                            ✨ No credit card required • Free forever • Instant results
                        </p>
                    </motion.div>

                    {/* Animated Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 glass-strong rounded-3xl p-8 max-w-4xl mx-auto"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Powerful Features</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Everything you need to create a winning resume
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-strong rounded-2xl p-6 hover:bg-white/5 transition-all"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent to-primary-500/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">How It Works</span>
                        </h2>
                        <p className="text-xl text-gray-300">Simple, fast, and effective</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Upload Resume', desc: 'Upload your resume in PDF or DOCX format' },
                            { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes your resume in seconds' },
                            { step: '03', title: 'Get Insights', desc: 'Receive detailed feedback and improvements' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="text-6xl font-bold gradient-text mb-4">{item.step}</div>
                                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-strong rounded-3xl p-12 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to <span className="gradient-text">Boost Your Career?</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of professionals who advanced their careers with Career Connect
                        </p>
                        {!user && (
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary text-lg px-12 py-4"
                                >
                                    Start Analyzing Now - It's Free! →
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
