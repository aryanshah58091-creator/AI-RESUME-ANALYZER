import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import CreditsModal from '../../components/workspace/CreditsModal';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatCircle } from '../../components/ui/StatCircle';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Wand2, Sparkles, Check, Briefcase, Coins } from 'lucide-react';

export default function SmartRewriter() {
  const navigate = useNavigate();
  const { activeResume } = useWorkspace();
  const { aiCredits, deductCredits } = useAuth();
  const [appliedAll, setAppliedAll] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [creditNotice, setCreditNotice] = useState('');

  const handleApplyAll = () => {
    if (appliedAll) return;
    if (aiCredits < 10) {
      setCreditNotice('Insufficient AI credits (10 credits required to apply Smart Rewriter bullets). Please refill.');
      setShowCreditsModal(true);
      return;
    }
    deductCredits(10);
    setAppliedAll(true);
    setCreditNotice('🎉 3 Executive Bullets Applied to Profile! (10 Credits deducted)');
    setTimeout(() => setCreditNotice(''), 5000);
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full max-w-7xl mx-auto py-2">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            Step 3 &bull; Smart Rewriter Studio
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Bullet Optimization Studio</h1>
          <p className="text-slate-400 text-xs mt-1">
            Transform passive duty phrases into high-impact business achievements with quantified telemetry.
            {activeResume && <span className="text-brand-teal ml-1 font-mono font-semibold">({activeResume.fileName})</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workspace/ats-diagnostics')}
            className="bg-dark-800 text-slate-300 border border-dark-600 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-dark-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Diagnostics
          </button>
          <div className="flex items-center gap-3 bg-dark-800 p-2 rounded-lg border border-dark-600">
            <div className="text-right">
              <div className="text-brand-green text-xs font-bold font-mono">+14 Points Delta</div>
              <div className="text-[10px] text-slate-500">Projected ATS Increase</div>
            </div>
            <button
              onClick={handleApplyAll}
              className="bg-brand-purple text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-purple-500 transition-colors shadow-md flex items-center gap-1.5"
            >
              {appliedAll ? <Check className="w-3.5 h-3.5" /> : <Wand2 className="w-3.5 h-3.5" />}
              {appliedAll ? 'Applied to Resume' : 'Apply All (3/3) &bull; 10 Cr'}
            </button>
          </div>
          <button
            onClick={() => navigate('/workspace/tailorer')}
            className="bg-brand-green text-dark-900 font-bold px-4 py-2.5 rounded-lg text-xs hover:bg-emerald-400 transition-all shadow-neon-green flex items-center gap-1.5"
          >
            <span>Proceed to JD Tailorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {creditNotice && (
        <div className="p-3 rounded-xl bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{creditNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Bullet Optimizer */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border-brand-purple/20 bg-dark-800/80">
            <CardHeader className="border-b border-dark-600 pb-3">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-brand-purple flex items-center gap-2">
                  <span className="bg-brand-purple/20 px-2 py-0.5 rounded text-xs">01</span>
                  VP of Product Management <span className="text-slate-500 font-normal">| Product Strategy</span>
                </CardTitle>
                <div className="flex gap-2">
                  <span className="badge badge-teal">Strategic Impact</span>
                  <span className="badge badge-purple">Leadership</span>
                </div>
              </div>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-dark-900/50 p-4 rounded-lg border border-dark-600 border-l-red-500/50">
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Original Draft (Passive)</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  "Managed the cross-functional teams and transition to a new cloud architecture while keeping systems running and saving some money."
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded">Weak Verb: "Managed"</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded">Missing Metrics</span>
                </div>
              </div>
              <div className="bg-brand-green/5 p-4 rounded-lg border border-brand-green/20 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-dark-800 rounded-full p-1 border border-dark-600">
                  <ArrowRight className="w-4 h-4 text-brand-green" />
                </div>
                <div className="text-xs text-brand-green mb-2 uppercase tracking-wider font-semibold flex justify-between">
                  <span>Optimized (Recommended)</span>
                  <span className="text-white">+8 ATS Pts</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "<span className="text-brand-green">Spearheaded</span> 15-engineer cross-functional matrix to execute <span className="text-brand-teal">$2.5M cloud migration</span> to AWS distributed architecture, <span className="text-brand-purple">reducing 30% latency</span> and eliminating $350K in annual legacy costs."
                </p>
                <div className="mt-4 flex justify-between items-center">
                   <div className="flex gap-2 text-xs text-slate-400">
                      <span>Action Density: <span className="text-white font-bold">High</span></span>
                      <span>Metrics: <span className="text-white font-bold">3</span></span>
                   </div>
                   <button className="text-xs bg-dark-600 hover:bg-dark-500 px-3 py-1 rounded text-white transition-colors">
                     Accept Bullet
                   </button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-brand-teal/20 bg-dark-800/80">
             <CardHeader className="border-b border-dark-600 pb-3">
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-brand-teal flex items-center gap-2">
                  <span className="bg-brand-teal/20 px-2 py-0.5 rounded text-xs">02</span>
                  Head of Platform Products <span className="text-slate-500 font-normal">| Enterprise Scale</span>
                </CardTitle>
                <div className="flex gap-2">
                  <span className="badge badge-green">Revenue</span>
                  <span className="badge badge-teal">Scale</span>
                </div>
              </div>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-dark-900/50 p-4 rounded-lg border border-dark-600 border-l-red-500/50">
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Original Draft (Passive)</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  "Launched our new developer API gateway and oversaw the rollout to our enterprise clients which resulted in increased revenue."
                </p>
              </div>
              <div className="bg-brand-green/5 p-4 rounded-lg border border-brand-green/20 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-dark-800 rounded-full p-1 border border-dark-600">
                  <ArrowRight className="w-4 h-4 text-brand-green" />
                </div>
                <div className="text-xs text-brand-green mb-2 uppercase tracking-wider font-semibold flex justify-between">
                  <span>Optimized (Recommended)</span>
                  <span className="text-white">+6 ATS Pts</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "<span className="text-brand-green">Architected</span> next-gen API gateway and orchestrated enterprise rollout to <span className="text-brand-teal">Fortune 500 accounts</span>, <span className="text-brand-purple">driving $1.2M new ARR</span> within Q3."
                </p>
                <div className="mt-4 flex justify-end">
                   <button className="text-xs bg-brand-green text-dark-900 font-bold hover:bg-emerald-400 px-3 py-1 rounded transition-colors">
                     Accepted
                   </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Metrics */}
        <div className="flex flex-col gap-6">
          <Card className="bg-dark-800/90 border-brand-green/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-brand-teal"></div>
            <CardTitle className="text-center text-slate-400 uppercase tracking-widest text-xs mb-4">Impact Grade Meter</CardTitle>
            <div className="flex justify-center my-4">
              <StatCircle value={97} label="Top 3%ile" color="#10b981" size={160} strokeWidth={12} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center mt-4 border-t border-dark-600 pt-4">
              <div>
                <div className="text-2xl font-bold text-white">88.4%</div>
                <div className="text-[10px] text-slate-500 uppercase">Action Verbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-teal">14/14</div>
                <div className="text-[10px] text-slate-500 uppercase">Metrics Found</div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Power Verb Density</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Execution / Delivery</span>
                  <span className="text-brand-teal">High</span>
                </div>
                <ProgressBar value={85} color="teal" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Leadership / Strategy</span>
                  <span className="text-brand-purple">Optimal</span>
                </div>
                <ProgressBar value={92} color="purple" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Innovation / Tech</span>
                  <span className="text-brand-green">Excellent</span>
                </div>
                <ProgressBar value={78} color="green" />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Executive Quality Gate</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-200">Google X-Y-Z Formula Compliance</div>
                  <div className="text-xs text-slate-500">Accomplished [X] as measured by [Y], by doing [Z].</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-200">Passive Voice Detected (2x)</div>
                  <div className="text-xs text-slate-500">Replace &quot;Responsible for&quot; &rarr; &quot;Directed&quot;, &quot;Managed&quot; &rarr; &quot;Architected&quot;</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-200">Quantified Impact Presence</div>
                  <div className="text-xs text-slate-500">100% of bullets contain numerical metrics.</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Bottom Completion & Transition Bar */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-900 border border-brand-green/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Resume Bullets Optimized &bull; Target Competencies Calibrated
            </h4>
            <p className="text-xs text-slate-400">
              Your profile is now calibrated to maximize ATS match probability. Discover matching jobs and apply with vector parity.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/workspace/tailorer')}
          className="bg-brand-green text-dark-900 font-bold px-6 py-3 rounded-xl text-xs hover:bg-emerald-400 transition-all shadow-neon-green flex items-center gap-2 shrink-0"
        >
          <Wand2 className="w-4 h-4" />
          Launch Target-JD Tailorer &amp; PDF Compiler
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <CreditsModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </div>
  );
}
