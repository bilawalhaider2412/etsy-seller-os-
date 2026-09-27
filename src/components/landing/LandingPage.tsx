import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Flame,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Compass,
  FileEdit,
  KeyRound,
  Eye,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Star,
  Zap,
  Check,
  Store,
  Layers,
  Search,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setIsOnboardingOpen, setIsBillingOpen, user } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Etsy Seller OS differ from ChatGPT or generic AI writing tools?',
      a: 'Generic AI chatbots have no knowledge of Etsy search algorithms, tag length restrictions (strictly 13 tags under 20 chars), or front-loaded title formulas. Etsy Seller OS is purpose-built with Etsy ranking mechanics, competitor analysis tools, and real-time listing score audits.',
    },
    {
      q: 'Does this violate Etsy terms of service or policies?',
      a: 'Not at all. Etsy Seller OS complies strictly with all Etsy API policies and seller handbook guidelines. We never scrape private shop data, generate fake reviews, or automate bot transactions.',
    },
    {
      q: 'Do you fabricate Etsy search volume or sales metrics?',
      a: 'Never. We uphold full product transparency: all numerical opportunity scores and competition indicators are explicitly labeled as model-generated AI estimates based on keyword linguistic analysis, while store analytics connect to verified Etsy data or user imports.',
    },
    {
      q: 'Can I use this for digital printables, crochet patterns, and physical handmade goods?',
      a: 'Yes! Etsy Seller OS features tailored templates and category parameters for digital PDFs, SVGs, crochet/knitting patterns, print-on-demand (POD), jewelry, and physical handmade items.',
    },
    {
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Absolutely. There are no contracts or commitments. You can upgrade, downgrade, or cancel your subscription instantly through the Stripe billing portal.',
    },
  ];

  const handleStartFree = () => {
    if (user) {
      setActiveTab('overview');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white flex items-center gap-1.5">
            Etsy Seller OS
            <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/20">
              AI
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600 dark:text-stone-300">
          <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-amber-600 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-amber-600 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-amber-600 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all"
          >
            Live Demo App
          </button>
          <button
            onClick={handleStartFree}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-tight">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>The Next Generation AI Operating System for Etsy Shops</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
          Grow Your Etsy Shop With an{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500">
            AI-Powered Seller OS
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Research profitable products, optimize listings, discover high-converting keywords, analyze competitors, and automate your entire Etsy workflow — all from one intelligent dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartFree}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>See How It Works (Live Workspace)</span>
          </button>
        </div>

        {/* Realistic Interactive Dashboard Preview Mockup (Requirement #3) */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 sm:p-6 shadow-2xl space-y-4 text-left">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-stone-400 ml-2">
                  Etsy Seller OS • Live Shop Intelligence
                </span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Connected: Oak &amp; Willow Studio
              </span>
            </div>

            {/* Mock Dashboard Preview Content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Estimated Revenue</div>
                <div className="text-lg font-black text-stone-900 dark:text-white mt-1">$4,171.32</div>
                <div className="text-[10px] text-emerald-600 font-semibold">+16.4% this mo</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Product Opp. Score</div>
                <div className="text-lg font-black text-amber-600 mt-1">88/100</div>
                <div className="text-[10px] text-stone-500 font-semibold">Crochet &amp; Printables</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Avg SEO Health</div>
                <div className="text-lg font-black text-blue-600 mt-1">94/100</div>
                <div className="text-[10px] text-blue-600 font-semibold">Top 5% of Etsy</div>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <div className="text-stone-400 text-[10px] font-bold uppercase">Conversion Rate</div>
                <div className="text-lg font-black text-teal-600 mt-1">2.97%</div>
                <div className="text-[10px] text-teal-600 font-semibold">Benchmark: 1.8%</div>
              </div>
            </div>

            {/* AI Recommendation in Hero */}
            <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>AI SEO Alert: </strong>
                  <span>Your listing “Wildflower Meadow Pouch Pattern” has an SEO score of 62/100. Add 3 missing keyword clusters.</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('optimizer')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs shrink-0 shadow-sm"
              >
                Fix with AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: TRUSTED BY ETSY SELLERS */}
      <section className="py-12 border-y border-stone-200/80 dark:border-stone-800/80 bg-white/40 dark:bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Trusted by modern creators across top Etsy categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm font-semibold text-stone-700 dark:text-stone-300">
            <span className="flex items-center gap-2">🧶 Crochet &amp; Knitting Sellers</span>
            <span className="flex items-center gap-2">📄 Digital Printable Shops</span>
            <span className="flex items-center gap-2">🪡 Sewing Pattern Designers</span>
            <span className="flex items-center gap-2">👕 Print on Demand (POD)</span>
            <span className="flex items-center gap-2">💍 Handmade Jewelry &amp; Decor</span>
          </div>
        </div>
      </section>

      {/* SECTIONS 2-8: FEATURE HIGHLIGHTS */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Everything You Need to Dominate Etsy Search &amp; Sales
          </h2>
          <p className="text-sm text-stone-500">
            Not just generic text generation. A complete, disciplined operating system from discovery to scale.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* 1. Product Research */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              1. Product Opportunity Engine
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Search any seed idea to reveal validated demand scores, competition indicators, target buyer personas, and recommended price corridors before investing crafting time.
            </p>
          </div>

          {/* 2. AI Listing Generator */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              2. AI Listing Generator Studio
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Generate front-loaded SEO titles under 140 chars, high-converting mobile descriptions, 13 exact tags, materials, and 6-slide listing photo layouts in seconds.
            </p>
          </div>

          {/* 3. Etsy SEO Keywords */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              3. Etsy SEO Keyword Discovery
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Extract primary, secondary, and long-tail buyer-intent keywords. Auto-formats exactly 13 multi-word tags under 20 characters ready for the Etsy listing editor.
            </p>
          </div>

          {/* 4. Competitor Analysis */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              4. Competitor Intelligence
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Audit competitor titles, pricing sweet spots, and customer review praise vs complaints to discover profitable gaps and launch counter-products.
            </p>
          </div>

          {/* 5. Listing Optimizer */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              5. Listing Optimizer &amp; Scoring
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Paste any existing Etsy listing to audit SEO, buyer clarity, and keyword density from 0-100. Apply 1-click AI revisions that preserve your real product facts.
            </p>
          </div>

          {/* 6. AI Customer Assistant */}
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
              6. Customer Reply Assistant
            </h3>
            <p className="text-stone-500 leading-relaxed text-xs">
              Resolve shipping delays, download inquiries, and customization questions with 3 distinct seller tones (Friendly, Professional, and Short).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: PRICING PLANS */}
      <section id="pricing" className="py-20 px-6 border-t border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Predictable, Transparent Pricing
            </h2>
            <p className="text-xs text-stone-500">
              Start free with zero credit card required. Upgrade as your shop revenue grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs max-w-6xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Free</h3>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">$0</div>
                <p className="text-stone-500 text-[11px] mt-1">For brand new shops exploring AI.</p>
                <ul className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800 mt-4 text-[11px] text-stone-600 dark:text-stone-300">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 5 AI generations/mo</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 3 Product ideas</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Basic listing generator</li>
                </ul>
              </div>
              <button
                onClick={handleStartFree}
                className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Start Free
              </button>
            </div>

            {/* Starter */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Starter</h3>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">$19<span className="text-xs font-normal text-stone-400">/mo</span></div>
                <p className="text-stone-500 text-[11px] mt-1">For growing part-time Etsy shops.</p>
                <ul className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800 mt-4 text-[11px] text-stone-600 dark:text-stone-300">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 100 AI generations/mo</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Product Research engine</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Etsy SEO Keywords tool</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Listing Optimizer</li>
                </ul>
              </div>
              <button
                onClick={handleStartFree}
                className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold"
              >
                Choose Starter
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="p-6 rounded-2xl border-2 border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 flex flex-col justify-between space-y-4 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Pro</h3>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">$49<span className="text-xs font-normal text-stone-400">/mo</span></div>
                <p className="text-stone-500 text-[11px] mt-1">For serious full-time Etsy sellers.</p>
                <ul className="space-y-2 pt-4 border-t border-amber-200 dark:border-amber-800 mt-4 text-[11px] text-stone-700 dark:text-stone-200">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 500 AI generations/mo</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Competitor intelligence</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Context-aware AI CoPilot</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 7-Slide Mockup Planner</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Priority Gemini processing</li>
                </ul>
              </div>
              <button
                onClick={handleStartFree}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-md shadow-amber-500/25"
              >
                Get Pro Access
              </button>
            </div>

            {/* Business */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Business</h3>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">$99<span className="text-xs font-normal text-stone-400">/mo</span></div>
                <p className="text-stone-500 text-[11px] mt-1">For multi-shop brands &amp; agencies.</p>
                <ul className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800 mt-4 text-[11px] text-stone-600 dark:text-stone-300">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 2,000 AI generations/mo</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Manage up to 5 Etsy shops</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> 3 Team member accounts</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Dedicated strategy advisor</li>
                </ul>
              </div>
              <button
                onClick={handleStartFree}
                className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Choose Business
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ ACCORDION */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-500">
            Everything you need to know about Etsy Seller OS and our AI architecture.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-xs text-stone-900 dark:text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-amber-500' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: FINAL CTA BANNER */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Accelerate Your Etsy Shop Revenue?
          </h2>
          <p className="text-amber-100 text-sm max-w-xl mx-auto leading-relaxed">
            Join thousands of successful Etsy creators who use Etsy Seller OS to discover what to sell, generate high-ranking listings, and automate customer replies.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartFree}
              className="px-8 py-4 rounded-2xl bg-white text-stone-950 font-black text-sm shadow-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <span>Start Free with Etsy Seller OS</span>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 px-6 text-center text-xs text-stone-400">
        <div className="flex items-center justify-center gap-2 mb-2 font-bold text-stone-700 dark:text-stone-300">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Etsy Seller OS</span>
        </div>
        <p>© 2026 Etsy Seller OS. Not affiliated with, endorsed, or sponsored by Etsy, Inc. Etsy is a registered trademark of Etsy, Inc.</p>
      </footer>
    </div>
  );
};
