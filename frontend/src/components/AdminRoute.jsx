import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Check if user is authenticated and is an admin
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Debug: Log user data
    console.log('AdminRoute - User data:', user);
    console.log('AdminRoute - User role:', user?.role);

    if (user?.role !== 'admin') {
        // Redirect non-admin users to dashboard
        console.warn('AdminRoute - User is not admin, redirecting to /dashboard');
        return <Navigate to="/dashboard" />;
    }

    console.log('AdminRoute - User is admin, allowing access');
    return children;
};

export default AdminRoute;
