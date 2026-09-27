import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AppTab } from '../../types/index.ts';
import {
  LayoutDashboard,
  Compass,
  Lightbulb,
  FileEdit,
  Sparkles,
  KeyRound,
  Eye,
  Image as ImageIcon,
  MessageSquare,
  Package,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Settings,
  ChevronRight,
  Flame,
  Palette,
} from 'lucide-react';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, subscription } = useApp();

  const navGroups: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'DISCOVER',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'research', label: 'Product Research', icon: Compass, badge: 'Hot' },
        { id: 'ideas', label: 'AI Product Ideas', icon: Lightbulb },
      ],
    },
    {
      title: 'CREATE & OPTIMIZE',
      items: [
        { id: 'generator', label: 'Listing Generator', icon: FileEdit },
        { id: 'optimizer', label: 'Listing Optimizer', icon: Sparkles },
        { id: 'canva', label: 'Canva Studio', icon: Palette, badge: 'Canva' },
        { id: 'keywords', label: 'SEO & Keywords', icon: KeyRound },
        { id: 'mockups', label: 'Mockup Assistant', icon: ImageIcon },
      ],
    },
    {
      title: 'GROW & MANAGE',
      items: [
        { id: 'competitors', label: 'Competitor Intel', icon: Eye },
        { id: 'replies', label: 'Customer Replies', icon: MessageSquare },
        { id: 'library', label: 'Product Library', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'audit', label: 'Shop Audit', icon: ShieldCheck, badge: 'AI' },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
        { id: 'admin', label: 'Admin Dashboard', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/60 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand logo & tagline */}
      <div className="h-16 px-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-stone-900 dark:text-white flex items-center gap-1.5">
              Etsy Seller OS
              <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/20">
                AI
              </span>
            </h1>
            <p className="text-[11px] text-stone-600 dark:text-stone-300">Growth Operating System</p>
          </div>
        </div>
      </div>

      {/* Navigation scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-stone-600 dark:text-stone-300 uppercase">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white font-semibold shadow-sm shadow-amber-500/25'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Pro Upgrade Banner */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 text-stone-800 dark:text-stone-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-stone-900 dark:text-white">
              {subscription?.plan || 'Pro'} Plan Active
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              500 Gens/mo
            </span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug mb-2">
            Automate Etsy SEO, listings, and customer replies.
          </p>
          <button
            onClick={() => setActiveTab('billing')}
            className="w-full py-1 px-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-semibold hover:border-amber-400 dark:hover:border-amber-500 transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            <span>Manage Plan</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
