export interface ProductResearchResult {
  productName: string;
  targetBuyer: string;
  demandIndicator: 'High' | 'Very High' | 'Medium' | 'Low';
  competitionIndicator: 'Low' | 'Medium' | 'High' | 'Very High';
  opportunityScore: number;
  suggestedPriceRange: string;
  classification: 'Digital' | 'Physical' | 'Hybrid';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  suggestedKeywords: string[];
  rationale: string;
  suggestedVariations: string[];
  isAiEstimate: boolean;
}

export interface KeywordResult {
  primaryKeyword: string;
  searchOpportunityScore: number;
  competitionIndicator: 'Low' | 'Medium' | 'High';
  buyerIntent: 'High Commercial' | 'Informational' | 'Niche Specific' | 'Seasonal';
  secondaryKeywords: Array<{
    phrase: string;
    score: number;
    competition: string;
    intent: string;
  }>;
  longTailKeywords: string[];
  buyerIntentKeywords: string[];
  suggested13Tags: string[]; // exactly 13 tags, each <= 20 characters
  suggestedTitlePhrases: string[];
  isAiEstimate: boolean;
}

export interface ListingGenerationResult {
  title: string;
  description: string;
  sections: {
    hook: string;
    productSummary: string;
    whatsIncluded: string;
    skillLevelAndMaterials: string;
    dimensionsOrSpecs: string;
    downloadOrShippingInfo: string;
    importantNotes: string;
    faq: Array<{ question: string; answer: string }>;
    callToAction: string;
  };
  tags: string[]; // 13 tags
  materials: string[];
  imageTexts: Array<{
    slideNumber: number;
    title: string;
    subtitle: string;
    visualRecommendation: string;
  }>;
  isAiEstimate: boolean;
}

export interface ListingOptimizationResult {
  overallScore: number;
  scoreBreakdown: {
    seo: number;
    buyerClarity: number;
    keywordCoverage: number;
    descriptionQuality: number;
    conversionMessaging: number;
  };
  strengths: string[];
  weaknesses: string[];
  actionableRecommendations: string[];
  optimizedListing: {
    title: string;
    description: string;
    tags: string[];
    justification: string;
  };
  isAiEstimate: boolean;
}

export interface CompetitorAnalysisResult {
  competitorName: string;
  productTitle: string;
  productPositioning: string;
  titleStructureAnalysis: string;
  keywordThemes: string[];
  pricingAnalysis: {
    estimatedRange: string;
    strategy: string;
    recommendation: string;
  };
  listingStructureInsights: string[];
  imageStrategy: string;
  reviewThemes: {
    whatBuyersLove: string[];
    commonComplaintsOrGaps: string[];
  };
  exploitableGaps: string[];
  suggestedVariations: string[];
  isAiEstimate: boolean;
}

export interface ProductIdeaItem {
  id: string;
  productName: string;
  targetCustomer: string;
  problemSolved: string;
  productFormat: 'Digital PDF' | 'SVG/Cut File' | 'Physical Handmade' | 'Print on Demand' | 'Template' | 'Pattern';
  suggestedPrice: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  seoKeywords: string[];
  differentiationAngle: string;
  demandEstimate: 'High' | 'Medium' | 'Very High';
  isAiEstimate: boolean;
}

export interface MockupStrategyResult {
  productName: string;
  images: Array<{
    slideNumber: number;
    title: string;
    headline: string;
    supportingText: string;
    layoutConcept: string;
    imagePrompt: string;
    designTips: string;
  }>;
  canvaDesignAdvice: string;
  isAiEstimate: boolean;
}

export interface CustomerReplyResult {
  professional: string;
  friendly: string;
  short: string;
  customizationNotes: string;
  detectedTopic: string;
  isAiEstimate: boolean;
}

export interface ShopAuditResult {
  shopHealthScore: number;
  radarScores: {
    seo: number;
    productStrategy: number;
    listingQuality: number;
    keywordCoverage: number;
    conversionMessaging: number;
    productDiversity: number;
  };
  summary: string;
  top10Actions: Array<{
    priority: 'Critical' | 'High' | 'Medium';
    action: string;
    impact: string;
    category: string;
    suggestedFix: string;
  }>;
  isAiEstimate: boolean;
}

export interface AIProvider {
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
  generateProductResearch(query: string, category?: string, type?: string): Promise<ProductResearchResult[]>;
  generateKeywords(seedKeyword: string, shopCategory?: string): Promise<KeywordResult>;
  generateListing(params: {
    productName: string;
    category?: string;
    type?: string;
    targetAudience?: string;
    features?: string;
    materials?: string;
    tone?: string;
  }): Promise<ListingGenerationResult>;
  optimizeListing(params: {
    title: string;
    description: string;
    tags?: string;
    price?: string;
    category?: string;
  }): Promise<ListingOptimizationResult>;
  analyzeCompetitor(queryOrUrl: string, category?: string): Promise<CompetitorAnalysisResult>;
  generateProductIdeas(category: string, count?: number): Promise<ProductIdeaItem[]>;
  generateMockupStrategy(productName: string, category?: string): Promise<MockupStrategyResult>;
  generateCustomerReply(message: string, context?: string, scenario?: string): Promise<CustomerReplyResult>;
  generateShopAudit(shopData: any): Promise<ShopAuditResult>;
  generateCopilotResponse(query: string, shopContext: any, history?: any[]): Promise<string>;
}
