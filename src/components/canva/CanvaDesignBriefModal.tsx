import React, { useState } from 'react';
import { CanvaDesignBrief } from '../../lib/canva/canva-types.ts';
import {
  copyDesignBriefToClipboard,
  getCanvaWorkflowUrl,
  openCanvaWindow,
} from '../../lib/canva/canva-client.ts';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Camera,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';

interface CanvaDesignBriefModalProps {
  brief: CanvaDesignBrief | null;
  isOpen: boolean;
  onClose: () => void;
  onDesignLaunched?: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CanvaDesignBriefModal: React.FC<CanvaDesignBriefModalProps> = ({
  brief,
  isOpen,
  onClose,
  onDesignLaunched,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !brief) return null;

  const handleCopy = async () => {
    const ok = await copyDesignBriefToClipboard(brief);
    if (ok) {
      setCopied(true);
      showToast('Design Brief copied to clipboard! Ready to paste into Canva.', 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast('Could not copy automatically. You can highlight and copy below.', 'info');
    }
  };

  const handleOpenCanva = () => {
    const url = getCanvaWorkflowUrl({
      designType: brief.designType,
      queryTitle: brief.productName,
    });
    openCanvaWindow(url);
    if (onDesignLaunched) onDesignLaunched();
    showToast('Canva editor opened in a new tab!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                Canva Design Plan &amp; AI Copywriter
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                  Score: {brief.qualityScore.score}/100
                </span>
              </h3>
              <p className="text-xs text-stone-500 truncate max-w-md">{brief.productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80">
              <span className="text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 tracking-wider">
                Style &amp; Layout
              </span>
              <p className="font-bold text-stone-900 dark:text-white text-sm mt-0.5">
                {brief.layoutStyle}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Target: {brief.targetCustomer}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80">
              <span className="text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 tracking-wider">
                Primary Headline
              </span>
              <p className="font-bold text-stone-900 dark:text-white text-sm mt-0.5 truncate">
                {brief.primaryHeadline}
              </p>
              <p className="text-[11px] text-stone-500 mt-1 truncate">
                {brief.secondaryHeadline}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                Call to Action
              </span>
              <p className="font-bold text-amber-900 dark:text-amber-200 text-sm mt-0.5">
                {brief.callToAction}
              </p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-1">
                Etsy policy compliant
              </p>
            </div>
          </div>

          {/* Quality Score Breakdown */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Etsy Listing Image Quality Check</span>
              </div>
              <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                {brief.qualityScore.score} / 100
              </span>
            </div>
            <ul className="space-y-1 text-[11px] text-emerald-900 dark:text-emerald-200">
              {brief.qualityScore.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
              {brief.qualityScore.suggestions.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-stone-600 dark:text-stone-400">
                  <span className="text-amber-500 font-bold">↳ Tip:</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slide by Slide Sequence */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              6-Image Listing Sequence Breakdown
            </h4>

            <div className="space-y-3">
              {brief.slides.map((slide) => (
                <div
                  key={slide.imageNumber}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 hover:border-amber-400 dark:hover:border-amber-600/60 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                        #{slide.imageNumber}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs">
                        {slide.slideType}
                      </span>
                    </div>
                    {slide.ctaText && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold">
                        CTA: {slide.ctaText}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 pl-8">
                    <p className="font-semibold text-stone-800 dark:text-stone-200">
                      Headline: <span className="text-stone-900 dark:text-white font-bold">{slide.headline}</span>
                    </p>
                    {slide.subheading && (
                      <p className="text-stone-500 text-[11px]">
                        Subheading: {slide.subheading}
                      </p>
                    )}
                    {slide.bullets && slide.bullets.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase">Bullets:</span>
                        <ul className="list-disc list-inside text-[11px] text-stone-600 dark:text-stone-300 space-y-0.5">
                          {slide.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {slide.visualGuidance && (
                      <p className="text-[11px] text-stone-500 pt-1 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Layout: {slide.visualGuidance}</span>
                      </p>
                    )}

                    {slide.imagePrompt && (
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-2 mt-1">
                        <Camera className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-800 dark:text-stone-200">Photography Prompt:</strong>{' '}
                          {slide.imagePrompt}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between shrink-0">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Copy All Slide Copy</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleOpenCanva}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Canva</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
