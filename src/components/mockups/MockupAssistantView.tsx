import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Palette,
  Camera,
  Download,
} from 'lucide-react';

export const MockupAssistantView: React.FC = () => {
  const { shopProfile, showToast } = useApp();
  const [productName, setProductName] = useState('Wildflower Meadow Zipper Pouch Pattern');
  const [category, setCategory] = useState(shopProfile?.category || 'Sewing & Patterns');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim() || loading) return;
    setLoading(true);
    try {
      const res = await api.mockupStrategy({ productName, category });
      setResult(res.result);
      showToast('7-Slide Mockup & Photo Strategy generated!');
    } catch (e: any) {
      showToast(e.message || 'Strategy generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(idx);
    showToast('Copied photo prompt to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <ImageIcon className="w-4 h-4" />
          </span>
          <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
            Etsy Listing Photo &amp; Mockup Planner
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          Plan the proven 7-slide image sequence that turns casual Etsy browsers into high-confidence buyers.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product title or concept..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !productName.trim()}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Designing Photo Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate 7-Slide Framework</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in">
          {/* Design Advice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Canva / Photography Guideline: </strong>
                {result.canvaDesignAdvice}
              </span>
            </div>
            <a
              href="https://www.canva.com"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
            >
              <span>Open in Canva</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 7 Slide Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.images?.map((img: any, i: number) => (
              <div
                key={i}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm hover:border-amber-300 dark:hover:border-amber-700/60 transition-all flex flex-col justify-between"
              >
                {/* Visual mock card header */}
                <div className="h-32 bg-stone-100 dark:bg-stone-800/80 p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col justify-between relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs">
                      Slide {img.slideNumber}: {img.title}
                    </span>
                    <Camera className="w-4 h-4 text-stone-400" />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white line-clamp-1">
                      {img.headline}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {img.supportingText}
                    </p>
                  </div>
                </div>

                {/* Card details */}
                <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-[10px] text-stone-400 uppercase tracking-wider block mb-0.5">
                        Layout Concept:
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[11px]">
                        {img.layoutConcept}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[10px] text-stone-400 uppercase tracking-wider block mb-0.5">
                        Pro Conversion Tip:
                      </span>
                      <p className="text-stone-500 text-[11px] leading-relaxed">
                        {img.designTips}
                      </p>
                    </div>
                  </div>

                  {/* Copy Prompt Button */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => copyPrompt(img.imagePrompt, i)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-700 dark:text-stone-300 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied Midjourney/Canva Prompt</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>Copy AI Image/Camera Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
