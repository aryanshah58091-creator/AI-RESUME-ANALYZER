import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResumes: 0,
        totalJobs: 0,
        totalApplications: 0,
        recentUsers: [],
        recentResumes: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('/admin/dashboard-stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {user?.name}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
                            </div>
                            <div className="bg-primary-500/10 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Resumes */}
                    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-secondary-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Resumes</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalResumes}</h3>
                            </div>
                            <div className="bg-secondary-500/10 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Jobs */}
                    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-accent-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Jobs</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalJobs}</h3>
                            </div>
                            <div className="bg-accent-500/10 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Applications */}
                    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-green-500 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Applications</p>
                                <h3 className="text-3xl font-bold text-white">{stats.totalApplications}</h3>
                            </div>
                            <div className="bg-green-500/10 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/admin/users"
                        className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                        <p className="text-primary-100">View and manage all registered users</p>
                    </Link>

                    <Link
                        to="/admin/resumes"
                        className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl p-6 text-white hover:shadow-lg hover:shadow-secondary-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold mb-2">Resume Analytics</h3>
                        <p className="text-secondary-100">View all resume submissions and analysis</p>
                    </Link>

                    <Link
                        to="/admin/jobs"
                        className="bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl p-6 text-white hover:shadow-lg hover:shadow-accent-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold mb-2">Manage Jobs</h3>
                        <p className="text-accent-100">Add, edit, and manage job listings</p>
                    </Link>
                </div>

                {/* Application Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link
                        to="/admin/pending-applications"
                        className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-white hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">Pending Applications</h3>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-yellow-100">Review and manage pending job applications</p>
                    </Link>

                    <Link
                        to="/admin/accepted-applications"
                        className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">Accepted Applications</h3>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-green-100">View all accepted job applications</p>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                        <h3 className="text-xl font-bold text-white mb-4">Recent Users</h3>
                        <div className="space-y-3">
                            {stats.recentUsers.length > 0 ? (
                                stats.recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">No recent users</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Resumes */}
                    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                        <h3 className="text-xl font-bold text-white mb-4">Recent Resume Submissions</h3>
                        <div className="space-y-3">
                            {stats.recentResumes.length > 0 ? (
                                stats.recentResumes.map((resume) => (
                                    <div key={resume.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{resume.filename}</p>
                                            <p className="text-gray-400 text-sm">by {resume.user_name}</p>
                                        </div>
                                        {resume.ats_score && (
                                            <div className="ml-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${resume.ats_score >= 80 ? 'bg-green-500/20 text-green-400' :
                                                    resume.ats_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {resume.ats_score}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">No recent resumes</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
