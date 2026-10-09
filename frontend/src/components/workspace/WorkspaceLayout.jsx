import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FileUp,
  Activity,
  FileEdit,
  Target,
  Brain,
  Settings,
  Sparkles,
  Upload,
  Coins,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import CreditsModal from './CreditsModal';
import { cn } from '../ui/Card';

const navItems = [
  { path: '/workspace/ingestion', label: '1. Ingestion', shortLabel: '1. Ingest', icon: FileUp },
  { path: '/workspace/ats-diagnostics', label: '2. ATS Diagnostics', shortLabel: '2. ATS', icon: Activity },
  { path: '/workspace/rewriter', label: '3. Smart Rewriter', shortLabel: '3. Rewrite', icon: FileEdit },
  { path: '/workspace/tailorer', label: '4. JD Tailorer', shortLabel: '4. Tailor', icon: Target },
  { path: '/workspace/interview', label: '5. AI Interview', shortLabel: '5. Interview', icon: Brain },
  { path: '/workspace/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
];

function WorkspaceHeader({ onOpenCredits }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeResume, parsedAnalysis } = useWorkspace();
  const { aiCredits, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const atsScore = parsedAnalysis?.atsScore;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="px-4 sm:px-6 py-2.5 border-b border-dark-600 bg-dark-850/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-3 select-none">
        {/* Brand Logo - Guaranteed shrink-0 to prevent overlap */}
        <div
          onClick={() => navigate('/workspace/ingestion')}
          className="flex items-center space-x-2 shrink-0 cursor-pointer group pr-2"
        >
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
            Resume<span className="text-brand-green">AI</span><span className="text-brand-teal">.Pro</span>
          </span>
        </div>

        {/* Desktop Navigation (Hidden on < 1024px to prevent overlapping) */}
        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto custom-scrollbar px-2 shrink">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-dark-700 text-white border border-brand-green/40 shadow-sm shadow-brand-green/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-dark-800"
                )
              }
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">{item.label}</span>
              <span className="inline xl:hidden">{item.shortLabel}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Status Bar & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* AI Credits Pill */}
          <button
            onClick={onOpenCredits}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold transition-all shadow-sm group shrink-0"
            title="AI Credit Balance - Click to refill or view plans"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span>{aiCredits} <span className="hidden sm:inline">Credits</span></span>
          </button>

          {/* Active Candidate Resume Pill (Visible on md+) */}
          {activeResume ? (
            <div
              onClick={() => navigate('/workspace/ingestion')}
              className="hidden md:flex items-center gap-2 bg-dark-900 border border-dark-600 hover:border-brand-green px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shrink-0"
              title="Click to switch or upload resume"
            >
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse shrink-0"></span>
              <span className="text-xs font-medium text-slate-300 max-w-[110px] lg:max-w-[140px] truncate">
                {activeResume.fileName || activeResume.file_name || 'Candidate'}
              </span>
              {atsScore && (
                <span className="text-[10px] font-mono font-bold text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded border border-brand-green/30 shrink-0">
                  {atsScore} ATS
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/workspace/ingestion')}
              className="hidden sm:flex text-xs text-brand-green bg-brand-green/10 border border-brand-green/30 hover:bg-brand-green/20 px-2.5 py-1.5 rounded-xl font-bold transition-colors items-center gap-1.5 shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Enter Resume</span>
            </button>
          )}

          {/* User Signout Button */}
          <button
            onClick={handleLogout}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-dark-750 transition-colors flex items-center gap-1 text-xs shrink-0"
            title={`Signed in as ${user?.name || user?.email || 'User'} - Click to Logout`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px] font-medium">Logout</span>
          </button>

          {/* Mobile Menu Hamburger (Visible on < 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-dark-800 border border-dark-600 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-brand-green" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Visible when hamburger is opened) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark-800/98 border-b border-dark-600 px-4 py-4 flex flex-col gap-3 shadow-2xl animate-fadeIn z-20">
          <div className="flex items-center justify-between pb-2 border-b border-dark-700">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Workspace Navigation
            </span>
            {user && (
              <span className="text-xs text-brand-teal font-medium truncate max-w-[200px]">
                {user.email}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                    active
                      ? "bg-dark-700 text-brand-green border border-brand-green/40 shadow-sm"
                      : "text-slate-300 hover:bg-dark-700 bg-dark-900/60 border border-dark-700"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0 text-brand-teal" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {activeResume && (
            <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                <span className="text-xs text-slate-300 truncate max-w-[180px]">
                  {activeResume.fileName || activeResume.file_name}
                </span>
              </div>
              {atsScore && (
                <span className="text-xs font-mono font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/30">
                  {atsScore} ATS
                </span>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full mt-1 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of ResumeAI.Pro</span>
          </button>
        </div>
      )}
    </>
  );
}

// Sleek Sticky Bottom Navigation Bar for Mobile Phones (< 768px)
function MobileBottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mobileTabs = [
    { path: '/workspace/ingestion', label: 'Ingest', icon: FileUp },
    { path: '/workspace/ats-diagnostics', label: 'ATS', icon: Activity },
    { path: '/workspace/rewriter', label: 'Rewrite', icon: FileEdit },
    { path: '/workspace/tailorer', label: 'Tailor', icon: Target },
    { path: '/workspace/interview', label: 'Interview', icon: Brain },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-dark-900/95 backdrop-blur-lg border-t border-dark-700 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {mobileTabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative",
              active ? "text-brand-green font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <tab.icon className={cn("w-4 h-4 mb-0.5", active && "scale-110 text-brand-green")} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green absolute -bottom-0.5 animate-pulse"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default function WorkspaceLayout() {
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  return (
    <WorkspaceProvider>
      <div className="flex flex-col min-h-screen bg-dark-900 text-slate-200 overflow-x-hidden font-sans relative">
        <WorkspaceHeader onOpenCredits={() => setShowCreditsModal(true)} />

        {/* Main Content Area - with mobile bottom bar padding guard */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 pb-20 md:pb-6 custom-scrollbar relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>

          <Outlet />
        </main>

        {/* Mobile Sticky Bottom Tab Bar */}
        <MobileBottomBar />

        {/* Global Credits Modal */}
        <CreditsModal
          isOpen={showCreditsModal}
          onClose={() => setShowCreditsModal(false)}
        />
      </div>
    </WorkspaceProvider>
  );
}
