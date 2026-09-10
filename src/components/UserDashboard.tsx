import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { PredictionPackage, PaymentRecord, SubscriptionRecord } from '../types.ts';
import {
  LayoutDashboard,
  Crown,
  Sparkles,
  Unlock,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface UserDashboardProps {
  onViewPrediction: (pkg: PredictionPackage) => void;
  onUpgradeToVip: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onViewPrediction, onUpgradeToVip }) => {
  const { user, accessSummary, token, demoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'subscriptions' | 'payments'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [unlockedPackages, setUnlockedPackages] = useState<PredictionPackage[]>([]);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);
  const [subsList, setSubsList] = useState<SubscriptionRecord[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      else if (demoRole) headers['x-demo-role'] = demoRole;

      const res = await fetch('/api/user/dashboard', { headers });
      if (res.ok) {
        const data = await res.json();
        setUnlockedPackages(data.unlockedPackages || []);
        setPaymentsList(data.payments || []);
        setSubsList(data.subscriptions || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, demoRole]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Member Dashboard
            </h1>
            {accessSummary?.isVip ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/40">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP ELITE
              </span>
            ) : accessSummary?.isStandard ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> STANDARD ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
                FREE VISITOR
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Signed in as: <span className="text-white">{user?.email || 'Active Analyst'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="refresh-dashboard-btn"
            onClick={fetchDashboardData}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {!accessSummary?.isVip && (
            <button
              id="dash-upgrade-vip-btn"
              onClick={onUpgradeToVip}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade to VIP</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-neutral-800/80 mt-6 pb-2">
        <button
          id="tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Overview
        </button>

        <button
          id="tab-my-predictions"
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'predictions'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          My Predictions ({unlockedPackages.length})
        </button>

        <button
          id="tab-subscriptions"
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'subscriptions'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          Subscriptions
        </button>

        <button
          id="tab-payments"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Payments ({paymentsList.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[11px] uppercase font-mono text-neutral-400 block mb-1">Subscription Tier</span>
                <div className="text-xl font-extrabold text-white flex items-center gap-2">
                  {accessSummary?.isVip ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Crown className="w-4 h-4" /> VIP Elite
                    </span>
                  ) : accessSummary?.isStandard ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Standard
                    </span>
                  ) : (
                    <span className="text-neutral-400">Free Visitor</span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                  {accessSummary?.activeSubscription?.endDate
                    ? `Renews: ${new Date(accessSummary.activeSubscription.endDate).toLocaleDateString()}`
                    : 'No active recurring term'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[11px] uppercase font-mono text-neutral-400 block mb-1">Unlocked Packages</span>
                <div className="text-xl font-extrabold text-white font-mono">
                  {accessSummary?.isVip ? 'Universal (All Unlocked)' : unlockedPackages.length}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">Real-time Entitlement Active</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[11px] uppercase font-mono text-neutral-400 block mb-1">Account Status</span>
                <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">Role: {user?.role || 'Member'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[11px] uppercase font-mono text-neutral-400 block mb-1">Payment Method</span>
                <div className="text-xl font-extrabold text-white font-mono flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" /> Fapshi
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">MTN / Orange MoMo &amp; Cards</p>
              </div>
            </div>

            {/* Quick Access to Accessible Predictions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Your Accessible Prediction Packages ({unlockedPackages.length})
                </h3>
                <button
                  onClick={() => setActiveTab('predictions')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {unlockedPackages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">No active unlocked predictions yet</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Subscribe to Standard or VIP, or unlock a single prediction package to start accessing matches and analytical dossiers.
                  </p>
                  <button
                    onClick={onUpgradeToVip}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                  >
                    View Packages &amp; Pricing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedPackages.slice(0, 3).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                          <span className="text-emerald-400 font-semibold">● UNLOCKED</span>
                          <span className="text-neutral-400">{pkg.matchCount} Matches</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{pkg.title}</h4>
                        <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs">
                          <span className="text-neutral-400">Odds:</span>
                          <span className="text-amber-400 font-bold">{pkg.combinedOdds}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-800">
                        <button
                          onClick={() => onViewPrediction(pkg)}
                          className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>View Selections &amp; Dossier</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              All Unlocked Predictions ({unlockedPackages.length})
            </h3>
            {unlockedPackages.length === 0 ? (
              <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center space-y-3">
                <p className="text-xs text-neutral-400">You do not currently hold any active package access.</p>
                <button
                  onClick={onUpgradeToVip}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Unlock a Package
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                        <span className="text-emerald-400 font-semibold">● UNLOCKED</span>
                        <span className="text-neutral-400">{pkg.matchCount} Matches</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{pkg.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{pkg.shortDescription}</p>
                      <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs">
                        <span className="text-neutral-400">Combined Odds:</span>
                        <span className="text-amber-400 font-bold">{pkg.combinedOdds}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800">
                      <button
                        onClick={() => onViewPrediction(pkg)}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>View Selections &amp; Dossier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6 max-w-3xl">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Active Subscription</h3>
                  <p className="text-xs text-neutral-400">Current tier and renewal status</p>
                </div>
                {accessSummary?.isVip ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    VIP Elite
                  </span>
                ) : accessSummary?.isStandard ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Standard
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400">
                    Free / Pay-Per-View Only
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Plan Rate:</span>
                  <span className="text-white font-semibold">
                    {accessSummary?.isVip ? '15,000 XAF / month' : accessSummary?.isStandard ? '5,000 XAF / month' : 'Pay-per-pack'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Provider:</span>
                  <span className="text-amber-400">Fapshi Payment Gateway</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Universal Access:</span>
                  <span className="text-white">{accessSummary?.isVip ? 'Enabled (All Predictions Unlocked)' : 'Standard Only'}</span>
                </div>
              </div>

              {!accessSummary?.isVip && (
                <div className="pt-2">
                  <button
                    onClick={onUpgradeToVip}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade to VIP Elite Pass (15,000 XAF/mo)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Transaction History ({paymentsList.length})
            </h3>

            {paymentsList.length === 0 ? (
              <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center text-xs text-neutral-400">
                No payment transactions recorded on this account yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 text-[11px] uppercase">
                    <tr>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Provider</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 bg-neutral-900/60">
                    {paymentsList.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-850 transition-colors">
                        <td className="p-3.5 text-amber-300 font-bold">{p.reference}</td>
                        <td className="p-3.5 text-neutral-300 capitalize">{p.paymentType?.replace(/_/g, ' ')}</td>
                        <td className="p-3.5 text-white font-bold">{p.amount.toLocaleString()} {p.currency}</td>
                        <td className="p-3.5 text-neutral-400 uppercase">{p.provider}</td>
                        <td className="p-3.5">
                          {p.status === 'successful' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Successful
                            </span>
                          ) : p.status === 'pending' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                              {p.status}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-neutral-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
