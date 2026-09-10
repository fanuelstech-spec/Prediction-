import React from 'react';
import { Crown, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface PricingSectionProps {
  onSelectPlan: (plan: {
    productId?: number;
    packageId?: number;
    name: string;
    amount: number;
    type: 'subscription' | 'pay_per_prediction';
    tier: 'standard' | 'vip' | 'single';
  }) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { accessSummary } = useAuth();

  return (
    <section id="pricing-section" className="py-16 md:py-24 border-b border-neutral-900 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Transparent Subscription Plans
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Institutional Football Intel.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
              Clear Pricing.
            </span>
          </h2>
          <p className="mt-4 text-base text-neutral-400 leading-relaxed">
            Choose your access tier. Enjoy instant, automated unlocks powered by Fapshi payment gateway. Cancel or upgrade anytime.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* 1. STANDARD PASS */}
          <div className="rounded-2xl bg-black border border-neutral-800 hover:border-neutral-700 p-6 sm:p-8 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                  Standard Access
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">Monthly Standard</h3>
              <p className="text-xs text-neutral-400 mt-2 min-h-[36px]">
                Essential daily football analysis and balanced accumulators for regular bettors.
              </p>

              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-extrabold text-white">5,000</span>
                <span className="text-sm font-semibold text-neutral-400">XAF / month</span>
              </div>

              <div className="mt-8 space-y-3 text-xs text-neutral-300 border-t border-neutral-800/80 pt-6">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access to all Standard packages</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 to 6 match accumulators (3.00 - 10.00 odds)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full market selections &amp; expected goals (xG)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Fapshi Mobile Money unlock</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-500">
                  <span className="w-4 h-4 text-center font-mono">✕</span>
                  <span>VIP High-Roller Mega Multis excluded</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800">
              <button
                id="btn-buy-standard-plan"
                onClick={() =>
                  onSelectPlan({
                    productId: 1,
                    name: 'Standard Monthly Pass',
                    amount: 5000,
                    type: 'subscription',
                    tier: 'standard',
                  })
                }
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 ${
                  accessSummary?.isStandard && !accessSummary?.isVip
                    ? 'bg-neutral-900 text-emerald-400 cursor-default border border-neutral-800'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800'
                }`}
              >
                {accessSummary?.isStandard && !accessSummary?.isVip ? (
                  <span>Current Active Plan</span>
                ) : (
                  <>
                    <span>Subscribe Standard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. VIP ELITE (FEATURED) */}
          <div className="relative rounded-2xl bg-black border-2 border-amber-500/60 p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10 scale-[1.02]">
            {/* Top Featured Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-extrabold text-[11px] uppercase tracking-wider font-mono shadow-md shadow-amber-500/30 flex items-center gap-1">
              <Crown className="w-3 h-3 fill-neutral-950" /> Most Popular • Full Access
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-mono px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40">
                  VIP Elite Pass
                </span>
                <span className="text-[11px] text-amber-400 font-semibold font-mono">Universal Access</span>
              </div>

              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                VIP Monthly Pass <Crown className="w-5 h-5 text-amber-400" />
              </h3>
              <p className="text-xs text-neutral-400 mt-2 min-h-[36px]">
                Complete unrestricted access to all VIP Mega Multis, Banker Singles, and high-yield predictions.
              </p>

              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-extrabold text-amber-300">15,000</span>
                <span className="text-sm font-semibold text-neutral-400">XAF / month</span>
              </div>

              <div className="mt-8 space-y-3 text-xs text-neutral-200 border-t border-neutral-800/80 pt-6">
                <div className="flex items-center gap-2.5 font-medium text-amber-200">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ALL VIP &amp; Standard packages automatically unlocked</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>VIP Weekend Mega Accumulators (30.00+ Combined Odds)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>High-roller Banker Singles &amp; Early Market Value</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Detailed tactical dossiers &amp; staking strategy guides</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Priority access before odds compress in sportsbooks</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800">
              <button
                id="btn-buy-vip-plan"
                onClick={() =>
                  onSelectPlan({
                    productId: 2,
                    name: 'VIP Elite Monthly Pass',
                    amount: 15000,
                    type: 'subscription',
                    tier: 'vip',
                  })
                }
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                  accessSummary?.isVip
                    ? 'bg-neutral-900 text-amber-400 cursor-default border border-neutral-800'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 shadow-amber-500/20'
                }`}
              >
                {accessSummary?.isVip ? (
                  <span>VIP Elite Active</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Join VIP Elite Pass</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. PAY-PER-PREDICTION */}
          <div className="rounded-2xl bg-black border border-neutral-800 hover:border-neutral-700 p-6 sm:p-8 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30">
                  Pay-Per-Prediction
                </span>
                <span className="text-[11px] text-neutral-400">Single Pass</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Single Ticket Pass</h3>
              <p className="text-xs text-neutral-400 mt-2 min-h-[36px]">
                Unlock any single prediction package without any recurring subscription commitment.
              </p>

              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-extrabold text-white">3,500</span>
                <span className="text-sm font-semibold text-neutral-400">XAF / package</span>
              </div>

              <div className="mt-8 space-y-3 text-xs text-neutral-300 border-t border-neutral-800/80 pt-6">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Instant unlock for chosen prediction package</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Lifetime access to that specific ticket</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>All match selections, odds &amp; analysis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>One-time payment via Fapshi (No auto-renew)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800">
              <button
                id="btn-buy-single-plan"
                onClick={() =>
                  onSelectPlan({
                    productId: 3,
                    name: 'Single Prediction Ticket',
                    amount: 3500,
                    type: 'pay_per_prediction',
                    tier: 'single',
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-wide transition-all border border-neutral-800 flex items-center justify-center gap-2"
              >
                <span>Unlock Single Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Security / Fapshi Guarantee Banner */}
        <div className="mt-12 p-4 rounded-xl bg-black border border-neutral-800 max-w-3xl mx-auto flex items-center justify-center gap-4 text-xs text-neutral-400 text-center flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fapshi Certified Secure Checkout</span>
          </div>
          <span className="text-neutral-700">•</span>
          <span>Supports MTN MoMo, Orange Money, Express Union &amp; Cards</span>
          <span className="text-neutral-700">•</span>
          <span>Instant Server Entitlement</span>
        </div>
      </div>
    </section>
  );
};
