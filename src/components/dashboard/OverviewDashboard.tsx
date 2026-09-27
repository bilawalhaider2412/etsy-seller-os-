import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  DollarSign,
  Package,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Percent,
  ArrowUpRight,
  ShieldAlert,
  Compass,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Palette,
  Layers,
  Plus,
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    shopProfile,
    products,
    setActiveTab,
    setPrefillOptimizerData,
    setPrefillListingData,
    setIsCopilotOpen,
    setIsEtsyModalOpen,
  } = useApp();

  const totalRevenue = products.reduce((acc, p) => acc + (p.revenue || 0), 0);
  const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalFavorites = products.reduce((acc, p) => acc + (p.favorites || 0), 0);
  const avgSeoScore = products.length
    ? Math.round(products.reduce((acc, p) => acc + (p.seoScore || 0), 0) / products.length)
    : 78;
  const avgConversion = products.length
    ? (products.reduce((acc, p) => acc + (p.conversionRate || 0), 0) / products.length).toFixed(2)
    : '2.65';

  const lowSeoProduct = products.find((p) => p.seoScore < 70) || products[0];

  const handleFixListingWithAI = (prod: any) => {
    setPrefillOptimizerData({
      title: prod.title,
      description: prod.description,
      tags: prod.tags?.join(', '),
      price: `$${prod.price}`,
      category: prod.category,
    });
    setActiveTab('optimizer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Good morning, {shopProfile?.shopName || 'Shop Owner'} 👋
            </h1>
            <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Etsy Pro
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Here is your live shop intelligence, algorithm recommendations, and active listing scores.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('research')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Find Opportunities</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Create Listing</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% this mo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Listings</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            {products.length}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">
            <span>24 on Etsy sync</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Opp. Score</span>
            <Sparkles className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            88/100
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-1">
            <span>High Niche Demand</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Avg SEO</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            {avgSeoScore}/100
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">
            <span>Above Etsy Avg (64)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Views</span>
            <Eye className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-purple-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.4% traffic</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Favorites</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            {totalFavorites.toLocaleString()}
          </div>
          <div className="text-[10px] text-rose-600 font-medium mt-1">
            <span>High intent saves</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Conversion</span>
            <Percent className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
            {avgConversion}%
          </div>
          <div className="text-[10px] text-teal-600 font-medium mt-1">
            <span>Top 10% tier</span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Alert Card (Requirement #6) */}
      {lowSeoProduct && (
        <div className="p-5 rounded-2xl border border-amber-300 dark:border-amber-800/60 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-950/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Priority AI Recommendation
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded">
                  Score: {lowSeoProduct.seoScore}/100
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                Your listing <strong>“{lowSeoProduct.title}”</strong> has an SEO score of{' '}
                <strong className="text-rose-600">{lowSeoProduct.seoScore}/100</strong>. Improve your title
                to front-load primary keywords and add 7 missing tag clusters to unlock immediate search volume.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleFixListingWithAI(lowSeoProduct)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 shrink-0 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fix with AI</span>
          </button>
        </div>
      )}

      {/* Middle Grid: Product Opportunities & Shop Health Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Opportunities (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Trending Product Opportunities (AI Estimates)</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Linguistically modeled demand & competition in {shopProfile?.category || 'your niche'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('research')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                name: 'Modern Crochet Hooded Baby Romper Pattern PDF',
                demand: 'Very High',
                comp: 'Medium',
                score: 88,
                price: '$6.50 – $9.50',
                difficulty: 'Intermediate',
                format: 'Digital',
              },
              {
                name: 'Minimalist Wedding Timeline & Seating Chart Canva Template',
                demand: 'High',
                comp: 'Low',
                score: 84,
                price: '$8.99 – $14.99',
                difficulty: 'Beginner',
                format: 'Digital',
              },
              {
                name: 'Organic Herb Garden Ceramic Plant Markers (Set of 6)',
                demand: 'High',
                comp: 'Medium',
                score: 79,
                price: '$22.00 – $32.00',
                difficulty: 'Intermediate',
                format: 'Physical',
              },
            ].map((opp, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 bg-stone-50/40 dark:bg-stone-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-stone-900 dark:text-white">{opp.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium">
                      {opp.format}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500">
                    <span>
                      Demand: <strong className="text-emerald-600 font-semibold">{opp.demand}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Competition: <strong className="text-amber-600 font-semibold">{opp.comp}</strong>
                    </span>
                    <span>•</span>
                    <span>Suggested Price: {opp.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                      {opp.score}/100
                    </div>
                    <div className="text-[10px] text-stone-400">Opp. Score</div>
                  </div>
                  <button
                    onClick={() => {
                      setPrefillListingData({
                        productName: opp.name,
                        category: shopProfile?.category,
                        type: opp.format,
                      });
                      setActiveTab('generator');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white font-bold text-[11px] transition-colors"
                  >
                    Turn into Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Health Audit Widget */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">Shop Health Breakdown</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Score: 74/100
              </span>
            </div>

            <p className="text-[11px] text-stone-500 mb-4 leading-relaxed">
              Based on active listing SEO, keyword dispersion, and mobile readability formulas.
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'SEO & Tags', score: 68, color: 'bg-amber-500' },
                { label: 'Listing Quality', score: 72, color: 'bg-emerald-500' },
                { label: 'Keyword Coverage', score: 64, color: 'bg-rose-500' },
                { label: 'Conversion Messaging', score: 80, color: 'bg-teal-500' },
                { label: 'Product Diversity', score: 76, color: 'bg-blue-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-600 dark:text-stone-400">{item.label}</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{item.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('audit')}
            className="w-full mt-5 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:border-amber-400 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Run Complete Shop Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canva Studio Dashboard Widget */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm font-black text-xs">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">Canva Studio</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Visual Listing Engine
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Design high-converting Etsy listing graphics, what's-included slides, and Pinterest pins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('canva')}
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>My Designs</span>
            </button>
            <button
              onClick={() => setActiveTab('canva')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Design</span>
            </button>
          </div>
        </div>

        {/* Mini recent designs carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => setActiveTab('canva')}
            className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 bg-stone-50/60 dark:bg-stone-800/40 cursor-pointer transition-all flex items-center gap-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=120&q=80"
              alt="Design 1"
              className="w-11 h-11 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-stone-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                Ceramic Vase - Hero Carousel
              </p>
              <p className="text-[10px] text-stone-500 truncate">Etsy Listing • 2700x2025px</p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('canva')}
            className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 bg-stone-50/60 dark:bg-stone-800/40 cursor-pointer transition-all flex items-center gap-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=120&q=80"
              alt="Design 2"
              className="w-11 h-11 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-stone-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                Leather Journal - What's Included
              </p>
              <p className="text-[10px] text-stone-500 truncate">Package Checklist • Attached</p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('canva')}
            className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 bg-stone-50/60 dark:bg-stone-800/40 cursor-pointer transition-all flex items-center gap-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=120&q=80"
              alt="Design 3"
              className="w-11 h-11 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-stone-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                Spring Decor Sale - Viral Pin
              </p>
              <p className="text-[10px] text-stone-500 truncate">Pinterest Pin • Draft</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings Table (Requirement #6) */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>Recent Listings & SEO Status</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Track listing health and 1-click optimize underperforming items
            </p>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All {products.length} Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 font-semibold text-[11px]">
                <th className="pb-3 pl-1">Listing</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">SEO Score</th>
                <th className="pb-3">Conversion</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {products.slice(0, 5).map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                      <div className="max-w-md">
                        <div className="font-bold text-stone-900 dark:text-white line-clamp-1">
                          {prod.title}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span>{prod.tags?.length || 0} tags</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-stone-900 dark:text-white">${prod.price.toFixed(2)}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prod.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : prod.status === 'Needs Optimization'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          prod.seoScore >= 85
                            ? 'bg-emerald-500'
                            : prod.seoScore >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {prod.seoScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-stone-700 dark:text-stone-300">
                    {prod.conversionRate ? `${prod.conversionRate}%` : '2.1%'}
                  </td>
                  <td className="py-3 text-stone-400 text-[11px]">
                    {new Date(prod.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => handleFixListingWithAI(prod)}
                      className="px-2.5 py-1 rounded-lg border border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-[11px] hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      Optimize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
