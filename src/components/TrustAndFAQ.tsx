import React, { useState } from 'react';
import { Shield, ChevronDown, CheckCircle2, AlertTriangle, BookOpen, BarChart3, Activity, Award } from 'lucide-react';

export const TrustAndFAQ: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I access locked prediction packages?',
      a: 'You can access predictions either by joining our Standard or VIP Elite monthly membership, or by purchasing a Single Ticket Pass for a specific prediction package. Once your payment is verified server-side through Fapshi, your entitlement is activated instantly on your account and selections are revealed.',
    },
    {
      q: 'What is the difference between Standard and VIP membership?',
      a: 'Standard Membership gives you access to regular daily fixtures and balanced accumulators (3 to 6 matches). VIP Elite Membership unlocks all Standard predictions plus our exclusive VIP Mega Accumulators (8 to 12 matches, 30.00+ combined odds), Banker Singles, high-roller tactical breakdowns, and priority releases.',
    },
    {
      q: 'Can I purchase a single prediction package without a monthly subscription?',
      a: 'Yes! Our Pay-Per-Prediction option allows you to purchase individual prediction tickets (3,500 XAF) with zero recurring commitment. You retain lifetime access to view and analyze that specific ticket.',
    },
    {
      q: 'What payment methods does Fapshi support?',
      a: 'Through Fapshi, we support instant mobile money payments including MTN Mobile Money (MoMo), Orange Money, Express Union Mobile, as well as international Visa and Mastercard payments. All transactions are securely processed with 256-bit encryption.',
    },
    {
      q: 'Are your football predictions guaranteed to win?',
      a: 'No, and we strictly refuse to make false claims. No legitimate sports analyst can guarantee sports outcomes. Our predictions are the product of rigorous mathematical modeling, expected goals (xG) evaluation, tactical analysis, and team news. We focus on long-term positive expected value (+EV) and disciplined bankroll management.',
    },
    {
      q: 'How often are new prediction dossiers published?',
      a: 'New prediction packages are published daily between 10:00 AM and 12:00 PM GMT, covering all major European leagues (Premier League, La Liga, Champions League, Serie A, Bundesliga) and high-liquidity cup competitions.',
    },
    {
      q: 'How do I manage my subscription or request assistance?',
      a: 'You can review active subscriptions, payment receipts, and package history directly inside your Member Dashboard. For customer support or inquiries, our dedicated team is available 24/7.',
    },
  ];

  return (
    <div className="space-y-16 py-16 border-b border-neutral-900 bg-black">
      {/* 1. HOW IT WORKS SECTION */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            Disciplined Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            How ApexPicks Intelligence Operates
          </h2>
          <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
            A transparent four-step workflow built on data modeling, strict server verification, and instant access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-black border border-neutral-800 relative">
            <span className="text-3xl font-extrabold text-amber-500/30 font-mono block mb-3">01</span>
            <h3 className="text-base font-bold text-white mb-2">Statistical Modeling</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our analysts assess team form, expected goals (xG), tactical matchups, injury reports, and referee bias across premier fixtures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black border border-neutral-800 relative">
            <span className="text-3xl font-extrabold text-amber-500/30 font-mono block mb-3">02</span>
            <h3 className="text-base font-bold text-white mb-2">Package Curation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Selections are grouped into Standard, VIP Elite, or Single Ticket packages with verified combined odds and confidence ratings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black border border-neutral-800 relative">
            <span className="text-3xl font-extrabold text-amber-500/30 font-mono block mb-3">03</span>
            <h3 className="text-base font-bold text-white mb-2">Instant Fapshi Unlock</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pay securely using MTN MoMo, Orange Money, or credit cards. The backend verifies the transaction and grants server-side entitlement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black border border-neutral-800 relative">
            <span className="text-3xl font-extrabold text-amber-500/30 font-mono block mb-3">04</span>
            <h3 className="text-base font-bold text-white mb-2">Tactical Execution</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gain full access to the teams, bookmaker markets, exact selections, odds, and disciplined bankroll staking recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* 2. RESPONSIBLE GAMBLING & ETHICAL TRANSPARENCY NOTICE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Responsible Sports Analysis Commitment</h3>
              <p className="text-xs text-neutral-400 font-mono">18+ Only • Zero Tolerance for Scams</p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            ApexPicks operates as a quantitative sports research publication. We do not engage in "fixed match" deceptions or promise guaranteed returns. All betting carries inherent financial risk. Sports wagers should only ever be placed with capital you can comfortably afford to lose. If sports betting is no longer enjoyable or is causing financial stress, please seek assistance from certified support organizations.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-800/80">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified Outcomes
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" /> No False Guarantees
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Award className="w-3.5 h-3.5" /> Strict Bankroll Guidelines
            </span>
          </div>
        </div>
      </section>

      {/* 3. FAQ ACCORDION */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            Clear Answers
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-black border border-neutral-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
