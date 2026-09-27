import { CanvaDesignBrief, CanvaTemplate, CanvaLayoutStyle } from './canva-types.ts';

/**
 * Canva Client Helper Utilities
 * Implements supported official Canva integration flows and iframe-safe popup OAuth.
 */

export interface OpenCanvaOptions {
  designType?: string;
  templateUrl?: string;
  designId?: string;
  queryTitle?: string;
}

/**
 * Constructs official Canva design creation or editing URL.
 * Supports:
 * 1. Existing design edit: https://www.canva.com/design/{id}/edit
 * 2. Template instantiation: https://www.canva.com/templates/{id}
 * 3. New design creation intent with category dimensions: https://www.canva.com/create/etsy-banners/ or search intent
 */
export function getCanvaWorkflowUrl(options: OpenCanvaOptions): string {
  if (options.designId) {
    return `https://www.canva.com/design/${options.designId}/edit`;
  }
  if (options.templateUrl) {
    return options.templateUrl;
  }

  const encodedTitle = encodeURIComponent(options.queryTitle || 'Etsy Listing');
  switch (options.designType) {
    case 'pinterest_pin':
      return `https://www.canva.com/create/pinterest-pins/?query=${encodedTitle}`;
    case 'instagram_post':
      return `https://www.canva.com/create/instagram-posts/?query=${encodedTitle}`;
    case 'instagram_story':
      return `https://www.canva.com/create/instagram-stories/?query=${encodedTitle}`;
    case 'promo_sale':
      return `https://www.canva.com/create/banners/?query=${encodedTitle}+Sale`;
    case 'digital_preview':
      return `https://www.canva.com/create/mockups/?query=${encodedTitle}+Download`;
    case 'etsy_listing_main':
    case 'etsy_features':
    case 'etsy_whats_included':
    case 'etsy_size_guide':
    case 'etsy_materials':
    case 'etsy_faq':
    default:
      return `https://www.canva.com/create/etsy-banners/?query=${encodedTitle}+Etsy+Listing`;
  }
}

/**
 * Opens a Canva design or template in a new window/tab safely from within AI Studio iframe.
 */
export function openCanvaWindow(url: string): Window | null {
  return window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copies structured Canva design copy to user clipboard for instant pasting into Canva layers.
 */
export async function copyDesignBriefToClipboard(brief: CanvaDesignBrief): Promise<boolean> {
  try {
    const formatted = formatDesignBriefText(brief);
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(formatted);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Clipboard copy fallback:', err);
    return false;
  }
}

export function formatDesignBriefText(brief: CanvaDesignBrief): string {
  let output = `====================================================\n`;
  output += `CANVA DESIGN BRIEF: ${brief.primaryHeadline}\n`;
  output += `Product: ${brief.productName}\n`;
  output += `Style: ${brief.layoutStyle} | Target: ${brief.targetCustomer}\n`;
  output += `Quality Score: ${brief.qualityScore.score}/100\n`;
  output += `====================================================\n\n`;

  brief.slides.forEach((slide) => {
    output += `--- SLIDE ${slide.imageNumber}: ${slide.slideType.toUpperCase()} ---\n`;
    output += `HEADLINE: ${slide.headline}\n`;
    if (slide.subheading) output += `SUBHEADING: ${slide.subheading}\n`;
    if (slide.bullets && slide.bullets.length > 0) {
      output += `KEY BULLETS:\n`;
      slide.bullets.forEach((b) => (output += ` • ${b}\n`));
    }
    if (slide.ctaText) output += `CALL TO ACTION: ${slide.ctaText}\n`;
    if (slide.visualGuidance) output += `LAYOUT GUIDANCE: ${slide.visualGuidance}\n`;
    if (slide.imagePrompt) output += `PHOTOGRAPHY PROMPT: ${slide.imagePrompt}\n`;
    output += `\n`;
  });

  return output;
}
