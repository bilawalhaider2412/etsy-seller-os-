import { CanvaTemplate } from './canva-types.ts';

export const CANVA_TEMPLATES: CanvaTemplate[] = [
  // 1. Etsy Listing Graphics
  {
    id: 'tmpl_etsy_main_hero',
    title: 'Clean Hero Listing Image (2700x2025px)',
    category: 'Etsy',
    designType: 'etsy_listing_main',
    dimensions: '2700 x 2025 px (4:3 Ratio)',
    description: 'High-contrast hero thumbnail optimized for Etsy search mobile feed, zoom, and crisp click-through rates.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-hero-listing/',
    defaultLayoutStyle: 'Minimal',
    recommendedTags: ['etsy thumbnail', 'hero image', 'clean aesthetic'],
    variables: ['product_name', 'subtitle', 'brand_name', 'price'],
  },
  {
    id: 'tmpl_etsy_whats_included',
    title: "What's Included & Inside The Box",
    category: 'Etsy',
    designType: 'etsy_whats_included',
    dimensions: '2700 x 2025 px',
    description: 'Breakdown of package contents, PDF downloads, license terms, or material packages with checkmark icons.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-whats-included/',
    defaultLayoutStyle: 'Handmade',
    recommendedTags: ['whats included', 'checklist', 'digital download'],
    variables: ['product_name', 'feature_1', 'feature_2', 'feature_3', 'cta'],
  },
  {
    id: 'tmpl_etsy_features_benefits',
    title: 'Key Product Features & Callouts',
    category: 'Etsy',
    designType: 'etsy_features',
    dimensions: '2700 x 2025 px',
    description: 'Highlight craftsmanship, eco-friendly materials, stitch counts, or premium paper weight with pointer arrows.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-product-features/',
    defaultLayoutStyle: 'Elegant',
    recommendedTags: ['features', 'specifications', 'handcrafted'],
    variables: ['product_name', 'feature_1', 'feature_2', 'materials'],
  },
  {
    id: 'tmpl_etsy_size_guide',
    title: 'Dimensions & Scale Comparison Guide',
    category: 'Etsy',
    designType: 'etsy_size_guide',
    dimensions: '2700 x 2025 px',
    description: 'Visual scale indicators comparing the product with everyday objects (coins, smartphones, hands) to prevent returns.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-size-guide/',
    defaultLayoutStyle: 'Modern',
    recommendedTags: ['size guide', 'measurements', 'dimensions'],
    variables: ['product_name', 'dimensions', 'materials'],
  },
  {
    id: 'tmpl_etsy_faq_care',
    title: 'FAQ & Care / Washing Instructions',
    category: 'Etsy',
    designType: 'etsy_faq',
    dimensions: '2700 x 2025 px',
    description: 'Answers top buyer pre-sale inquiries directly in image sequence #7-9 to boost instant conversions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-faq-instructions/',
    defaultLayoutStyle: 'Beginner-friendly',
    recommendedTags: ['faq', 'care guide', 'buyer tips'],
    variables: ['product_name', 'cta', 'shop_name'],
  },
  {
    id: 'tmpl_etsy_materials_sustainable',
    title: 'Materials & Sustainability Spotlight',
    category: 'Etsy',
    designType: 'etsy_materials',
    dimensions: '2700 x 2025 px',
    description: 'Showcase 100% organic cotton, solid walnut, non-toxic vegetable dyes, or recycled packaging.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-materials-craft/',
    defaultLayoutStyle: 'Handmade',
    recommendedTags: ['materials', 'handmade', 'sustainable'],
    variables: ['product_name', 'materials', 'skill_level'],
  },

  // 2. Social Media Traffic Drivers
  {
    id: 'tmpl_social_pinterest_pin',
    title: 'Viral Pinterest Pin (1000x1500px)',
    category: 'Social Media',
    designType: 'pinterest_pin',
    dimensions: '1000 x 1500 px (2:3 Ratio)',
    description: 'Vertical format with big bold headline, problem-solution hook, and high-CTR Etsy store call-to-action.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-pinterest-pin-etsy/',
    defaultLayoutStyle: 'Luxury',
    recommendedTags: ['pinterest', 'traffic driver', 'viral pin'],
    variables: ['product_name', 'subtitle', 'cta', 'website'],
  },
  {
    id: 'tmpl_social_instagram_carousel',
    title: 'Instagram Square / Carousel Slide (1080x1080px)',
    category: 'Social Media',
    designType: 'instagram_post',
    dimensions: '1080 x 1080 px (1:1 Square)',
    description: 'Aesthetic product showcase carousel with brand colors, shop handle, and swipe prompts.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-instagram-post-etsy/',
    defaultLayoutStyle: 'Minimal',
    recommendedTags: ['instagram', 'carousel', 'grid post'],
    variables: ['product_name', 'brand_name', 'shop_name'],
  },
  {
    id: 'tmpl_social_instagram_story',
    title: 'Instagram Story & Reel Cover (1080x1920px)',
    category: 'Social Media',
    designType: 'instagram_story',
    dimensions: '1080 x 1920 px (9:16 Vertical)',
    description: 'Full-bleed mobile story graphic with interactive poll space and "Link in Bio / Tap to Shop" badge.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-instagram-story-etsy/',
    defaultLayoutStyle: 'Playful',
    recommendedTags: ['story', 'reel cover', 'mobile'],
    variables: ['product_name', 'price', 'cta'],
  },

  // 3. Marketing & Promotional Banners
  {
    id: 'tmpl_promo_sale_announcement',
    title: 'Limited-Time Flash Sale & Free Shipping',
    category: 'Marketing',
    designType: 'promo_sale',
    dimensions: '2700 x 2025 px',
    description: 'Banner with countdown urgency, promotional coupon codes, and seasonal savings badges.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-etsy-sale-announcement/',
    defaultLayoutStyle: 'Playful',
    recommendedTags: ['sale', 'discount', 'free shipping'],
    variables: ['product_name', 'price', 'cta', 'shop_name'],
  },
  {
    id: 'tmpl_digital_preview_mockup',
    title: 'Digital PDF & Pattern Tablet Mockup',
    category: 'Digital Preview',
    designType: 'digital_preview',
    dimensions: '2700 x 2025 px',
    description: 'Multi-device digital preview showing PDF pattern on iPad, printable sheet, and finished physical craft.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    canvaTemplateUrl: 'https://www.canva.com/templates/EAF-digital-download-mockup/',
    defaultLayoutStyle: 'Beginner-friendly',
    recommendedTags: ['digital mockup', 'ipad preview', 'printable'],
    variables: ['product_name', 'skill_level', 'feature_1', 'cta'],
  },
];

/**
 * Replace template placeholders like {{product_name}} with actual values
 */
export function substituteTemplateVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;
  Object.entries(variables).forEach(([key, val]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
    result = result.replace(regex, val || '');
  });
  return result;
}
