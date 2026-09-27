import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Save,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ListingOptimizerView: React.FC = () => {
  const { prefillOptimizerData, addProduct, showToast } = useApp();

  const [title, setTitle] = useState(
    prefillOptimizerData?.title ||
      'Wildflower Meadow Zipper Pouch Sewing Pattern & Step-by-Step PDF Tutorial'
  );
  const [description, setDescription] = useState(
    prefillOptimizerData?.description ||
      'Step by step sewing instructions for a lined zipper pouch with boxed corners. Great for beginners with cotton fabric.'
  );
  const [tags, setTags] = useState(
    prefillOptimizerData?.tags || 'sewing pattern, zipper pouch, pdf tutorial, craft pdf'
  );
  const [price, setPrice] = useState(prefillOptimizerData?.price || '$6.99');
  const [category, setCategory] = useState(prefillOptimizerData?.category || 'Sewing & Patterns');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefillOptimizerData) {
      if (prefillOptimizerData.title) setTitle(prefillOptimizerData.title);
      if (prefillOptimizerData.description) setDescription(prefillOptimizerData.description);
      if (prefillOptimizerData.tags) setTags(prefillOptimizerData.tags);
      if (prefillOptimizerData.price) setPrice(prefillOptimizerData.price);
      if (prefillOptimizerData.category) setCategory(prefillOptimizerData.category);
    }
  }, [prefillOptimizerData]);

  const handleAudit = async () => {
    if (!title.trim() || !description.trim() || loading) return;
    setLoading(true);
    try {
      const res = await api.optimizeListing({
        title,
        description,
        tags,
        price,
        category,
      });
      setResult(res.result);
      showToast('Listing audit complete!');
    } catch (e: any) {
      showToast(e.message || 'Audit failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = async () => {
    if (!result) return;
    setTitle(result.optimizedListing.title);
    setDescription(result.optimizedListing.description);
    setTags(result.optimizedListing.tags.join(', '));
    showToast('Applied AI fixes to listing fields!');
  };

  const handleSaveToLibrary = async () => {
    if (!result) return;
    await addProduct({
      title: result.optimizedListing.title,
      category,
      productType: 'Pattern',
      price: parseFloat(price.replace(/[^0-9.]/g, '') || '6.99'),
      status: 'Ready',
      seoScore: 92,
      tags: result.optimizedListing.tags,
      description: result.optimizedListing.description,
      notes: `Optimized from initial score of ${result.overallScore}/100`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <Sparkles className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Etsy Listing Optimizer & Auditor
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Paste any existing Etsy listing to analyze SEO keyword coverage, mobile readability, and buyer clarity scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Listing (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Current Listing Content
          </h3>

          <div className="space-y-1">
            <label className="font-semibold text-stone-700 dark:text-stone-300">Title</label>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paste existing Etsy listing title"
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-stone-700 dark:text-stone-300">Description</label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste existing description text"
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 font-mono text-[11px]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-stone-700 dark:text-stone-300">
              Current Tags (Comma-separated)
            </label>
            <textarea
              rows={2}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. sewing pattern, zipper pouch, pdf tutorial"
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleAudit}
            disabled={loading || !title.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing with Etsy Search Models...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Listing Audit & Score</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Audit Score & 1-Click Fix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-12 text-center text-xs text-stone-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-700 dark:text-stone-300 text-sm">
                Analyze and boost any Etsy listing
              </h3>
              <p className="max-w-sm mx-auto leading-relaxed">
                Click &quot;Run Listing Audit &amp; Score&quot; to calculate your SEO score (0-100), identify missing keyword clusters, and get a 1-click optimized rewrite.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-in fade-in">
              {/* Score Overview Card */}
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Overall Listing Health Score
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                        {result.overallScore}/100
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          result.overallScore >= 80 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {result.overallScore >= 80 ? 'Strong Performance' : 'Needs Optimization'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyFix}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Optimized Version</span>
                  </button>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                  {Object.entries(result.scoreBreakdown).map(([k, v]: [string, any]) => (
                    <div key={k} className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-center">
                      <div className="text-stone-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="text-sm font-extrabold text-stone-900 dark:text-white mt-0.5">
                        {v}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Box */}
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3 text-xs">
                <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Actionable Recommendations</span>
                </h4>
                <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                  {result.actionableRecommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Optimized Rewrite Output */}
              <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>AI Improved Version (Preserves Your Actual Product Facts)</span>
                  </div>
                  <button
                    onClick={handleSaveToLibrary}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Library</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[11px] text-stone-500 uppercase tracking-wider block">
                    Optimized Title:
                  </span>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 text-stone-900 dark:text-white font-medium">
                    {result.optimizedListing?.title}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[11px] text-stone-500 uppercase tracking-wider block">
                    13 High-Intent Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.optimizedListing?.tags?.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[11px] text-stone-500 uppercase tracking-wider block">
                    Optimized Description:
                  </span>
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 text-stone-800 dark:text-stone-200 whitespace-pre-line font-mono text-[11px] max-h-60 overflow-y-auto">
                    {result.optimizedListing?.description}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
