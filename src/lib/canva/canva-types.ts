/**
 * Canva Integration Type Definitions for AI Etsy Seller OS
 */

export type CanvaDesignType =
  | 'etsy_listing_main'
  | 'etsy_features'
  | 'etsy_whats_included'
  | 'etsy_size_guide'
  | 'etsy_materials'
  | 'etsy_faq'
  | 'etsy_cta'
  | 'pinterest_pin'
  | 'instagram_post'
  | 'instagram_story'
  | 'facebook_post'
  | 'promo_sale'
  | 'digital_preview';

export type CanvaLayoutStyle =
  | 'Minimal'
  | 'Elegant'
  | 'Handmade'
  | 'Modern'
  | 'Playful'
  | 'Luxury'
  | 'Beginner-friendly';

export interface CanvaDesignRecord {
  id: string;
  workspaceId: string;
  userId: string;
  productId?: string;
  listingId?: string;
  canvaDesignId: string;
  designName: string;
  designType: CanvaDesignType;
  templateId?: string;
  thumbnailUrl?: string;
  canvaUrl: string;
  editUrl?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'attached';
  layoutStyle?: CanvaLayoutStyle;
  slidesCount?: number;
  createdAt: string;
  updatedAt: string;
  brief?: CanvaDesignBrief;
}

export interface CanvaSlideContent {
  imageNumber: number;
  slideType: string;
  headline: string;
  subheading: string;
  bullets?: string[];
  ctaText?: string;
  visualGuidance?: string;
  imagePrompt?: string;
}

export interface CanvaDesignBrief {
  designType: CanvaDesignType;
  productName: string;
  productId?: string;
  layoutStyle: CanvaLayoutStyle;
  targetCustomer: string;
  primaryHeadline: string;
  secondaryHeadline: string;
  keyBenefits: string[];
  callToAction: string;
  slides: CanvaSlideContent[];
  qualityScore: {
    score: number; // 0-100
    strengths: string[];
    suggestions: string[];
  };
  variables: Record<string, string>;
}

export interface CanvaIntegrationStatus {
  canvaConnected: boolean;
  canvaUserId?: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  scopes: string[];
  connectedAt?: string;
  userName?: string;
  userEmail?: string;
}

export interface BrandKit {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  style: string;
  tone: string;
  shopUrl: string;
  socialHandles: string;
  updatedAt?: string;
}

export interface CanvaTemplate {
  id: string;
  title: string;
  category: 'Etsy' | 'Social Media' | 'Marketing' | 'Digital Preview';
  designType: CanvaDesignType;
  dimensions: string;
  description: string;
  thumbnailUrl: string;
  canvaTemplateUrl: string;
  defaultLayoutStyle: CanvaLayoutStyle;
  recommendedTags: string[];
  variables: string[];
}
