import React, { useState } from 'react';
import {
  Coins,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  Flame,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';

export default function CreditsModal({ isOpen, onClose }) {
  const { aiCredits, refillCredits } = useAuth();
  const [refilling, setRefilling] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleDemoRefill = async (amount = 50) => {
    setRefilling(true);
    setStatusMsg('');
    try {
      const res = await refillCredits(amount);
      if (res.success) {
        setStatusMsg(`🎉 Successfully added +${amount} AI Credits! New Balance: ${res.ai_credits}`);
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      setStatusMsg('Failed to refill credits. Please try again.');
    } finally {
      setRefilling(false);
    }
  };

  const handleSimulatePurchase = (tierName, amount) => {
    handleDemoRefill(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-700 bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Credits & Upgrade Store
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-green/10 text-brand-green border border-brand-green/30 uppercase">
                  Freemium SaaS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                100 Free credits gifted per account &bull; Refill anytime as you scale your job applications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          {/* Active Balance Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-dark-800 to-brand-green/10 border border-amber-500/30 gap-3">
            <div>
              <span className="text-xs text-slate-400 block">Current AI Wallet Balance:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Coins className="w-6 h-6 text-amber-400" />
                <span className="text-2xl font-black font-mono text-white">
                  {aiCredits} <span className="text-amber-400 text-sm font-semibold">Credits Available</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                JD Semantic Auto-Tailoring uses <strong className="text-amber-300">10 credits</strong> per target optimization.
              </p>
            </div>

            <button
              onClick={() => handleDemoRefill(50)}
              disabled={refilling}
              className="bg-amber-500 hover:bg-amber-400 text-dark-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 shrink-0 disabled:opacity-60"
            >
              {refilling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-dark-900" />
                  <span>Adding Credits...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-dark-900" />
                  <span>Free Sandbox Refill (+50)</span>
                </>
              )}
            </button>
          </div>

          {statusMsg && (
            <div className="p-3 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Pricing Tiers Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-teal" />
              Upgrade Credit Packs & Passes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Tier 1: Starter */}
              <div className="p-4 rounded-xl border border-dark-600 bg-dark-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-300">Starter Pack</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-700 text-slate-400">Included</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-2">100 Credits</div>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mb-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                      Free with signup
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                      10 Full JD Tailors
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                      ATS Diagnostics Free
                    </li>
                  </ul>
                </div>
                <button
                  disabled
                  className="w-full bg-dark-700 text-slate-500 py-2 rounded-lg text-xs font-semibold cursor-not-allowed"
                >
                  Current Default
                </button>
              </div>

              {/* Tier 2: Pro Booster */}
              <div className="p-4 rounded-xl border-2 border-brand-green/50 bg-brand-green/5 flex flex-col justify-between relative shadow-lg">
                <span className="absolute -top-2.5 right-3 bg-brand-green text-dark-900 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full font-mono">
                  POPULAR
                </span>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-green">Pro Booster</span>
                    <span className="text-xs font-bold text-white font-mono">$9 / ₹499</span>
                  </div>
                  <div className="text-xl font-black text-white mb-2">500 Credits</div>
                  <ul className="text-[11px] text-slate-300 space-y-1.5 mb-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                      50 Full JD Auto-Tailors
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                      Unlimited PDF Exports
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                      Instant Priority Queuing
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSimulatePurchase('Pro Booster', 500)}
                  disabled={refilling}
                  className="w-full bg-brand-green hover:bg-emerald-400 text-dark-900 py-2 rounded-lg text-xs font-bold transition-all shadow-neon-green flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Refill 500 Credits</span>
                </button>
              </div>

              {/* Tier 3: Unlimited Pass */}
              <div className="p-4 rounded-xl border border-brand-purple/40 bg-brand-purple/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-purple">Career Pass</span>
                    <span className="text-xs font-bold text-white font-mono">$19 / mo</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-2">Unlimited</div>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mb-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-purple shrink-0" />
                      Infinite JD Tailoring
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-purple shrink-0" />
                      Voice Mock Interviews
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-brand-purple shrink-0" />
                      1-on-1 Recruiter Parity
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSimulatePurchase('Career Pass', 1000)}
                  disabled={refilling}
                  className="w-full bg-brand-purple hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unlock Unlimited</span>
                </button>
              </div>
            </div>
          </div>

          {/* SaaS Trust Badges */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Encrypted Checkout &bull; 100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span>Visa &bull; Mastercard &bull; UPI &bull; Stripe</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-dark-700 bg-dark-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Need custom credits for an enterprise team? Contact support.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
