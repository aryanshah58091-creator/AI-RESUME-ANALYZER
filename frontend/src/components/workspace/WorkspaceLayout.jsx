import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FileUp,
  Activity,
  FileEdit,
  Target,
  Brain,
  Settings,
  Sparkles,
  ChevronRight,
  Upload,
  Coins
} from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import CreditsModal from './CreditsModal';
import { cn } from '../ui/Card';

const navItems = [
  { path: '/workspace/ingestion', label: '1. Ingestion', icon: FileUp },
  { path: '/workspace/ats-diagnostics', label: '2. ATS Diagnostics', icon: Activity },
  { path: '/workspace/rewriter', label: '3. Smart Rewriter', icon: FileEdit },
  { path: '/workspace/tailorer', label: '4. JD Tailorer', icon: Target },
  { path: '/workspace/interview', label: '5. AI Interview', icon: Brain },
  { path: '/workspace/settings', label: 'Settings', icon: Settings },
];

function WorkspaceHeader({ onOpenCredits }) {
  const navigate = useNavigate();
  const { activeResume, parsedAnalysis } = useWorkspace();
  const { aiCredits } = useAuth();
  const atsScore = parsedAnalysis?.atsScore;

  return (
    <header className="flex items-center justify-between px-6 py-2.5 border-b border-dark-600 bg-dark-800/90 backdrop-blur-md z-10 gap-4">
      {/* Brand Logo */}
      <div
        onClick={() => navigate('/workspace/ingestion')}
        className="flex items-center space-x-2 shrink-0 cursor-pointer"
      >
        <span className="font-bold text-lg tracking-tight text-white">
          Resume<span className="text-brand-green">AI</span><span className="text-brand-teal">.Pro</span>
        </span>
      </div>

      {/* Center Flow Navigation */}
      <nav className="flex space-x-1.5 overflow-x-auto custom-scrollbar flex-1 justify-center px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                isActive
                  ? "bg-dark-700 text-white border border-brand-green/40 shadow-sm shadow-brand-green/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-dark-800"
              )
            }
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Active Profile Context Status & Credit Pill */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* AI Credits Pill */}
        <button
          onClick={onOpenCredits}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold transition-all shadow-sm group"
          title="AI Credit Balance - Click to refill or view plans"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>{aiCredits} Credits</span>
        </button>

        {activeResume ? (
          <div
            onClick={() => navigate('/workspace/ingestion')}
            className="flex items-center gap-2 bg-dark-900 border border-dark-600 hover:border-brand-green px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
            title="Click to switch or upload resume"
          >
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300 max-w-[130px] truncate">
              {activeResume.fileName || activeResume.file_name || 'Candidate Resume'}
            </span>
            {atsScore && (
              <span className="text-[10px] font-mono font-bold text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded border border-brand-green/30">
                {atsScore} ATS
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/workspace/ingestion')}
            className="text-xs text-brand-green bg-brand-green/10 border border-brand-green/30 hover:bg-brand-green/20 px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Enter Resume
          </button>
        )}

        {/* Engine status indicator */}
        <div className="hidden lg:flex text-[11px] text-slate-400 border border-dark-600 px-2.5 py-1 rounded-full items-center space-x-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
          <span>Engine Active</span>
        </div>
      </div>
    </header>
  );
}

export default function WorkspaceLayout() {
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  return (
    <WorkspaceProvider>
      <div className="flex flex-col h-screen bg-dark-900 text-slate-200 overflow-hidden font-sans">
        <WorkspaceHeader onOpenCredits={() => setShowCreditsModal(true)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 custom-scrollbar relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>

          <Outlet />
        </main>

        {/* Global Credits Modal */}
        <CreditsModal
          isOpen={showCreditsModal}
          onClose={() => setShowCreditsModal(false)}
        />
      </div>
    </WorkspaceProvider>
  );
}
