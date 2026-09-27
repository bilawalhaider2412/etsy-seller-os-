import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  Sun,
  Moon,
  Store,
  CheckCircle2,
  Zap,
  HelpCircle,
  LogOut,
  User,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    shopProfile,
    theme,
    toggleTheme,
    setIsCopilotOpen,
    setIsBillingOpen,
    setIsEtsyModalOpen,
    setIsOnboardingOpen,
    setActiveTab,
    subscription,
    user,
    logout,
    setIsAuthModalOpen,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const usagePercent = subscription
    ? Math.min(100, Math.round((subscription.generationsUsed / subscription.generationsLimit) * 100))
    : 10;

  return (
    <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left: Shop status and Quick switch */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsEtsyModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium transition-colors"
          title="Click to view Etsy Connection & Sync"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
          <span className="font-semibold">{shopProfile?.shopName || 'My Etsy Shop'}</span>
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold ml-1">
            {shopProfile?.etsyConnected ? 'Synced' : 'Connect'}
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 pl-2">
          <span>Health:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            74/100 Good
          </span>
          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 ml-1">
            ⚡ Firebase Firestore Live
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5">
        {/* Usage Pill */}
        <button
          onClick={() => setIsBillingOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 bg-stone-50 dark:bg-stone-800/40 text-xs transition-all text-stone-700 dark:text-stone-300 group"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-medium">
            <span className="font-bold text-stone-900 dark:text-white">
              {subscription?.generationsUsed || 42}
            </span>
            /{subscription?.generationsLimit || 500} AI Credits
          </span>
          <div className="w-12 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden ml-1">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold group-hover:underline ml-0.5">
            {subscription?.plan || 'Pro'}
          </span>
        </button>

        {/* AI CoPilot Button */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ask Seller OS</span>
          <span className="md:hidden">CoPilot</span>
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Landing Page Preview button */}
        <button
          onClick={() => setActiveTab('landing')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white text-xs transition-colors"
          title="View Landing Page"
        >
          <span>Landing</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-800 dark:text-stone-200"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xs flex items-center justify-center">
                {((user as any).name || (user as any).displayName || (user as any).email || 'U').charAt(0).toUpperCase()}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold"
            >
              Sign In
            </button>
          )}

          {showUserMenu && user && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
              <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                <p className="font-semibold text-stone-900 dark:text-white truncate">
                  {(user as any).name || (user as any).displayName || 'Shop Owner'}
                </p>
                <p className="text-stone-500 text-[11px] truncate">{(user as any).email || ''}</p>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setIsOnboardingOpen(true);
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-stone-400" />
                Rerun Shop Onboarding
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setIsBillingOpen(true);
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Manage Subscription ({subscription?.plan})
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setIsEtsyModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-2"
              >
                <Store className="w-3.5 h-3.5 text-stone-400" />
                Etsy API Connection
              </button>

              <div className="border-t border-stone-100 dark:border-stone-800 my-1" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
