import React from 'react';
import { Shield, Lock, Smartphone, CreditCard, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPricing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPricing }) => {
  return (
    <footer className="bg-black border-t border-neutral-900 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                Apex<span className="text-amber-400">Picks</span> Pro
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed max-w-md text-xs">
              Institutional football intelligence and data-backed betting predictions. Combining expected goals (xG), tactical analysis, and disciplined risk-adjusted accumulator curation.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Server-side Protected
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Fapshi Payments
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Today's Predictions
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="text-amber-400 hover:text-amber-300 transition-colors">
                  VIP Elite Membership
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-white transition-colors">
                  Subscription Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Member Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Responsibility */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Responsible Play</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-amber-400/90">
                <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold">18+</span>
                <span>Adults Only</span>
              </li>
              <li>
                <span className="text-neutral-500">Predictions are analytical opinions, not guarantees.</span>
              </li>
              <li>
                <a href="https://www.begambleaware.org" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" /> BeGambleAware.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px] font-mono">
          <p>© {new Date().getFullYear()} ApexPicks Pro Football Analytics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Fapshi Gateway</span>
            <span>•</span>
            <span>Cloud SQL PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
