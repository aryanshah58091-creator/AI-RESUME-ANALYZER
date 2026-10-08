import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from '../api/axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/contact', formData);
            console.log('Form submitted successfully:', response.data);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 3000);
        } catch (err) {
            console.error('Failed to submit form:', err);
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: '📧',
            title: 'Email',
            content: 'support@airesume.com',
            link: 'mailto:support@airesume.com'
        },
        {
            icon: '💬',
            title: 'Live Chat',
            content: 'Available 24/7',
            link: '#'
        },
        {
            icon: '📍',
            title: 'Location',
            content: 'Remote & Global',
            link: '#'
        }
    ];

    const faqs = [
        {
            question: 'Is the service really free?',
            answer: 'Yes! AI Resume Analyzer is completely free to use. No hidden costs, no subscriptions.'
        },
        {
            question: 'How accurate is the ATS score?',
            answer: 'Our AI analyzes your resume based on real ATS system requirements, providing highly accurate scores and insights.'
        },
        {
            question: 'What file formats do you support?',
            answer: 'We support PDF and DOCX formats. For best results, we recommend using DOCX files.'
        },
        {
            question: 'Is my resume data secure?',
            answer: 'Absolutely! We take privacy seriously. Your resume data is encrypted and never shared with third parties.'
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
                        <span className="gradient-text">Get In Touch</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Have questions? We're here to help! Reach out to us and we'll get back to you as soon as possible.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-strong rounded-3xl p-8">
                            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-6xl mb-4">✅</div>
                                    <h3 className="text-2xl font-bold mb-2 gradient-text">Message Sent!</h3>
                                    <p className="text-gray-300">We'll get back to you within 24 hours.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="input-field w-full"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="input-field w-full"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="input-field w-full"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="6"
                                            className="input-field w-full resize-none"
                                            placeholder="Tell us more about your question or feedback..."
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Sending...' : 'Send Message →'}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {contactInfo.map((info, index) => (
                            <motion.a
                                key={index}
                                href={info.link}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-strong rounded-2xl p-6 block hover:bg-white/5 transition-all"
                            >
                                <div className="text-4xl mb-3">{info.icon}</div>
                                <h3 className="text-lg font-bold mb-1">{info.title}</h3>
                                <p className="text-gray-400">{info.content}</p>
                            </motion.a>
                        ))}

                        {/* Social Links */}
                        <div className="glass-strong rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: '🐦', link: 'https://twitter.com/airesume' },
                                    { icon: '💼', link: 'https://linkedin.com/company/airesume' },
                                    { icon: '📘', link: 'https://facebook.com/airesume' },
                                    { icon: '📸', link: 'https://instagram.com/airesume' }
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl hover:bg-white/10 transition-all"
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Response Time */}
                        <div className="glass-strong rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">⚡</span>
                                <div>
                                    <h3 className="font-bold">Quick Response</h3>
                                    <p className="text-sm text-gray-400">Usually within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl font-bold text-center mb-12">
                        <span className="gradient-text">Frequently Asked Questions</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-bold mb-3 flex items-start gap-2">
                                    <span className="text-primary-400">Q:</span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-400 pl-6">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Support Hours */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-strong rounded-3xl p-12 text-center"
                >
                    <div className="text-6xl mb-4">🕐</div>
                    <h2 className="text-3xl font-bold mb-4">
                        We're Here <span className="gradient-text">24/7</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-6">
                        Our automated system is always available, and our team responds to inquiries within 24 hours
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                        <span>✅ Email Support</span>
                        <span>✅ Live Chat</span>
                        <span>✅ FAQ Resources</span>
                        <span>✅ Video Tutorials</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
