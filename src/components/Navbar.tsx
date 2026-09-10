import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Shield,
  Crown,
  Lock,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
  Flame,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenPricing }) => {
  const { user, accessSummary, signOut, switchDemoRole, demoRole, signInWithGoogle } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getBadge = () => {
    if (user?.role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
          <ShieldCheck className="w-3 h-3" /> Admin Analyst
        </span>
      );
    }
    if (accessSummary?.isVip) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <Crown className="w-3 h-3 text-amber-400" /> VIP Elite
        </span>
      );
    }
    if (accessSummary?.isStandard) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3 h-3" /> Standard
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
        <Lock className="w-3 h-3" /> Free Visitor
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/95 backdrop-blur-md">
      {/* Marquee Odds Ticker */}
      <div className="w-full bg-black border-b border-neutral-900 px-4 py-1.5 text-xs text-neutral-300 overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-semibold shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LIVE INTEL:
        </div>
        <div className="overflow-x-auto no-scrollbar flex items-center gap-6 text-[11px] font-mono tracking-tight text-neutral-300 whitespace-nowrap ml-4">
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-400">ARS vs CHE:</span>
            <span className="text-amber-400 font-bold">Over 1.5 @ 1.32</span>
          </span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-400">RMA vs SOC:</span>
            <span className="text-emerald-400 font-bold">Real Madrid Win @ 1.45</span>
          </span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-400">BAY vs RBL:</span>
            <span className="text-amber-400 font-bold">BTTS Yes @ 1.52</span>
          </span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-400">VIP MEGA ACCA:</span>
            <span className="text-amber-300 font-extrabold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              8 Fold @ 38.50 Odds
            </span>
          </span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-400">Fapshi Gateway:</span>
            <span className="text-emerald-400">Instant Unlocks Active</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-neutral-400 shrink-0 ml-4 font-mono">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>78.6% 30-Day Rate</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          id="nav-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-black border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:border-amber-400 transition-colors">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Apex<span className="text-amber-400">Picks</span></span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-300 font-semibold border border-neutral-800">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">Research-Driven Football Intelligence</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-300">
          <button
            id="nav-link-predictions"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'home'
                ? 'text-white bg-neutral-900 font-semibold border border-neutral-800'
                : 'hover:text-white hover:bg-neutral-900'
            }`}
          >
            Predictions
          </button>
          <button
            id="nav-link-vip"
            onClick={onOpenPricing}
            className="px-3 py-1.5 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 flex items-center gap-1.5 transition-colors"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP Elite Pass
          </button>
          <button
            id="nav-link-how-it-works"
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900 transition-colors"
          >
            How It Works
          </button>
          <button
            id="nav-link-pricing"
            onClick={onOpenPricing}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900 transition-colors"
          >
            Pricing
          </button>
          <button
            id="nav-link-faq"
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-neutral-900 transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right Section: Role Switcher & User Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Persona Switcher for effortless testing */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black hover:bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
              title="Switch demo persona to test authorization tiers"
            >
              {getBadge()}
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-black border border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 border-b border-neutral-800 mb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Test Personas</p>
                  <p className="text-[10px] text-neutral-500">Instantly experience each access level</p>
                </div>
                <button
                  id="persona-vip-btn"
                  onClick={() => {
                    switchDemoRole('vip');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-neutral-900 flex items-center justify-between text-neutral-200"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP Elite (All Unlocked)
                  </span>
                  {accessSummary?.isVip && !user?.role && <span className="text-[10px] text-amber-400 font-bold">Active</span>}
                </button>
                <button
                  id="persona-standard-btn"
                  onClick={() => {
                    switchDemoRole('standard');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-neutral-900 flex items-center justify-between text-neutral-200"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Standard Subscriber
                  </span>
                  {accessSummary?.isStandard && !accessSummary?.isVip && <span className="text-[10px] text-emerald-400 font-bold">Active</span>}
                </button>
                <button
                  id="persona-visitor-btn"
                  onClick={() => {
                    switchDemoRole('visitor');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-neutral-900 flex items-center justify-between text-neutral-200"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" /> Free Visitor (Locked)
                  </span>
                  {!accessSummary?.isVip && !accessSummary?.isStandard && user?.role !== 'admin' && (
                    <span className="text-[10px] text-neutral-400 font-bold">Active</span>
                  )}
                </button>
                <button
                  id="persona-admin-btn"
                  onClick={() => {
                    switchDemoRole('admin');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-neutral-900 flex items-center justify-between text-neutral-200"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> Admin Manager
                  </span>
                  {user?.role === 'admin' && <span className="text-[10px] text-red-400 font-bold">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* User / Dashboard button */}
          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'dashboard'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Dashboard</span>
          </button>

          {/* Admin Button if Admin */}
          {user?.role === 'admin' && (
            <button
              id="nav-admin-panel-btn"
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          )}

          {/* Google Login or Signout */}
          {user ? (
            <button
              id="nav-signout-btn"
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="nav-signin-google-btn"
              onClick={() => signInWithGoogle()}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
