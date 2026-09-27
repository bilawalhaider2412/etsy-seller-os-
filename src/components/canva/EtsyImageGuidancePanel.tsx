import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Maximize2,
  Eye,
  Camera,
} from 'lucide-react';

export const EtsyImageGuidancePanel: React.FC = () => {
  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">
              Etsy Listing Image Guidance &amp; Best Practices
            </h4>
            <p className="text-[11px] text-stone-500">
              Grounded in official Etsy Seller Handbook and mobile conversion studies
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Conversion Optimized
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
            <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Optimal Dimensions</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
            Upload at <strong>2700 x 2025 px</strong> (4:3 ratio) or <strong>2000 x 2000 px</strong> square. This prevents fuzzy pixelation on high-DPI smartphone displays.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Mobile Thumbnail Test</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
            Over 65% of Etsy sales occur on mobile devices. Keep text overlays large (at least 32pt in Canva) so headlines remain legible at 150px zoom.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
            <Camera className="w-3.5 h-3.5 text-purple-600" />
            <span>All 10 Image Slots</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
            Fill at least 7-10 image slots: 1. Hero, 2. What's Included, 3. Macro Details, 4. Scale/Size, 5. In-Use Lifestyle, 6. Packaging, 7. Care instructions.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
        <span>
          <strong>Pro-Tip:</strong> Never present AI-generated search volume as guaranteed sales metrics. High-quality Canva graphics increase visual engagement and reduce buyer hesitation.
        </span>
      </div>
    </div>
  );
};
