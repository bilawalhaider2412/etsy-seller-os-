import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Lightbulb,
  Sparkles,
  Loader2,
  BookmarkPlus,
  ArrowRight,
  Filter,
  CheckCircle2,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';

export const ProductIdeaGeneratorView: React.FC = () => {
  const { shopProfile, setActiveTab, setPrefillListingData, addProduct, showToast } = useApp();
  const [category, setCategory] = useState(shopProfile?.category || 'Crochet');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const categories = [
    'Crochet',
    'Sewing',
    'Printables',
    'Weddings',
    'Jewelry',
    'Home Decor',
    'Planners & Journals',
    'Digital Art & SVGs',
    'Print on Demand (POD)',
    'Bath & Beauty',
    'Woodworking',
  ];

  const handleGenerate = async (selectedCat?: string) => {
    const cat = selectedCat || category;
    setLoading(true);
    try {
      const res = await api.productIdeas({ category: cat, count: 20 });
      setIdeas(res.results);
      showToast(`Generated 20 validated product ideas for ${cat}!`);
    } catch (e: any) {
      showToast(e.message || 'Idea generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleGenerate(category);
  }, []);

  const handleSaveIdea = async (idea: any) => {
    await addProduct({
      title: idea.productName,
      category: category,
      productType: idea.productFormat.includes('Digital') || idea.productFormat.includes('Template') ? 'Digital' : 'Physical',
      price: parseFloat(idea.suggestedPrice.replace(/[^0-9.]/g, '') || '9.99'),
      status: 'Idea',
      seoScore: 85,
      tags: idea.seoKeywords,
      description: `Problem Solved: ${idea.problemSolved}\n\nTarget Customer: ${idea.targetCustomer}\n\nDifferentiation Angle: ${idea.differentiationAngle}`,
      notes: `Suggested Price: ${idea.suggestedPrice} | Format: ${idea.productFormat} | Difficulty: ${idea.difficulty}`,
    });
  };

  const handleTurnIntoListing = (idea: any) => {
    setPrefillListingData({
      productName: idea.productName,
      category: category,
      type: idea.productFormat,
      targetAudience: idea.targetCustomer,
      features: `${idea.problemSolved}. Key differentiator: ${idea.differentiationAngle}`,
      materials: idea.seoKeywords.slice(0, 3).join(', '),
    });
    setActiveTab('generator');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <Lightbulb className="w-4 h-4" />
            </span>
            <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
              AI Product Idea Brainstormer
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Generate 20 high-potential, validated Etsy product ideas with built-in differentiation strategies.
          </p>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Brainstorming 20 Ideas...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate 20 More Ideas</span>
            </>
          )}
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              handleGenerate(c);
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              category === c
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea, idx) => (
          <div
            key={idea.id || idx}
            className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:border-amber-300 dark:hover:border-amber-700/60 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {idea.productFormat}
                    </span>
                    <span className="text-[10px] font-medium text-stone-500">
                      Difficulty: {idea.difficulty}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white leading-snug">
                    {idea.productName}
                  </h3>
                </div>

                <div className="text-right shrink-0 bg-stone-50 dark:bg-stone-800/60 px-2.5 py-1.5 rounded-xl border border-stone-100 dark:border-stone-700">
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    {idea.suggestedPrice}
                  </span>
                  <div className="text-[9px] text-stone-400">Target MSRP</div>
                </div>
              </div>

              {/* Target & Problem */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 mb-3">
                <p>
                  <strong>Target Customer:</strong> {idea.targetCustomer}
                </p>
                <p>
                  <strong>Problem Solved:</strong> {idea.problemSolved}
                </p>
              </div>

              {/* Differentiation Angle */}
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 text-xs text-amber-950 dark:text-amber-200 leading-relaxed mb-3">
                <strong>💡 Unique Differentiation Twist: </strong>
                {idea.differentiationAngle}
              </div>

              {/* SEO Keywords tags */}
              <div className="flex flex-wrap gap-1.5">
                {idea.seoKeywords?.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-600 dark:text-stone-400 font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-stone-400 italic">
                {idea.demandEstimate ? `Demand: ${idea.demandEstimate}` : 'AI Validated Niche'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveIdea(idea)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => handleTurnIntoListing(idea)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Turn into Listing</span>
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
