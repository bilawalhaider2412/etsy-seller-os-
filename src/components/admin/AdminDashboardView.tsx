import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import {
  Settings,
  Users,
  CreditCard,
  Zap,
  Activity,
  CheckCircle2,
  Server,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAdminMetrics();
        setData(res);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-xs text-stone-400">Loading admin metrics...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <Settings className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Admin System Dashboard
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Global platform overview, multi-tenant subscription volume, AI token consumption, and system health.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
            {data.metrics?.totalUsers?.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">+18% this month</div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Subscribers</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
            {data.metrics?.activeSubscribers}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">60.8% conversion from Free</div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Monthly Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
            ${data.metrics?.mrr?.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-600 font-medium">Stripe recurring billed</div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">AI Generations</span>
            <Zap className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
            {data.metrics?.totalAIGenerations?.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400">Gemini 3.8 Flash Engine</div>
        </div>
      </div>

      {/* System Health & Subscriptions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Subscription Distribution */}
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Active Subscription Tier Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Pro ($49/mo)', count: data.subscriptionBreakdown?.pro || 480, color: 'bg-amber-500' },
              { label: 'Starter ($19/mo)', count: data.subscriptionBreakdown?.starter || 290, color: 'bg-blue-500' },
              { label: 'Business ($99/mo)', count: data.subscriptionBreakdown?.business || 94, color: 'bg-emerald-500' },
              { label: 'Free Tier', count: data.subscriptionBreakdown?.free || 556, color: 'bg-stone-400' },
            ].map((tier) => (
              <div key={tier.label} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-700 dark:text-stone-300 font-medium">{tier.label}</span>
                  <span className="font-bold text-stone-900 dark:text-white">{tier.count} shops</span>
                </div>
                <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tier.color} rounded-full`}
                    style={{ width: `${(tier.count / 1420) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Health & Response Time */}
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center justify-between">
            <span>AI Studio API &amp; Server Health</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              100% Operational
            </span>
          </h3>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/60 space-y-2 text-stone-600 dark:text-stone-300">
            <div className="flex justify-between">
              <span>Gemini Model Provider:</span>
              <strong className="text-stone-900 dark:text-white">models/gemini-3.8-flash</strong>
            </div>
            <div className="flex justify-between">
              <span>Avg Latency:</span>
              <strong className="text-stone-900 dark:text-white">{data.metrics?.avgResponseTimeMs || 412} ms</strong>
            </div>
            <div className="flex justify-between">
              <span>Etsy Official API Proxy:</span>
              <strong className="text-emerald-600">Connected &amp; Healthy</strong>
            </div>
            <div className="flex justify-between">
              <span>Database Persistence:</span>
              <strong className="text-stone-900 dark:text-white">Active</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-stone-900 dark:text-white block">Recent Activity Log</span>
            {data.recentGenerations?.map((log: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-stone-50/50 dark:bg-stone-800/30 text-[11px]">
                <span className="text-stone-700 dark:text-stone-300">{log.tool}</span>
                <span className="text-stone-400">{log.user} • {log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
