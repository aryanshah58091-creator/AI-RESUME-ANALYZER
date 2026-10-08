import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-dark-900 text-white font-sans">
          <Routes>
            {/* Standalone Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Core Engineering Workspace */}
            <Route path="/workspace" element={<WorkspaceLayout />}>
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

            {/* Direct Entry Points & Permalinks */}
            <Route path="/" element={<Navigate to="/workspace/ats-diagnostics" replace />} />
            <Route path="/dashboard" element={<Navigate to="/workspace/ats-diagnostics" replace />} />
            <Route path="/ats-diagnostics" element={<Navigate to="/workspace/ats-diagnostics" replace />} />
            <Route path="/diagnostics" element={<Navigate to="/workspace/ats-diagnostics" replace />} />
            <Route path="/rewriter" element={<Navigate to="/workspace/rewriter" replace />} />
            <Route path="/tailorer" element={<Navigate to="/workspace/tailorer" replace />} />
            <Route path="/interview" element={<Navigate to="/workspace/interview" replace />} />
            <Route path="/jobs" element={<Navigate to="/workspace/tailorer" replace />} />
            <Route path="/job-match" element={<Navigate to="/workspace/tailorer" replace />} />

            {/* Catch-all fallback to ATS Diagnostics */}
            <Route path="*" element={<Navigate to="/workspace/ats-diagnostics" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
