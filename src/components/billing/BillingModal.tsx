import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  Shield,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const BillingModal: React.FC = () => {
  const { isBillingOpen, setIsBillingOpen, subscription, upgradePlan, showToast } = useApp();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  if (!isBillingOpen) return null;

  const plans = [
    {
      name: 'Free',
      price: 0,
      annualPrice: 0,
      desc: 'Test out essential AI features for a new shop.',
      generations: '5 AI generations / month',
      features: [
        '5 AI listing drafts / mo',
        'Basic SEO keyword search',
        'Single shop workspace',
        'Community support',
      ],
      cta: 'Current Tier',
      highlight: false,
    },
    {
      name: 'Starter',
      price: 19,
      annualPrice: 15,
      desc: 'For active Etsy sellers launching new products monthly.',
      generations: '100 AI generations / month',
      features: [
        '100 AI generations / mo',
        'Product Research tool',
        '13 Etsy SEO Tags Generator',
        'Listing Optimizer & scoring',
        'Customer reply templates',
      ],
      cta: 'Upgrade to Starter',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 49,
      annualPrice: 39,
      desc: 'The complete operating system for full-time Etsy sellers.',
      generations: '500 AI generations / month',
      features: [
        '500 AI generations / mo',
        'Unlimited Competitor Intelligence',
        'Shop Health Audit & Top 10 Fixes',
        'Context-Aware AI CoPilot Assistant',
        '7-Slide Mockup & Canva Strategy',
        'Real-time Store Analytics',
      ],
      cta: 'Switch to Pro',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Business',
      price: 99,
      annualPrice: 79,
      desc: 'For high-volume multi-shop owners and Etsy agencies.',
      generations: '2,000 AI generations / month',
      features: [
        '2,000 AI generations / mo',
        'Manage up to 5 Etsy shops',
        'Team member seats (3 users)',
        'Priority AI model processing',
        'Export CSV listings in bulk',
        'Dedicated 1-on-1 account strategist',
      ],
      cta: 'Upgrade to Business',
      highlight: false,
    },
  ];

  const handleSelectPlan = async (planName: any) => {
    if (planName === subscription?.plan) {
      showToast('You are currently on this plan');
      return;
    }
    await upgradePlan(planName);
    setIsBillingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <CreditCard className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Plans & Subscription Management
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Upgrade or adjust your plan anytime. Powered by secure Stripe billing.
            </p>
          </div>
          <button
            onClick={() => setIsBillingOpen(false)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status bar */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-800/40 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Current Plan: {subscription?.plan || 'Pro'}
            </span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">
              ({subscription?.generationsUsed || 42} / {subscription?.generationsLimit || 500} credits used this period)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500">
              Cycle ends: {subscription?.billingCycleEnd?.slice(0, 10) || 'Oct 15, 2026'}
            </span>
          </div>
        </div>

        {/* Billing Toggle (Monthly / Annual) */}
        <div className="flex justify-center items-center gap-2 pt-5 text-xs">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              billingInterval === 'monthly'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval('annual')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              billingInterval === 'annual'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
              Save 20%
            </span>
          </button>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {plans.map((p) => {
            const isCurrent = subscription?.plan === p.name;
            const price = billingInterval === 'annual' ? p.annualPrice : p.price;

            return (
              <div
                key={p.name}
                className={`rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                  p.highlight
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-stone-900 shadow-lg relative'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white">{p.name}</h3>
                  </div>

                  <div className="mb-2">
                    <span className="text-2xl font-extrabold text-stone-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-[10px] text-stone-500">/mo</span>
                    {billingInterval === 'annual' && price > 0 && (
                      <div className="text-[10px] text-emerald-600 font-medium">Billed annually</div>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 leading-snug mb-3">{p.desc}</p>

                  <div className="font-bold text-[11px] text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{p.generations}</span>
                  </div>

                  <ul className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-3 mb-4">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(p.name)}
                  disabled={isCurrent}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-default'
                      : p.highlight
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-500/20'
                      : 'bg-stone-900 dark:bg-white hover:bg-stone-800 text-white dark:text-stone-900'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : p.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span>256-bit SSL encrypted • Instant cancellation anytime • No contracts</span>
          </div>
          <button
            onClick={() => showToast('Stripe Billing Portal simulation: active subscription verified')}
            className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Stripe Customer Portal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
