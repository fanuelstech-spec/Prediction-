import React, { useEffect, useState } from 'react';
import { Shield, Crown, ChevronRight, Zap, Target, Award, Lock, Sparkles } from 'lucide-react';

interface HeroProps {
  onViewPredictions: () => void;
  onExploreVip: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewPredictions, onViewPredictions: scrollToPredictions, onExploreVip }) => {
  const [stats, setStats] = useState<{
    activePredictions: number;
    totalMatchesCovered: number;
    totalMembers: number;
    vipMembers: number;
    avgCombinedOdds: string;
    winRateMetric: string;
  }>({
    activePredictions: 5,
    totalMatchesCovered: 148,
    totalMembers: 2840,
    vipMembers: 412,
    avgCombinedOdds: '24.80',
    winRateMetric: '78.6% 30-Day Win Rate',
  });

  useEffect(() => {
    fetch('/api/stats/live')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStats((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-800/80 bg-neutral-950">
      {/* Cinematic Football Stadium Night Lighting Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen bg-cover bg-center"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08), transparent 50%), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      {/* Dark Gradient Grid & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/90 to-neutral-950 pointer-events-none" />

      {/* Pitch Lines Vector Accent */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full border border-neutral-800/40 pointer-events-none opacity-40 blur-[1px]" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full border border-neutral-800/30 pointer-events-none opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Intelligence Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-neutral-300 mb-6 backdrop-blur-md shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
          <span className="text-amber-300 font-semibold">Institutional Grade Analysis</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 font-mono">xG Simulation Engine v4.2</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Smarter Football Predictions.{' '}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            One Place.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Access carefully curated football betting tips, premium accumulators and VIP predictions.
          Protected by server-side verification and secured by Fapshi payment infrastructure.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-cta-view-predictions"
            onClick={scrollToPredictions}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-neutral-950" />
            View Predictions
          </button>

          <button
            id="hero-cta-explore-vip"
            onClick={onExploreVip}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-700/80 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Explore VIP
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Server-side Protected Selections</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Fapshi Secured Mobile Money &amp; Cards</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Zero Unsolicited Hidden Fees</span>
          </div>
        </div>

        {/* Live Platform Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Today's Predictions</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.activePredictions} <span className="text-xs font-sans text-neutral-400 font-normal">Active Packs</span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-mono">Curated Daily Dossiers</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Active Members</span>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.totalMembers.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-mono">Global Sports Analysts</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>VIP Members</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {stats.vipMembers.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-mono">All-Inclusive Passholders</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
              <span>Performance</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.avgCombinedOdds} <span className="text-xs font-sans text-neutral-400 font-normal">Avg Odds</span>
            </div>
            <p className="text-[11px] text-emerald-500/90 mt-1 font-mono">{stats.winRateMetric}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
