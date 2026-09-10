import React, { useEffect, useState } from 'react';
import { PredictionPackage, PredictionMatch } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  Lock,
  Unlock,
  Crown,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

interface PredictionDetailModalProps {
  packageId: number | null;
  onClose: () => void;
  onUnlock: (pkg: PredictionPackage) => void;
}

export const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({ packageId, onClose, onUnlock }) => {
  const { token, demoRole } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pkg, setPkg] = useState<PredictionPackage | null>(null);
  const [matches, setMatches] = useState<PredictionMatch[]>([]);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [accessReason, setAccessReason] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!packageId) return;

    setLoading(true);
    setError(null);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (demoRole) {
      headers['x-demo-role'] = demoRole;
    }

    fetch(`/api/predictions/${packageId}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load prediction details');
        return res.json();
      })
      .then((data) => {
        setPkg(data.package);
        setHasAccess(data.hasAccess);
        setAccessReason(data.reason);
        setMatches(data.matches || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [packageId, token, demoRole]);

  if (!packageId) return null;

  const copySlip = () => {
    if (!pkg || !matches.length) return;
    const text = `🏆 ${pkg.title}\nCombined Odds: ${pkg.combinedOdds}\n\n` +
      matches.map((m, i) => `${i + 1}. ${m.homeTeam} vs ${m.awayTeam}\n   Pick: ${m.market} - ${m.selection} @ ${m.odds}\n   Kickoff: ${m.kickoffTime} (${m.league})`).join('\n\n') +
      `\n\nVerified by ApexPicks Pro`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${hasAccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {hasAccess ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {pkg ? pkg.title : 'Prediction Analysis'}
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                {pkg ? `${pkg.matchCount} Matches • Combined Odds: ${pkg.combinedOdds}` : 'Loading...'}
              </p>
            </div>
          </div>
          <button
            id="close-prediction-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-neutral-400 font-mono">Verifying authorization &amp; decrypting match selections...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          ) : !hasAccess ? (
            // LOCKED STATE (Access Required)
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-extrabold text-white">This Prediction Package is Locked</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The match selections, bookmaker markets, and tactical dossiers are protected by server-side authorization.
                  Unlock access to instantly reveal the complete slip.
                </p>
              </div>

              {/* Package Snapshot */}
              {pkg && (
                <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Category:</span>
                    <span className="text-white font-semibold">{pkg.category}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Selections Count:</span>
                    <span className="text-white font-semibold">{pkg.matchCount} Matches</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Combined Odds:</span>
                    <span className="text-amber-400 font-bold text-sm">{pkg.combinedOdds}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Kickoff Window:</span>
                    <span className="text-white">{pkg.kickoffWindow}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Confidence Level:</span>
                    <span className="text-emerald-400 font-bold">{pkg.confidence}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="unlock-now-modal-btn"
                  onClick={() => {
                    onClose();
                    if (pkg) onUnlock(pkg);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  {pkg?.accessLevel === 'vip'
                    ? 'Unlock with VIP Elite Pass'
                    : `Unlock Package (${pkg?.price.toLocaleString()} XAF)`}
                </button>

                <button
                  id="cancel-modal-btn"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-sm transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            // UNLOCKED STATE (Full matches revealed)
            <div className="space-y-6">
              {/* Access Verified Header Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Access Verified: Active via {accessReason ? accessReason.replace(/_/g, ' ').toUpperCase() : 'VIP PASS'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="copy-slip-btn"
                    onClick={copySlip}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Slip Copied!' : 'Copy Slip'}</span>
                  </button>
                </div>
              </div>

              {/* Matches List */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Individual Match Selections ({matches.length})
                </h4>

                {matches.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-colors space-y-3"
                  >
                    {/* League & Kickoff */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">
                        {m.league}
                      </span>
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {m.kickoffTime}
                      </span>
                    </div>

                    {/* Match Fixture Title */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {m.homeTeam} <span className="text-amber-400 font-normal text-sm">vs</span> {m.awayTeam}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono text-neutral-400 block">Odds</span>
                        <span className="text-base font-extrabold text-amber-400 font-mono">
                          {m.odds}
                        </span>
                      </div>
                    </div>

                    {/* Market & Recommended Selection */}
                    <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800/90 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-neutral-500 block">Target Market</span>
                        <span className="text-xs font-semibold text-neutral-300">{m.market}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-neutral-500 block">Our Selection</span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                          {m.selection}
                        </span>
                      </div>
                    </div>

                    {/* Tactical Analysis Dossier */}
                    {m.analysis && (
                      <div className="text-xs text-neutral-400 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/50 leading-relaxed font-normal">
                        <span className="font-semibold text-neutral-300 font-mono block mb-1">
                          Tactical Intelligence &amp; Form Note:
                        </span>
                        {m.analysis}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Combined Accumulator Staking Summary */}
              {pkg && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-neutral-950 to-neutral-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-300 font-semibold block">Total Ticket Value</span>
                      <div className="text-2xl font-extrabold text-white font-mono">
                        {pkg.combinedOdds} <span className="text-xs font-sans text-neutral-400 font-normal">Combined Decimal Odds</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block">Recommended Stake</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">1.5% - 2.5% of Bankroll</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-2 font-mono">
                    ⚠️ Disciplined bankroll management is essential. High combined accumulators carry inherent variance. Never wager money you cannot afford to lose.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
