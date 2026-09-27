import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Compass,
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const ProductResearchView: React.FC = () => {
  const {
    shopProfile,
    setActiveTab,
    setPrefillListingData,
    setPrefillKeywordQuery,
    addProduct,
    showToast,
  } = useApp();

  const [query, setQuery] = useState('crochet baby blanket');
  const [category, setCategory] = useState(shopProfile?.category || 'Crochet');
  const [productType, setProductType] = useState<'All' | 'Digital' | 'Physical'>('All');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([
    {
      productName: 'Chunky Bobble Crochet Baby Blanket Pattern PDF',
      targetBuyer: 'Expecting mothers, grandmothers, baby shower gift crafters',
      demandIndicator: 'Very High',
      competitionIndicator: 'Medium',
      opportunityScore: 89,
      suggestedPriceRange: '$5.50 – $8.99',
      classification: 'Digital',
      difficulty: 'Beginner',
      suggestedKeywords: [
        'crochet baby blanket pattern',
        'baby blanket crochet pdf',
        'beginner crochet blanket',
        'newborn blanket pattern',
        'chunky bobble stitch blanket',
      ],
      rationale:
        'Baby shower gifting drives continuous year-round search volume. Strongest demand is for photo-heavy tutorials that can be completed in a single weekend.',
      suggestedVariations: [
        'Gender-Neutral Cream & Sage Palette',
        'Heirloom Lace Border Edition',
        'Doll Size Mini Match Pattern',
      ],
      isAiEstimate: true,
    },
    {
      productName: 'Heirloom Organic Cotton Waffle Baby Swaddle Set',
      targetBuyer: 'Eco-conscious nursery decorators & luxury gifting shoppers',
      demandIndicator: 'High',
      competitionIndicator: 'Low',
      opportunityScore: 83,
      suggestedPriceRange: '$32.00 – $48.00',
      classification: 'Physical',
      difficulty: 'Intermediate',
      suggestedKeywords: [
        'organic baby swaddle',
        'waffle baby blanket',
        'monogrammed baby gift',
        'hospital coming home blanket',
      ],
      rationale:
        'Personalization options on natural unbleached waffle cotton command a 40% price premium over generic synthetic fleece blankets.',
      suggestedVariations: [
        'Personalized Embroidered Monogram',
        'Matching Top Knot Beanie Bundle',
        'Keepsake Wooden Gift Tag',
      ],
      isAiEstimate: true,
    },
    {
      productName: 'Modern Mosaic Tile Baby Quilt Pattern & SVG Templates',
      targetBuyer: 'Contemporary quilters seeking Scandinavian geometric aesthetics',
      demandIndicator: 'High',
      competitionIndicator: 'Medium',
      opportunityScore: 78,
      suggestedPriceRange: '$9.00 – $14.50',
      classification: 'Digital',
      difficulty: 'Intermediate',
      suggestedKeywords: [
        'modern baby quilt pattern',
        'geometric crib quilt pdf',
        'scandi nursery quilt',
        'cricut fabric svg pattern',
      ],
      rationale:
        'Nursery decor is shifting from traditional cartoon pastels toward modern earthy geometrics, leaving legacy Etsy listings vulnerable to modern refreshes.',
      suggestedVariations: [
        'Fat Quarter Friendly Cutting Guide',
        'Twin Bed Expansion Chart',
        'Printable Fabric Color Swatch Card',
      ],
      isAiEstimate: true,
    },
  ]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.productResearch({
        query,
        category,
        type: productType === 'All' ? undefined : productType,
      });
      setResults(res.results);
      showToast(`Generated ${res.results.length} product opportunities!`);
    } catch (e: any) {
      showToast(e.message || 'Research failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTurnIntoListing = (item: any) => {
    setPrefillListingData({
      productName: item.productName,
      category: category,
      type: item.classification === 'Digital' ? 'Digital Download' : 'Physical Handmade',
      targetAudience: item.targetBuyer,
      features: `${item.rationale}. Variations: ${item.suggestedVariations.join(', ')}`,
      materials: item.suggestedKeywords.slice(0, 3).join(', '),
    });
    setActiveTab('generator');
  };

  const handleSaveToLibrary = async (item: any) => {
    await addProduct({
      title: item.productName,
      category: category,
      productType: item.classification === 'Digital' ? 'Pattern' : 'Physical',
      price: parseFloat(item.suggestedPriceRange.replace(/[^0-9.]/g, '').split('.')[0] || '9.99'),
      status: 'Idea',
      seoScore: item.opportunityScore,
      tags: item.suggestedKeywords,
      description: `${item.rationale}\n\nTarget Buyer: ${item.targetBuyer}\n\nSuggested Variations:\n${item.suggestedVariations.map((v: string) => `• ${v}`).join('\n')}`,
      notes: `Suggested Price Range: ${item.suggestedPriceRange}. Difficulty: ${item.difficulty}`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <Compass className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Etsy Product Research Engine
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Uncover profitable niches, buyer intent, and competition indicators to decide what to create next.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. crochet baby blanket, wedding signage printable, linen apron..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
            >
              <option value="Crochet">Crochet & Knitting</option>
              <option value="Sewing">Sewing & Patterns</option>
              <option value="Printables">Printables & Templates</option>
              <option value="Weddings">Weddings & Party</option>
              <option value="Jewelry">Jewelry & Crafts</option>
              <option value="Digital Art">Digital Art & SVGs</option>
              <option value="Home Decor">Home Decor & Ceramic</option>
            </select>

            <select
              value={productType}
              onChange={(e: any) => setProductType(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white"
            >
              <option value="All">All Formats</option>
              <option value="Digital">Digital Only</option>
              <option value="Physical">Physical Only</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/20 shrink-0 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Niche</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Disclaimer per requirement #30 */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Info className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300 shrink-0" />
          <span>
            <strong>Transparency Notice:</strong> All demand scores and competition metrics are{' '}
            <span className="font-bold underline decoration-amber-500">AI Estimates</span> derived from semantic search patterns and category velocity models, not raw proprietary Etsy transaction logs.
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:border-amber-300 dark:hover:border-amber-700/60 transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                    {item.productName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {item.classification}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    Difficulty: {item.difficulty}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Target Buyer: <strong className="text-stone-700 dark:text-stone-300">{item.targetBuyer}</strong>
                </p>
              </div>

              {/* Opportunity Score Pill */}
              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40 shrink-0">
                <div className="text-center px-2">
                  <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                    {item.opportunityScore}/100
                  </div>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-amber-800 dark:text-amber-300">
                    Opp. Score
                  </div>
                </div>
                <div className="border-l border-amber-200 dark:border-amber-800 pl-3 space-y-0.5 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Demand:</span>
                    <span className="font-bold text-emerald-600">{item.demandIndicator}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Competition:</span>
                    <span className="font-bold text-amber-600">{item.competitionIndicator}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Suggested:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{item.suggestedPriceRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Rationale */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
              <strong className="text-stone-900 dark:text-white">Why this opportunity stands out: </strong>
              {item.rationale}
            </div>

            {/* Suggested Keywords & Variations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-[11px] text-stone-500 uppercase tracking-wider block mb-1.5">
                  High-Converting Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.suggestedKeywords?.map((kw: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrefillKeywordQuery(kw);
                        setActiveTab('keywords');
                      }}
                      className="px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-500 text-[11px] transition-colors"
                      title="Inspect keyword metrics"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-[11px] text-stone-500 uppercase tracking-wider block mb-1.5">
                  Suggested Variations & Twists
                </span>
                <div className="space-y-1 text-stone-600 dark:text-stone-300 text-[11px]">
                  {item.suggestedVariations?.map((v: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-semibold italic">
                [AI Estimate] Model generated
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveToLibrary(item)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs"
                >
                  Save as Idea
                </button>
                <button
                  onClick={() => handleTurnIntoListing(item)}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Turn Into Listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
