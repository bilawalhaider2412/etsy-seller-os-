import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  Store,
  Tag,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Target,
  Zap,
  Package,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, shopProfile, updateShopProfile, showToast } =
    useApp();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    shopName: shopProfile?.shopName || 'Willow & Thread Studio',
    category: shopProfile?.category || 'Crochet & Sewing Patterns',
    whatYouSell: shopProfile?.whatYouSell || 'Digital PDF Patterns and printable sewing templates',
    productType: shopProfile?.productType || 'Both',
    targetMarket: shopProfile?.targetMarket || 'US & UK craft hobbyists',
    listingCount: shopProfile?.listingCount || 15,
    monthlySales: shopProfile?.monthlySales || '$1,200/mo',
    primaryGoal: shopProfile?.primaryGoal || 'Get more sales',
  });

  if (!isOnboardingOpen) return null;

  const categories = [
    'Crochet & Knitting',
    'Sewing & Quilting',
    'Printables & Templates',
    'Weddings & Invitations',
    'Jewelry & Accessories',
    'Home Decor & Pottery',
    'Planners & Journals',
    'Digital Art & SVGs',
    'Print on Demand (POD)',
    'Bath, Beauty & Candles',
    'Woodworking & Craft Supplies',
    'Other Handcrafted',
  ];

  const goals = [
    { title: 'Get more sales', desc: 'Boost conversion rates and traffic velocity' },
    { title: 'Find profitable products', desc: 'Discover high-demand, low-competition niches' },
    { title: 'Improve SEO', desc: 'Rank higher on page 1 of Etsy search' },
    { title: 'Save time', desc: 'Automate descriptions, tags, and customer messaging' },
    { title: 'Improve existing listings', desc: 'Fix low-performing titles and missing tags' },
    { title: 'Start a new shop', desc: 'Launch a brand-new shop with validated products' },
  ];

  const handleFinish = async () => {
    await updateShopProfile(formData as any);
    setIsOnboardingOpen(false);
    showToast('Your personalized Seller OS is active!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with progress */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">Shop Personalization Wizard</h2>
              <p className="text-[11px] text-stone-500">Step {step} of 5</p>
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-stone-100 dark:bg-stone-800">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                  Tell us about your Etsy Shop
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  We customize keyword models, title formats, and price estimates based on your category.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Etsy Shop Name</label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-900 dark:text-white"
                    placeholder="e.g. The Cozy Stitch Co."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Shop Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-900 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                  What do you sell?
                </h3>
                <p className="text-stone-500">
                  Different listing structures apply to instant downloads versus handmade physicals.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Product Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Digital', 'Physical', 'Both'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, productType: type })}
                      className={`p-3 rounded-xl border text-center font-medium transition-all ${
                        formData.productType === type
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold shadow-sm'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {type === 'Digital' && '⚡ Digital / Files'}
                      {type === 'Physical' && '📦 Physical Items'}
                      {type === 'Both' && '🌟 Both Formats'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Brief Product Description</label>
                <textarea
                  rows={2}
                  value={formData.whatYouSell}
                  onChange={(e) => setFormData({ ...formData, whatYouSell: e.target.value })}
                  placeholder="e.g. Modern minimalist crochet beanie patterns, baby blanket guides, and cozy yarn kits"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-amber-500/20 text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Target Buyer Market</label>
                <input
                  type="text"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  placeholder="e.g. US wedding couples, beginner crafters, nursery moms"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                  Current Shop Size & Scale
                </h3>
                <p className="text-stone-500">
                  This calibrates your shop health baseline score and velocity targets.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Current Number of Active Listings: {formData.listingCount}
                </label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={formData.listingCount}
                  onChange={(e) => setFormData({ ...formData, listingCount: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>0 (Brand New)</span>
                  <span>25 (Growing)</span>
                  <span>50+ (Established)</span>
                  <span>100+ (Power Shop)</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Approximate Monthly Sales</label>
                <div className="grid grid-cols-2 gap-2">
                  {['$0 (Just Starting)', '$100 – $500/mo', '$500 – $2,000/mo', '$2,000 – $10,000+/mo'].map(
                    (bracket) => (
                      <button
                        key={bracket}
                        type="button"
                        onClick={() => setFormData({ ...formData, monthlySales: bracket })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          formData.monthlySales === bracket
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {bracket}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                  What is your biggest primary goal?
                </h3>
                <p className="text-stone-500">
                  Your AI assistant will prioritize recommendations aligned with this focus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goals.map((g) => (
                  <button
                    key={g.title}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryGoal: g.title })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.primaryGoal === g.title
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-sm'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 dark:text-white">{g.title}</span>
                      {formData.primaryGoal === g.title && (
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  Your Personalized Seller OS is Ready!
                </h3>
                <p className="text-stone-500 mt-1 max-w-md mx-auto">
                  We configured your AI tools for <strong>{formData.shopName}</strong> in{' '}
                  <strong>{formData.category}</strong>.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-left space-y-2 text-xs">
                <div className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
                  ✨ Instant Configured Capabilities:
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Personalized Etsy SEO title & tag constraints for {formData.category}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Custom product research tuned to {formData.targetMarket}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>High-converting mobile description formulas loaded</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Open My Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
