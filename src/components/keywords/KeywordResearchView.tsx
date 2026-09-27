import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  KeyRound,
  Search,
  Loader2,
  Copy,
  Check,
  Download,
  BookmarkPlus,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  Tag,
} from 'lucide-react';

export const KeywordResearchView: React.FC = () => {
  const { prefillKeywordQuery, saveKeyword, showToast } = useApp();
  const [seedKeyword, setSeedKeyword] = useState(prefillKeywordQuery || 'crochet pouch pattern');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  useEffect(() => {
    if (prefillKeywordQuery) {
      setSeedKeyword(prefillKeywordQuery);
      handleSearch(prefillKeywordQuery);
    }
  }, [prefillKeywordQuery]);

  const handleSearch = async (kwQuery?: string) => {
    const q = kwQuery || seedKeyword;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.keywords({ seedKeyword: q });
      setData(res.result);
      showToast('Etsy SEO keyword analysis ready!');
    } catch (e: any) {
      showToast(e.message || 'Keyword search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(label);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ['Keyword Phrase', 'Type', 'Score', 'Competition', 'Buyer Intent'],
      [data.primaryKeyword, 'Primary', data.searchOpportunityScore, data.competitionIndicator, data.buyerIntent],
      ...data.secondaryKeywords.map((k: any) => [k.phrase, 'Secondary', k.score, k.competition, k.intent]),
      ...data.longTailKeywords.map((k: string) => [k, 'Long-tail', '80', 'Low', 'Informational/Purchase']),
      ...data.buyerIntentKeywords.map((k: string) => [k, 'Buyer Intent', '85', 'Medium', 'High Commercial']),
      ...data.suggested13Tags.map((k: string) => [k, 'Etsy 13 Tag Slot', '90', 'Low/Medium', 'Search Box Ready']),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `etsy_keywords_${seedKeyword.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported keywords to CSV!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <KeyRound className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Etsy SEO &amp; Keyword Research
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Discover high-intent buyer searches, long-tail search volume, and 13 perfectly formatted Etsy tags.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="e.g. crochet pouch pattern, linen apron, budget planner excel..."
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
                <span>Extracting Keywords...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search Keywords</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Info className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300 shrink-0" />
          <span>
            Keyword metrics are semantic <strong className="underline decoration-amber-500">AI Estimates</strong> based on algorithmic query trends.
          </span>
        </div>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Primary Keyword Card */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                Primary High-Intent Keyword
              </div>
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                “{data.primaryKeyword}”
              </h2>
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <span>
                  Intent: <strong className="text-stone-700 dark:text-stone-300">{data.buyerIntent}</strong>
                </span>
                <span>•</span>
                <span>
                  Competition: <strong className="text-amber-600 font-semibold">{data.competitionIndicator}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {data.searchOpportunityScore}/100
                </div>
                <div className="text-[9px] uppercase tracking-wider font-bold text-stone-400">
                  Opportunity
                </div>
              </div>

              <button
                onClick={() =>
                  saveKeyword(data.primaryKeyword, data.searchOpportunityScore, data.competitionIndicator, data.buyerIntent)
                }
                className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />
                <span>Save Keyword</span>
              </button>

              <button
                onClick={exportCSV}
                className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* 13 Ready-to-Paste Etsy Tags Box */}
          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-amber-50/40 to-white dark:from-amber-950/20 dark:to-stone-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <span>13 Ready-to-Paste Etsy Tags (All strictly ≤ 20 chars)</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Formatted specifically for the Etsy listing editor tag boxes
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(data.suggested13Tags.join(', '), 'All 13 Tags')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {copiedTag === 'All 13 Tags' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTag === 'All 13 Tags' ? 'Copied Comma List' : 'Copy All 13 Tags'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
              {data.suggested13Tags?.map((tag: string, i: number) => (
                <button
                  key={i}
                  onClick={() => copyToClipboard(tag, tag)}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-amber-400 text-left transition-colors group flex items-center justify-between"
                  title="Click to copy individual tag"
                >
                  <span className="font-medium text-stone-800 dark:text-stone-200 truncate">{tag}</span>
                  <span className="text-[9px] text-stone-400 group-hover:text-amber-600 shrink-0 ml-1">
                    {tag.length}c
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary & Long-Tail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Secondary Keywords */}
            <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Secondary Keywords & Search Volume
              </h3>
              <div className="space-y-2 text-xs">
                {data.secondaryKeywords?.map((sec: any, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/40"
                  >
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{sec.phrase}</span>
                      <div className="text-[10px] text-stone-400">Intent: {sec.intent}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {sec.score}/100
                      </span>
                      <button
                        onClick={() => copyToClipboard(sec.phrase, sec.phrase)}
                        className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-Tail Keywords & Title Phrases */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  Long-Tail &amp; Buyer Intent Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {data.longTailKeywords?.concat(data.buyerIntentKeywords || [])?.map((kw: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(kw, kw)}
                      className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 flex items-center gap-1.5"
                    >
                      <span>{kw}</span>
                      <Copy className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Phrases */}
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  Suggested Title Phrases (Under 140 Chars)
                </h3>
                <div className="space-y-2 text-xs">
                  {data.suggestedTitlePhrases?.map((phrase: string, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between text-stone-800 dark:text-stone-200 font-medium"
                    >
                      <span className="truncate pr-2">{phrase}</span>
                      <button
                        onClick={() => copyToClipboard(phrase, 'Title Phrase')}
                        className="text-amber-600 hover:underline shrink-0 text-[11px] font-bold"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
