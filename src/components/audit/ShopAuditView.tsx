import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Info,
  Zap,
} from 'lucide-react';

export const ShopAuditView: React.FC = () => {
  const { shopProfile, setActiveTab, setPrefillKeywordQuery, setPrefillListingData, showToast } =
    useApp();

  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<any>(null);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await api.shopAudit();
      setAudit(res.result);
      showToast('Etsy Shop Audit complete!');
    } catch (e: any) {
      showToast(e.message || 'Audit failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFixAction = (item: any) => {
    if (item.category.includes('SEO') || item.action.includes('tags') || item.action.includes('Keyword')) {
      setPrefillKeywordQuery('crochet patterns');
      setActiveTab('keywords');
    } else if (item.category.includes('Conversion') || item.action.includes('description')) {
      setActiveTab('optimizer');
    } else if (item.category.includes('Photo') || item.action.includes('dimension')) {
      setActiveTab('mockups');
    } else {
      setActiveTab('generator');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
              AI Shop Health Audit
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            A comprehensive algorithm diagnosis evaluating your Etsy shop architecture, tag coverage, and conversion leaks.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 shrink-0 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Auditing Shop Catalog...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Audit My Etsy Shop</span>
            </>
          )}
        </button>
      </div>

      {!audit && !loading && (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-12 text-center text-xs text-stone-400 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-700 dark:text-stone-300 text-sm">
            Diagnose your Etsy shop health
          </h3>
          <p className="max-w-md mx-auto leading-relaxed">
            Click &quot;Audit My Etsy Shop&quot; to calculate your composite health score (0-100) and unlock the Top 10 High-Impact action items to scale traffic.
          </p>
        </div>
      )}

      {audit && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Shop Health Assessment
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl font-extrabold text-amber-600 dark:text-amber-400">
                    {audit.shopHealthScore}/100
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Good Growth Trajectory
                  </span>
                </div>
              </div>

              <div className="max-w-md text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/40 p-3.5 rounded-xl border border-stone-100 dark:border-stone-700">
                <strong>Executive Summary: </strong>
                {audit.summary}
              </div>
            </div>

            {/* Radar / Category Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
              {Object.entries(audit.radarScores).map(([key, score]: [string, any]) => (
                <div key={key} className="p-3 rounded-xl bg-stone-50/60 dark:bg-stone-800/40 text-center space-y-1">
                  <div className="text-[10px] text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-white">{score}%</div>
                  <div className="h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Actions (Requirement #17) */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Top 10 High-Impact Actions</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Ranked by algorithmic revenue leverage. Each action includes 1-click AI resolution.
              </p>
            </div>

            <div className="space-y-3">
              {audit.top10Actions?.map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60 bg-stone-50/40 dark:bg-stone-800/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-stone-900 dark:text-white text-sm">
                          {act.action}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                            act.priority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : act.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {act.priority}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          Category: {act.category}
                        </span>
                      </div>

                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-[11px] mb-1">
                        <strong>Impact: </strong>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {act.impact}
                        </span>
                      </p>
                      <p className="text-stone-500 text-[11px]">
                        <strong>Suggested Fix: </strong>
                        {act.suggestedFix}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFixAction(act)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm shadow-amber-500/20 shrink-0 flex items-center justify-center gap-1.5 self-start md:self-center transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fix with AI</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
