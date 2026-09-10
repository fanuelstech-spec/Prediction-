import React from 'react';
import { PredictionPackage } from '../types.ts';
import { Lock, Unlock, Crown, Sparkles, Clock, Calendar, ChevronRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PredictionCardProps {
  pkg: PredictionPackage;
  onView: (pkg: PredictionPackage) => void;
  onUnlock: (pkg: PredictionPackage) => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ pkg, onView, onUnlock }) => {
  const isVip = pkg.accessLevel === 'vip';
  const isPPV = pkg.accessLevel === 'pay_per_view';
  const hasAccess = Boolean(pkg.hasAccess);

  const getConfidenceBadge = () => {
    switch (pkg.confidence) {
      case 'Maximum':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Maximum Conviction
          </span>
        );
      case 'Very High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Very High Confidence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> High Confidence
          </span>
        );
    }
  };

  const getTierBadge = () => {
    if (isVip) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
          <Crown className="w-3 h-3 text-amber-400" /> VIP Elite
        </span>
      );
    }
    if (isPPV) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
          Single Multi Ticket
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-emerald-400" /> Standard
      </span>
    );
  };

  return (
    <div
      id={`prediction-card-${pkg.id}`}
      className={`group relative rounded-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden border ${
        isVip
          ? 'bg-black border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5'
          : 'bg-black border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          {getTierBadge()}
          {getConfidenceBadge()}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
          {pkg.title}
        </h3>

        <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {pkg.shortDescription}
        </p>

        {/* Kickoff & Date Details */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{pkg.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{pkg.kickoffWindow}</span>
          </div>
        </div>

        {/* Odds & Matches Key Metrics Bar */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-black border border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">Selections</span>
            <span className="text-base font-extrabold text-white font-mono">
              {pkg.matchCount} <span className="text-xs font-normal text-neutral-400 font-sans">Matches</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">Combined Odds</span>
            <span className="text-base font-extrabold text-amber-400 font-mono tracking-tight">
              {pkg.combinedOdds}
            </span>
          </div>
        </div>
      </div>

      {/* Locked Match Preview Teaser or Unlocked Teaser */}
      <div className="px-5 py-3 border-t border-neutral-900 bg-black">
        {hasAccess ? (
          <div className="flex items-center justify-between text-xs py-1">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Entitlement Verified Active
            </span>
            <span className="text-neutral-400 text-[11px]">Ready to analyze</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 font-medium text-neutral-300">
                <Lock className="w-3 h-3 text-amber-400" /> Matches Protected ({pkg.matchCount})
              </span>
              <span className="text-neutral-500 text-[10px] font-mono">Server-side masked</span>
            </div>

            {/* Frosted obscured row previews */}
            <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-black p-2.5 text-xs text-neutral-500 font-mono space-y-1">
              <div className="flex items-center justify-between opacity-60 filter blur-[0.5px]">
                <span>Match 1: Marquee Fixture</span>
                <span className="text-neutral-600">Odds: 🔒.🔒🔒</span>
              </div>
              <div className="flex items-center justify-between opacity-40 filter blur-[1px]">
                <span>Match 2: Primetime League Clash</span>
                <span className="text-neutral-600">Odds: 🔒.🔒🔒</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-center">
                <span className="text-[11px] font-semibold text-neutral-300 bg-black px-2.5 py-0.5 rounded-full border border-neutral-700 shadow-sm flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Access Required to Reveal
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      <div className="p-5 pt-3 bg-black">
        {hasAccess ? (
          <button
            id={`btn-view-prediction-${pkg.id}`}
            onClick={() => onView(pkg)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5" />
            View {pkg.matchCount} Selections &amp; Analysis
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        ) : (
          <div className="space-y-2">
            <button
              id={`btn-unlock-prediction-${pkg.id}`}
              onClick={() => onUnlock(pkg)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                isVip
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {isVip ? 'Unlock with VIP Elite Pass' : `Unlock Package (${pkg.price.toLocaleString()} XAF)`}
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
