import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  MessageSquare,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Info,
  ShieldCheck,
  Send,
  User,
  Heart,
  Briefcase,
  Zap,
} from 'lucide-react';

export const CustomerReplyAssistantView: React.FC = () => {
  const { shopProfile, showToast } = useApp();

  const scenarios = [
    { label: 'Digital Download Issue', msg: "I bought the PDF pattern 2 hours ago but I haven't received any download link in my email and can't find it in my Etsy account. Please help!" },
    { label: 'Shipping Delay / Where Is My Order', msg: "Hi, my tracking number hasn't updated in 4 days. Is my package lost? I need this for my sister's birthday this Saturday." },
    { label: 'Refund or Cancellation Request', msg: "I accidentally ordered two of the same item. Can I cancel one and get a refund?" },
    { label: 'Custom Order / Personalization', msg: "Hello! Could you make this pouch in olive green instead of wildflower cream, and embroider the initials 'EM' on the front?" },
    { label: 'Product Sizing / Materials Question', msg: "Does this template work on iPad with GoodNotes 6, or is it strictly for Google Sheets on desktop?" },
    { label: 'Response to 5-Star Review', msg: "Five stars! The instructions were so clear and my pouch turned out gorgeous! Highly recommend this shop." },
  ];

  const [scenario, setScenario] = useState('Digital Download Issue');
  const [customerMessage, setCustomerMessage] = useState(scenarios[0].msg);
  const [loading, setLoading] = useState(false);
  const [replyData, setReplyData] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleGenerate = async (customMsg?: string) => {
    const msg = customMsg || customerMessage;
    if (!msg.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.customerReply({
        message: msg,
        context: `${shopProfile?.shopName || 'Etsy Shop'} selling ${shopProfile?.category || 'crafts'}`,
        scenario,
      });
      setReplyData(res.result);
      showToast('Customer responses generated!');
    } catch (e: any) {
      showToast(e.message || 'Reply generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Copied ${type} reply to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <MessageSquare className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Etsy Customer Message Assistant
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Generate warm, de-escalating customer replies in 3 distinct tones without inventing order numbers.
        </p>
      </div>

      {/* Preset scenario chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {scenarios.map((s) => (
          <button
            key={s.label}
            onClick={() => {
              setScenario(s.label);
              setCustomerMessage(s.msg);
              handleGenerate(s.msg);
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              scenario === s.label
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-3 text-xs">
        <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
          <span>Customer Message from Etsy Inbox:</span>
          <span className="text-[10px] text-stone-400">Never shares private buyer data</span>
        </label>
        <textarea
          rows={3}
          value={customerMessage}
          onChange={(e) => setCustomerMessage(e.target.value)}
          placeholder="Paste the buyer's Etsy message here..."
          className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 text-xs font-mono"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>AI provides structured templates with placeholders like [Customer Name] and [Tracking#]</span>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !customerMessage.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Responses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 3 Tone Replies</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Tone Outputs Grid */}
      {replyData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in text-xs">
          {/* 1. Warm & Friendly */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <Heart className="w-4 h-4" />
                  <span>Warm &amp; Friendly (Artisan)</span>
                </span>
                <span className="text-[10px] text-stone-400">Star Seller Tone</span>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 whitespace-pre-line text-stone-800 dark:text-stone-200 leading-relaxed font-sans text-xs">
                {replyData.friendly}
              </div>
            </div>

            <button
              onClick={() => copyText(replyData.friendly, 'Friendly')}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {copiedType === 'Friendly' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'Friendly' ? 'Copied Friendly Reply' : 'Copy Friendly Reply'}</span>
            </button>
          </div>

          {/* 2. Professional & Polished */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                  <Briefcase className="w-4 h-4" />
                  <span>Professional &amp; Polished</span>
                </span>
                <span className="text-[10px] text-stone-400">Standard Business</span>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 whitespace-pre-line text-stone-800 dark:text-stone-200 leading-relaxed font-sans text-xs">
                {replyData.professional}
              </div>
            </div>

            <button
              onClick={() => copyText(replyData.professional, 'Professional')}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedType === 'Professional' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'Professional' ? 'Copied' : 'Copy Professional Reply'}</span>
            </button>
          </div>

          {/* 3. Short & Direct */}
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <span>Short &amp; Direct</span>
                </span>
                <span className="text-[10px] text-stone-400">Quick Mobile Reply</span>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 whitespace-pre-line text-stone-800 dark:text-stone-200 leading-relaxed font-sans text-xs">
                {replyData.short}
              </div>
            </div>

            <button
              onClick={() => copyText(replyData.short, 'Short')}
              className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedType === 'Short' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'Short' ? 'Copied' : 'Copy Short Reply'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
