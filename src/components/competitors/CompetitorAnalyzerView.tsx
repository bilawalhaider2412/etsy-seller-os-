import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Eye,
  Search,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Info,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const CompetitorAnalyzerView: React.FC = () => {
  const { shopProfile, setActiveTab, setPrefillListingData, showToast } = useApp();
  const [query, setQuery] = useState('https://www.etsy.com/shop/TheCozyStitchCo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const presets = [
    { label: 'Top Crochet Shop (Cozy Stitch)', url: 'https://www.etsy.com/shop/TheCozyStitchCo' },
    { label: 'Bestseller Budget Spreadsheet', url: 'https://www.etsy.com/listing/budget-planner-excel' },
    { label: 'Linen Crossbody Bag Seller', url: 'https://www.etsy.com/shop/ArtisanLinenGoods' },
  ];

  const handleAnalyze = async (searchTarget?: string) => {
    const target = searchTarget || query;
    if (!target.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.analyzeCompetitor({
        queryOrUrl: target,
        category: shopProfile?.category,
      });
      setResult(res.result);
      showToast('Competitor intelligence generated!');
    } catch (e: any) {
      showToast(e.message || 'Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCounterProduct = () => {
    if (!result) return;
    setPrefillListingData({
      productName: `${result.suggestedVariations?.[0] || 'Enhanced Edition'} - High Quality Alternative`,
      category: shopProfile?.category,
      type: 'Digital Download',
      features: `Addresses common competitor complaints: ${result.reviewThemes?.commonComplaintsOrGaps?.join(', ')}`,
      materials: result.keywordThemes?.slice(0, 3).join(', '),
    });
    setActiveTab('generator');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <Eye className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Etsy Competitor Intelligence
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Analyze publicly accessible Etsy listings and shops to identify keyword strategies, pricing sweet spots, and unmet buyer desires.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste competitor shop URL, listing URL, or product title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-amber-500/20 text-stone-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center justify-center gap-1.5 shrink-0 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Competitor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Competitor</span>
              </>
            )}
          </button>
        </form>

        {/* Preset quick test chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-stone-400 font-medium">Quick examples:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(p.url);
                handleAnalyze(p.url);
              }}
              className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 hover:border-amber-400"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
          <Info className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300 shrink-0" />
          <span>
            <strong>Compliance Guarantee:</strong> Analyzes public information only. Does not access private Etsy account data or violate scraping policies.
          </span>
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Competitor Summary Card */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                  Public Market Analysis
                </span>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-white mt-1">
                  {result.competitorName}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Target Product: <strong>{result.productTitle}</strong>
                </p>
              </div>

              <button
                onClick={handleCreateCounterProduct}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Counter-Listing</span>
              </button>
            </div>

            {/* Positioning & Title Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/60 space-y-1">
                <span className="font-bold text-stone-900 dark:text-white block">
                  Product Positioning Strategy:
                </span>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {result.productPositioning}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/60 space-y-1">
                <span className="font-bold text-stone-900 dark:text-white block">
                  Title &amp; Keyword Structure:
                </span>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {result.titleStructureAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Listing Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Pricing Strategy */}
            <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span>Pricing Sweet Spot</span>
              </h3>
              <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
                {result.pricingAnalysis?.estimatedRange}
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                <strong>Strategy: </strong>
                {result.pricingAnalysis?.strategy}
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
                <strong>Recommendation: </strong>
                {result.pricingAnalysis?.recommendation}
              </div>
            </div>

            {/* Keyword Themes */}
            <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Detected Keyword Themes
              </h3>
              <p className="text-[11px] text-stone-500">Core search phrases this competitor ranks for:</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywordThemes?.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Image Strategy */}
            <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Photo &amp; Mockup Strategy
              </h3>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {result.imageStrategy}
              </p>
            </div>
          </div>

          {/* Buyer Praise vs Complaints (Golden Exploitation Gaps) */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-white">
              Customer Review Themes &amp; Market Vulnerabilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* What buyers love */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>What Buyers Praise:</span>
                </div>
                <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                  {result.reviewThemes?.whatBuyersLove?.map((love: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{love}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What buyers complain about */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800/80 bg-rose-50/20 dark:bg-rose-950/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-200">
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>Recurring Buyer Gaps &amp; Complaints:</span>
                </div>
                <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                  {result.reviewThemes?.commonComplaintsOrGaps?.map((gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How to Outrank */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 space-y-2">
              <strong className="text-amber-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>How to Win Market Share Against This Competitor:</span>
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.exploitableGaps?.map((gap: string, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-amber-200/60 dark:border-amber-700/60 text-stone-800 dark:text-stone-200"
                  >
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
