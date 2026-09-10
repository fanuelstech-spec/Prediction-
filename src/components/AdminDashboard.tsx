import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { PredictionPackage } from '../types.ts';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Search,
  Crown,
  AlertTriangle,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { token, demoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'predictions' | 'users' | 'payments' | 'audit'>('analytics');
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [predictions, setPredictions] = useState<PredictionPackage[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New prediction package form state
  const [newPkg, setNewPkg] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    matchCount: 4,
    combinedOdds: '8.50',
    category: 'Premier Accumulator',
    accessLevel: 'standard' as 'standard' | 'vip' | 'pay_per_view',
    price: 3500,
    confidence: 'Very High',
    kickoffWindow: '17:30 - 21:00 GMT',
    shortDescription: '',
    matches: [
      {
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        league: 'Premier League',
        kickoffTime: '17:30 GMT',
        market: 'Over 1.5 Goals',
        selection: 'Over 1.5',
        odds: '1.32',
        confidence: 'High',
        analysis: 'High attacking rhythm expected with both sides exceeding 1.8 xG per 90.',
      },
      {
        homeTeam: 'Real Madrid',
        awayTeam: 'Real Sociedad',
        league: 'La Liga',
        kickoffTime: '20:00 GMT',
        market: 'Full Time Result',
        selection: 'Real Madrid Win',
        odds: '1.45',
        confidence: 'Very High',
        analysis: 'Madrid unbeaten at home in last 14 league fixtures.',
      },
    ],
  });

  const getHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else if (demoRole) headers['x-demo-role'] = demoRole;
    return headers;
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      const [anRes, predRes, usrRes, pmtRes, logRes] = await Promise.all([
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/predictions', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/payments', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
      ]);

      if (anRes.ok) setAnalytics(await anRes.json());
      if (predRes.ok) setPredictions(await predRes.json());
      if (usrRes.ok) setUsersList(await usrRes.json());
      if (pmtRes.ok) setPaymentsList(await pmtRes.json());
      if (logRes.ok) setAuditLogs(await logRes.json());
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, demoRole]);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/predictions', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...newPkg,
          matchCount: newPkg.matches.length,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        await fetchAdminData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to create package');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating package');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/predictions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prediction package?')) return;
    try {
      await fetch(`/api/admin/predictions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrantAccess = async (userId: number, type: 'vip_subscription' | 'standard_subscription') => {
    try {
      await fetch(`/api/admin/users/${userId}/grant-access`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type, days: 30 }),
      });
      alert(`Granted 30 days ${type.replace(/_/g, ' ')} successfully!`);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              ApexPicks Pro Administration
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                ROOT
              </span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono">
              Manage live prediction packages, member access control, and Fapshi financial auditing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Prediction</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-neutral-800 mt-6 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-neutral-900 text-white font-bold border border-neutral-800' : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Analytics Overview
        </button>

        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'predictions' ? 'bg-neutral-900 text-white font-bold border border-neutral-800' : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Predictions ({predictions.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-neutral-900 text-white font-bold border border-neutral-800' : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Members ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'payments' ? 'bg-neutral-900 text-white font-bold border border-neutral-800' : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> Payments &amp; Revenue
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-neutral-900 text-white font-bold border border-neutral-800' : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Audit Logs
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-black border border-neutral-800">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Total Users</span>
                <div className="text-3xl font-extrabold text-white font-mono">{analytics.totalUsers}</div>
                <p className="text-[11px] text-emerald-400 font-mono mt-1">+12% this week</p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-neutral-800">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">VIP Elite Members</span>
                <div className="text-3xl font-extrabold text-amber-300 font-mono">{analytics.vipSubscribers}</div>
                <p className="text-[11px] text-amber-400/90 font-mono mt-1">High retention</p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-neutral-800">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Total Revenue</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {analytics.totalRevenue?.toLocaleString()} <span className="text-xs font-sans text-neutral-400">XAF</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono mt-1">Processed via Fapshi</p>
              </div>

              <div className="p-5 rounded-2xl bg-black border border-neutral-800">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">Single Ticket Sales</span>
                <div className="text-3xl font-extrabold text-purple-400 font-mono">{analytics.predictionPurchases}</div>
                <p className="text-[11px] text-neutral-400 font-mono mt-1">Pay-per-view volume</p>
              </div>
            </div>

            {/* Recent Payments Quick Overview */}
            <div className="p-6 rounded-2xl bg-black border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Recent Fapshi Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-neutral-500 border-b border-neutral-800 text-[10px] uppercase bg-black">
                    <tr>
                      <th className="pb-2">Reference</th>
                      <th className="pb-2">User Email</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 bg-black">
                    {analytics.recentPayments?.map((p: any) => (
                      <tr key={p.id}>
                        <td className="py-2.5 text-amber-300">{p.reference}</td>
                        <td className="py-2.5 text-white">{p.userEmail}</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{p.amount.toLocaleString()} {p.currency}</td>
                        <td className="py-2.5 capitalize">{p.paymentType}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-black">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black text-neutral-400 border-b border-neutral-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5">Matches</th>
                    <th className="p-3.5">Combined Odds</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 bg-black">
                  {predictions.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-900 transition-colors">
                      <td className="p-3.5 text-neutral-500">#{p.id}</td>
                      <td className="p-3.5 text-white font-bold">{p.title}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.accessLevel === 'vip'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : p.accessLevel === 'pay_per_view'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {p.accessLevel}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-300">{p.matchCount} Matches</td>
                      <td className="p-3.5 text-amber-400 font-bold">{p.combinedOdds}</td>
                      <td className="p-3.5 text-white">{p.price.toLocaleString()} XAF</td>
                      <td className="p-3.5">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                          className="bg-black text-neutral-200 border border-neutral-800 rounded px-2 py-1 text-xs"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="in_progress">In Progress</option>
                          <option value="won">Won (Green)</option>
                          <option value="lost">Lost</option>
                          <option value="void">Void</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-neutral-400">{p.date}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeletePackage(p.id)}
                          className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-black">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black text-neutral-400 border-b border-neutral-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Active Subs</th>
                    <th className="p-3.5">Entitlements</th>
                    <th className="p-3.5">Registered</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 bg-black">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-900 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{u.displayName || 'Unnamed Analyst'}</div>
                        <div className="text-[11px] text-neutral-400">{u.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-neutral-900 border border-neutral-800 text-neutral-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-300">{u.subscriptions?.length || 0} active</td>
                      <td className="p-3.5 text-amber-400">{u.entitlementsCount || 0} granted</td>
                      <td className="p-3.5 text-neutral-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleGrantAccess(u.id, 'vip_subscription')}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold"
                          title="Grant 30 days VIP"
                        >
                          +VIP Pass
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Restore'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-black">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black text-neutral-400 border-b border-neutral-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-3.5">Reference</th>
                    <th className="p-3.5">Payer Email</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Provider</th>
                    <th className="p-3.5">Provider TransId</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 bg-black">
                  {paymentsList.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-900 transition-colors">
                      <td className="p-3.5 text-amber-300 font-bold">{p.reference}</td>
                      <td className="p-3.5 text-white">{p.userEmail || 'Guest'}</td>
                      <td className="p-3.5 text-emerald-400 font-bold">{p.amount.toLocaleString()} {p.currency}</td>
                      <td className="p-3.5 uppercase">{p.provider}</td>
                      <td className="p-3.5 text-neutral-500">{p.providerTransId || '—'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-400">{new Date(p.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Audit Trail</h3>
              <div className="divide-y divide-neutral-800">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-bold mr-2 text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-neutral-300">{log.details}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px] shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE PREDICTION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-black border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <h3 className="text-lg font-bold text-white">Create Prediction Package</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 block mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    value={newPkg.title}
                    onChange={(e) => setNewPkg({ ...newPkg, title: e.target.value })}
                    placeholder="e.g. Weekend Champions Accumulator"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newPkg.date}
                    onChange={(e) => setNewPkg({ ...newPkg, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">Combined Odds</label>
                  <input
                    type="text"
                    required
                    value={newPkg.combinedOdds}
                    onChange={(e) => setNewPkg({ ...newPkg, combinedOdds: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Access Tier</label>
                  <select
                    value={newPkg.accessLevel}
                    onChange={(e) => setNewPkg({ ...newPkg, accessLevel: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="vip">VIP</option>
                    <option value="pay_per_view">Pay-Per-View</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Price (XAF)</label>
                  <input
                    type="number"
                    value={newPkg.price}
                    onChange={(e) => setNewPkg({ ...newPkg, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Short Description</label>
                <textarea
                  value={newPkg.shortDescription}
                  onChange={(e) => setNewPkg({ ...newPkg, shortDescription: e.target.value })}
                  placeholder="Analytical focus and risk assessment..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white h-20"
                />
              </div>

              {/* Dynamic Matches List */}
              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase">Matches in this Package ({newPkg.matches.length})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewPkg({
                        ...newPkg,
                        matches: [
                          ...newPkg.matches,
                          {
                            homeTeam: '',
                            awayTeam: '',
                            league: 'Premier League',
                            kickoffTime: '18:00 GMT',
                            market: 'Over 1.5 Goals',
                            selection: 'Over 1.5',
                            odds: '1.40',
                            confidence: 'High',
                            analysis: '',
                          },
                        ],
                      })
                    }
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Match
                  </button>
                </div>

                {newPkg.matches.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Home Team (e.g. Arsenal)"
                        value={m.homeTeam}
                        onChange={(e) => {
                          const copy = [...newPkg.matches];
                          copy[idx].homeTeam = e.target.value;
                          setNewPkg({ ...newPkg, matches: copy });
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Away Team (e.g. Chelsea)"
                        value={m.awayTeam}
                        onChange={(e) => {
                          const copy = [...newPkg.matches];
                          copy[idx].awayTeam = e.target.value;
                          setNewPkg({ ...newPkg, matches: copy });
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded p-1.5 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="League"
                        value={m.league}
                        onChange={(e) => {
                          const copy = [...newPkg.matches];
                          copy[idx].league = e.target.value;
                          setNewPkg({ ...newPkg, matches: copy });
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded p-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Selection (e.g. Over 1.5)"
                        value={m.selection}
                        onChange={(e) => {
                          const copy = [...newPkg.matches];
                          copy[idx].selection = e.target.value;
                          setNewPkg({ ...newPkg, matches: copy });
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded p-1.5 text-emerald-400 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Odds (e.g. 1.35)"
                        value={m.odds}
                        onChange={(e) => {
                          const copy = [...newPkg.matches];
                          copy[idx].odds = e.target.value;
                          setNewPkg({ ...newPkg, matches: copy });
                        }}
                        className="bg-neutral-900 border border-neutral-800 rounded p-1.5 text-amber-400 font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Publish Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
