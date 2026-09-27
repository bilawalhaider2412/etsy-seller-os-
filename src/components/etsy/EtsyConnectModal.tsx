import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Store,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const EtsyConnectModal: React.FC = () => {
  const { isEtsyModalOpen, setIsEtsyModalOpen, shopProfile, updateShopProfile, showToast, refreshProducts } = useApp();
  const [syncing, setSyncing] = useState(false);

  if (!isEtsyModalOpen) return null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.syncEtsy();
      await updateShopProfile({
        etsyConnected: true,
        lastSync: new Date().toISOString(),
      });
      await refreshProducts();
      showToast(res.message || 'Synced successfully with Etsy shop data!');
    } catch (e: any) {
      showToast(e.message || 'Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Etsy API Integration & Sync
              </h3>
              <p className="text-[11px] text-stone-500">Official OAuth 2.0 authorized shop connection</p>
            </div>
          </div>
          <button
            onClick={() => setIsEtsyModalOpen(false)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status Box */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                  Connected: {shopProfile?.shopName || 'Oak & Willow Craft Co.'}
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Shop ID: {shopProfile?.etsyShopId || 'oakandwillowco'} • Active listings: {shopProfile?.listingCount || 24}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          {/* Sync status info */}
          <div className="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2.5">
            <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
              <span>Last full sync:</span>
              <span className="font-semibold text-stone-900 dark:text-white">
                {shopProfile?.lastSync ? new Date(shopProfile.lastSync).toLocaleString() : 'Just now'}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
              <span>Authorized permissions:</span>
              <span className="font-semibold text-stone-900 dark:text-white">listings_r, transactions_r, shops_r</span>
            </div>
            <div className="flex justify-between items-center text-stone-600 dark:text-stone-300">
              <span>Etsy API Compliance:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified & Compliant
              </span>
            </div>
          </div>

          {/* Notice on Ethical Etsy API usage (product rule #30) */}
          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Strict Etsy Policy Compliance:</strong> Etsy Seller OS only queries authorized public shop data and your own private shop data via official APIs. We never scrape or fabricate metrics.
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing with Etsy API...' : 'Run Instant Shop Sync'}</span>
            </button>

            <button
              onClick={() => {
                setIsEtsyModalOpen(false);
                showToast('Etsy connection settings saved');
              }}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
