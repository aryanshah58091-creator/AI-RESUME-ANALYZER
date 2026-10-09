import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Workspace Pages
import WorkspaceLayout from './components/workspace/WorkspaceLayout';
import DataIngestion from './pages/workspace/DataIngestion';
import ATSDiagnostics from './pages/workspace/ATSDiagnostics';
import SmartRewriter from './pages/workspace/SmartRewriter';
import TargetJDTailorer from './pages/workspace/TargetJDTailorer';
import MockInterview from './pages/workspace/MockInterview';
import Settings from './pages/workspace/Settings';

// Route Guard: redirects unauthenticated visitors to /login
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-slate-300 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping"></span>
          <span>Verifying ResumeAI.Pro Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Root path handler: directs unauthenticated visitors to /login, logged-in users to workspace
function RootHandler() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-slate-300 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping"></span>
          <span>Connecting to ResumeAI.Pro...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/workspace/ats-diagnostics" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-dark-900 text-white font-sans">
          <Routes>
            {/* Standalone Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Core Protected Engineering Workspace */}
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <WorkspaceLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="ats-diagnostics" replace />} />
              <Route path="ingestion" element={<DataIngestion />} />
              <Route path="ats-diagnostics" element={<ATSDiagnostics />} />
              <Route path="rewriter" element={<SmartRewriter />} />
              <Route path="tailorer" element={<TargetJDTailorer />} />
              <Route path="interview" element={<MockInterview />} />
              <Route path="settings" element={<Settings />} />

              {/* Backward compatibility */}
              <Route path="job-match" element={<Navigate to="/workspace/tailorer" replace />} />
            </Route>

            {/* Root entry point */}
            <Route path="/" element={<RootHandler />} />

            {/* Direct Entry Points & Permalinks (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/ats-diagnostics" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats-diagnostics"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/ats-diagnostics" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnostics"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/ats-diagnostics" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewriter"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/rewriter" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tailorer"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/tailorer" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/interview" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Navigate to="/workspace/tailorer" replace />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<RootHandler />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
