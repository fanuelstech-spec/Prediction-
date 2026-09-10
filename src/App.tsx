import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { PredictionCard } from './components/PredictionCard.tsx';
import { PredictionDetailModal } from './components/PredictionDetailModal.tsx';
import { PricingSection } from './components/PricingSection.tsx';
import { PaymentModal, PaymentTarget } from './components/PaymentModal.tsx';
import { UserDashboard } from './components/UserDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { TrustAndFAQ } from './components/TrustAndFAQ.tsx';
import { Footer } from './components/Footer.tsx';
import { PredictionPackage } from './types.ts';
import {
  Layers,
  Crown,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Flame,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';

function MainContent() {
  const { user, token, demoRole, accessSummary } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [packages, setPackages] = useState<PredictionPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<'all' | 'standard' | 'vip' | 'pay_per_view'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      else if (demoRole) headers['x-demo-role'] = demoRole;

      const res = await fetch('/api/predictions', { headers });
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [token, demoRole, accessSummary]);

  const handleOpenPricing = () => {
    setCurrentView('home');
    setTimeout(() => {
      document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleViewPrediction = (pkg: PredictionPackage) => {
    setSelectedPackageId(pkg.id);
  };

  const handleUnlockPackage = (pkg: PredictionPackage) => {
    if (pkg.accessLevel === 'vip') {
      // Suggest VIP Pass
      setPaymentTarget({
        productId: 2,
        name: `VIP Pass (Unlocks ${pkg.title})`,
        amount: 15000,
        type: 'subscription',
        tier: 'vip',
      });
    } else {
      // Single ticket unlock or standard
      setPaymentTarget({
        packageId: pkg.id,
        name: pkg.title,
        amount: pkg.price || 3500,
        type: 'pay_per_prediction',
        tier: 'single',
      });
    }
  };

  const handleSelectPlan = (plan: any) => {
    setPaymentTarget({
      productId: plan.productId,
      packageId: plan.packageId,
      name: plan.name,
      amount: plan.amount,
      type: plan.type,
      tier: plan.tier,
    });
  };

  const handlePaymentSuccess = (unlockedPackageId?: number) => {
    fetchPackages();
    if (unlockedPackageId) {
      setSelectedPackageId(unlockedPackageId);
    } else {
      setCurrentView('dashboard');
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesTab =
      filterTab === 'all' ||
      (filterTab === 'standard' && pkg.accessLevel === 'standard') ||
      (filterTab === 'vip' && pkg.accessLevel === 'vip') ||
      (filterTab === 'pay_per_view' && pkg.accessLevel === 'pay_per_view');

    const matchesSearch =
      searchQuery === '' ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenPricing={handleOpenPricing}
      />

      {/* Main Views */}
      <main className="flex-1 bg-black">
        {currentView === 'home' && (
          <div className="bg-black">
            {/* Hero Section */}
            <Hero
              onViewPredictions={() => {
                document.getElementById('predictions-grid-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreVip={handleOpenPricing}
            />

            {/* PREDICTIONS CATALOG SECTION */}
            <section id="predictions-grid-section" className="py-16 border-b border-neutral-900 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title & Description */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-neutral-800 text-xs text-neutral-400 font-mono mb-2">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Curated Match Packages
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Today's Football Predictions
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      Browse locked preview cards. Unlocked selections reveal exact teams, markets, odds, and tactical analysis.
                    </p>
                  </div>

                  <button
                    onClick={fetchPackages}
                    className="self-start md:self-auto p-2 rounded-xl bg-black hover:bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Sync Predictions</span>
                  </button>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-black border border-neutral-800 mb-8 backdrop-blur-md">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar font-mono text-xs">
                    <button
                      id="filter-tab-all"
                      onClick={() => setFilterTab('all')}
                      className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                        filterTab === 'all'
                          ? 'bg-neutral-900 text-white font-bold border border-neutral-700 shadow-sm'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
                      }`}
                    >
                      All Packs ({packages.length})
                    </button>
                    <button
                      id="filter-tab-standard"
                      onClick={() => setFilterTab('standard')}
                      className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        filterTab === 'standard'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Standard Multi
                    </button>
                    <button
                      id="filter-tab-vip"
                      onClick={() => setFilterTab('vip')}
                      className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        filterTab === 'vip'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-amber-400/80 hover:text-amber-300 hover:bg-neutral-950'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP Elite
                    </button>
                    <button
                      id="filter-tab-ppv"
                      onClick={() => setFilterTab('pay_per_view')}
                      className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                        filterTab === 'pay_per_view'
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
                      }`}
                    >
                      Single Tickets
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search leagues, odds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Prediction Cards Grid */}
                {loading && packages.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-neutral-400 font-mono">Loading curated packages from Cloud SQL...</p>
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="py-16 text-center rounded-2xl bg-black border border-neutral-800 p-8 space-y-3">
                    <p className="text-sm font-semibold text-white">No prediction packages match your filter.</p>
                    <p className="text-xs text-neutral-500">Try adjusting your search query or switching tabs.</p>
                    <button
                      onClick={() => {
                        setFilterTab('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map((pkg) => (
                      <PredictionCard
                        key={pkg.id}
                        pkg={pkg}
                        onView={handleViewPrediction}
                        onUnlock={handleUnlockPackage}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* How It Works & Responsible Gambling & FAQ */}
            <TrustAndFAQ />

            {/* Pricing Section */}
            <PricingSection onSelectPlan={handleSelectPlan} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <UserDashboard
            onViewPrediction={handleViewPrediction}
            onUpgradeToVip={handleOpenPricing}
          />
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Detail Modal (Protected access check) */}
      <PredictionDetailModal
        packageId={selectedPackageId}
        onClose={() => setSelectedPackageId(null)}
        onUnlock={handleUnlockPackage}
      />

      {/* Payment Checkout Modal (Fapshi Backend Integration) */}
      <PaymentModal
        target={paymentTarget}
        onClose={() => setPaymentTarget(null)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <Footer
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenPricing={handleOpenPricing}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
