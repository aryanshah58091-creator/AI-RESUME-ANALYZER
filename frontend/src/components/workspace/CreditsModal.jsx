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
  RefreshCw,
  Lock,
  ArrowLeft,
  Smartphone,
  Building2,
  QrCode,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CreditsModal({ isOpen, onClose }) {
  const { aiCredits, refillCredits, sandboxClaimed } = useAuth();
  const [refilling, setRefilling] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Checkout Simulation State
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isOpen) return null;

  const handleClaimSandbox = async () => {
    if (sandboxClaimed) {
      setErrorMsg('🔒 1-Time Limit Reached: Free Sandbox Refill has already been claimed for this account.');
      return;
    }

    setRefilling(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await refillCredits(50, { is_sandbox: true });
      if (res.success) {
        setStatusMsg(`🎉 Claimed 1-Time Free Sandbox Refill (+50 Credits)! New Wallet Balance: ${res.ai_credits}`);
        setTimeout(() => setStatusMsg(''), 5000);
      } else {
        setErrorMsg(res.message || 'Free Sandbox Refill is already claimed or unavailable.');
      }
    } catch (err) {
      setErrorMsg('Failed to process sandbox refill. Please try again.');
    } finally {
      setRefilling(false);
    }
  };

  const handleStartCheckout = (plan) => {
    setErrorMsg('');
    setStatusMsg('');
    setPaymentSuccess(null);
    setCheckoutPlan(plan);
  };

  const handleExecuteSimulatedPayment = async () => {
    if (!checkoutPlan) return;
    setSimulatingPayment(true);

    try {
      // Simulate real gateway processing delay (1.2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await refillCredits(checkoutPlan.credits, { is_purchase: true });
      if (res.success) {
        const txnId = 'TXN_SIM_' + Math.floor(100000 + Math.random() * 900000);
        setPaymentSuccess({
          txnId,
          planName: checkoutPlan.name,
          credits: checkoutPlan.credits,
          amount: checkoutPlan.priceINR,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setErrorMsg('Simulated transaction failed: ' + (res.message || 'Unknown error'));
      }
    } catch (err) {
      setErrorMsg('Payment gateway error. Please try again.');
    } finally {
      setSimulatingPayment(false);
    }
  };

  const handleCloseAll = () => {
    setCheckoutPlan(null);
    setPaymentSuccess(null);
    setStatusMsg('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-700 bg-dark-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {checkoutPlan ? 'Simulated Payment Gateway' : 'AI Credits & Upgrade Store'}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-green/10 text-brand-green border border-brand-green/30 uppercase">
                  {checkoutPlan ? 'Test Checkout Mode' : 'Freemium SaaS'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {checkoutPlan
                  ? 'Zero live KYC needed &bull; Complete test payment to recharge AI credits instantly'
                  : '100 Free credits gifted per account &bull; 10 Credits per AI optimization task'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          
          {/* Status / Error Alerts */}
          {statusMsg && (
            <div className="p-3 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VIEW A: SUCCESS CONFIRMATION */}
          {paymentSuccess ? (
            <div className="p-6 rounded-2xl bg-dark-900/90 border border-brand-green/40 flex flex-col items-center text-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-brand-green/10 border-2 border-brand-green flex items-center justify-center text-brand-green">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full border border-brand-green/30">
                  Simulated Gateway Approved
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  Payment Confirmed: +{paymentSuccess.credits} Credits Added!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your AI balance has been recharged. You can now run JD Auto-Tailor and AI Mock Interviews.
                </p>
              </div>

              <div className="w-full max-w-sm bg-dark-800 border border-dark-700 rounded-xl p-4 text-xs font-mono space-y-2 text-left">
                <div className="flex justify-between text-slate-400">
                  <span>Transaction ID:</span>
                  <span className="text-white font-bold">{paymentSuccess.txnId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Plan:</span>
                  <span className="text-brand-green font-bold">{paymentSuccess.planName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount Paid:</span>
                  <span className="text-white font-bold">{paymentSuccess.amount} (Test)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Updated AI Balance:</span>
                  <span className="text-amber-400 font-bold">{aiCredits} Credits</span>
                </div>
              </div>

              <button
                onClick={handleCloseAll}
                className="w-full max-w-sm bg-brand-green hover:bg-emerald-400 text-dark-900 font-bold py-2.5 rounded-xl text-xs transition-all shadow-neon-green"
              >
                Return to Workspace
              </button>
            </div>
          ) : checkoutPlan ? (
            /* VIEW B: SIMULATED CHECKOUT MODAL */
            <div className="flex flex-col gap-4 animate-fadeIn">
              {/* Back Link */}
              <button
                onClick={() => setCheckoutPlan(null)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors w-fit"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Plans</span>
              </button>

              {/* Sandbox Notice Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-amber-300">
                    Simulated Sandbox Mode (No Real Money Charged)
                  </h4>
                  <p className="text-slate-300 mt-0.5">
                    Live Razorpay merchant KYC is currently pending. This test gateway securely simulates the complete checkout and adds <strong className="text-white">{checkoutPlan.credits} credits</strong> to your account for immediate testing.
                  </p>
                </div>
              </div>

              {/* Order Summary & Payment Mode Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order Summary */}
                <div className="p-4 rounded-xl border border-dark-700 bg-dark-900/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Order Summary
                    </span>
                    <h3 className="text-base font-bold text-white">{checkoutPlan.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{checkoutPlan.credits} AI Optimization Credits</p>

                    <div className="mt-4 pt-3 border-t border-dark-700 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Plan Price</span>
                        <span className="text-white font-mono">{checkoutPlan.priceINR}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Platform Fee</span>
                        <span className="text-brand-green font-mono">FREE (Sandbox)</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Applicable GST (18%)</span>
                        <span className="text-slate-500 font-mono">₹0.00 (Test)</span>
                      </div>
                      <div className="flex justify-between text-white font-bold pt-2 border-t border-dark-700 text-sm">
                        <span>Total Payable:</span>
                        <span className="text-brand-green font-mono">{checkoutPlan.priceINR}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Instant credit activation upon approval</span>
                  </div>
                </div>

                {/* Simulated Payment Method Selection */}
                <div className="p-4 rounded-xl border border-dark-700 bg-dark-900/60 flex flex-col gap-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Select Test Payment Method
                  </span>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-brand-green bg-brand-green/10 text-brand-green'
                          : 'border-dark-700 bg-dark-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-brand-green bg-brand-green/10 text-brand-green'
                          : 'border-dark-700 bg-dark-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-brand-green bg-brand-green/10 text-brand-green'
                          : 'border-dark-700 bg-dark-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>
                  </div>

                  {/* Tab Content */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-2 mt-1">
                      <label className="text-[11px] text-slate-400 block">Simulated UPI Virtual Payment Address (VPA):</label>
                      <input
                        type="text"
                        readOnly
                        value="testuser@okhdfcbank"
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
                      />
                      <div className="flex gap-2 text-[10px] text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-dark-800 border border-dark-700">Google Pay</span>
                        <span className="px-2 py-0.5 rounded bg-dark-800 border border-dark-700">PhonePe</span>
                        <span className="px-2 py-0.5 rounded bg-dark-800 border border-dark-700">Paytm</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-2 mt-1">
                      <label className="text-[11px] text-slate-400 block">Simulated Card Details:</label>
                      <input
                        type="text"
                        readOnly
                        value="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value="12/28"
                          className="w-1/2 bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                        />
                        <input
                          type="text"
                          readOnly
                          value="CVV: 888"
                          className="w-1/2 bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-2 mt-1">
                      <label className="text-[11px] text-slate-400 block">Select Simulated Bank:</label>
                      <select
                        disabled
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      >
                        <option>HDFC Bank (Sandbox Instant)</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                      </select>
                    </div>
                  )}

                  {/* Payment Trigger Button */}
                  <button
                    type="button"
                    onClick={handleExecuteSimulatedPayment}
                    disabled={simulatingPayment}
                    className="mt-2 w-full bg-brand-green hover:bg-emerald-400 text-dark-900 font-bold py-2.5 rounded-xl text-xs transition-all shadow-neon-green flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {simulatingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-dark-900" />
                        <span>Simulating Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Complete Test Payment ({checkoutPlan.priceINR})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW C: STANDARD PLANS & SANDBOX MODAL */
            <>
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
                    JD Auto-Tailor, Smart Rewriter &amp; Mock Interview use <strong className="text-amber-300">10 credits</strong> per task.
                  </p>
                </div>

                {/* 1-Time Free Sandbox Refill Button */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <button
                    onClick={handleClaimSandbox}
                    disabled={refilling || sandboxClaimed}
                    className={`font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 ${
                      sandboxClaimed
                        ? 'bg-dark-700 text-slate-400 border border-dark-600 cursor-not-allowed opacity-80'
                        : 'bg-amber-500 hover:bg-amber-400 text-dark-900'
                    }`}
                    title={
                      sandboxClaimed
                        ? 'Free Sandbox Refill has already been claimed for this account.'
                        : 'Claim 1-time Free Sandbox Refill (+50 Credits)'
                    }
                  >
                    {refilling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-dark-900" />
                        <span>Verifying Sandbox...</span>
                      </>
                    ) : sandboxClaimed ? (
                      <>
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>🔒 Sandbox Refill Claimed (1-Time Limit)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-dark-900" />
                        <span>Free Sandbox Refill (+50)</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-400">
                    {sandboxClaimed
                      ? '1 trial refill per account reached &bull; Upgrade below'
                      : '⚡ Available once per user account'}
                  </span>
                </div>
              </div>

              {/* Pricing Tiers Grid */}
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-teal" />
                  Upgrade Credit Packs &amp; Passes
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
                          100 Free credits on signup
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                          10 AI tasks (10 cr / task)
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                          ATS Diagnostics (0 cr)
                        </li>
                      </ul>
                    </div>
                    <button
                      disabled
                      className="w-full bg-dark-700 text-slate-500 py-2 rounded-lg text-xs font-semibold cursor-not-allowed"
                    >
                      Default Active
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
                        <span className="text-xs font-bold text-white font-mono">₹499 / $9</span>
                      </div>
                      <div className="text-xl font-black text-white mb-2">500 Credits</div>
                      <ul className="text-[11px] text-slate-300 space-y-1.5 mb-4">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                          50 Full JD Auto-Tailors
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                          50 Voice Mock Interviews
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-green shrink-0" />
                          Instant Priority Queuing
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() =>
                        handleStartCheckout({
                          id: 'pro_booster_500',
                          name: 'Pro Booster Pack',
                          credits: 500,
                          priceINR: '₹499',
                          priceUSD: '$9',
                        })
                      }
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
                        <span className="text-xs font-bold text-white font-mono">₹1,499 / $19</span>
                      </div>
                      <div className="text-xl font-bold text-white mb-2">1,000 Credits</div>
                      <ul className="text-[11px] text-slate-400 space-y-1.5 mb-4">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-purple shrink-0" />
                          100 High-Volume AI runs
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-purple shrink-0" />
                          Full Speech &amp; Voice Studio
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-purple shrink-0" />
                          1-on-1 Recruiter Scoring
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() =>
                        handleStartCheckout({
                          id: 'career_pass_1000',
                          name: 'Career Pass (Pro Access)',
                          credits: 1000,
                          priceINR: '₹1,499',
                          priceUSD: '$19',
                        })
                      }
                      className="w-full bg-brand-purple hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upgrade to Pro Pass</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SaaS Trust Badges */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700 text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <span>Secure 256-Bit SSL Checkout &bull; Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span>UPI &bull; RuPay &bull; Visa &bull; Mastercard</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-dark-700 bg-dark-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {checkoutPlan ? 'Simulated checkout for demo testing' : 'Need enterprise team plans? Contact support.'}
          </span>
          <button
            onClick={handleCloseAll}
            className="px-4 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
