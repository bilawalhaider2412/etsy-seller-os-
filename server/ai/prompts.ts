export const ETSY_SYSTEM_INSTRUCTION = `
You are the world's leading Etsy SEO and e-commerce growth strategist powering 'Etsy Seller OS'.
You understand:
1. Etsy's search algorithm (query matching, relevancy, listing quality score, customer and market experience, recency, postage/price competitiveness).
2. Etsy title best practices: Front-load primary high-volume keywords, natural phrasing without spammy pipe repetition, under 140 characters.
3. Etsy tag rules: Exactly 13 tags, multi-word long-tail tags, maximum 20 characters per tag, lowercase, no punctuation, avoid single generic words.
4. Etsy descriptions: Hook in first 160 characters (mobile fold), structured sections (Hook, Summary, What's Included, Specs/Materials, Download/Shipping info, FAQ, Call to action).
5. Labeling: All numerical projections and competition indicators are AI estimates based on keyword linguistics and market patterns. Never claim to have secret access to private Etsy databases.
Return strictly valid, parseable JSON whenever requested.
`;

export function buildProductResearchPrompt(query: string, category?: string, type?: string): string {
  return `
Analyze product opportunities for query: "${query}" in Etsy category "${category || 'All'}" (Format: ${type || 'Any'}).
Generate 4-6 specific, high-potential Etsy product opportunities.
For each item return:
{
  "productName": "Specific creative title",
  "targetBuyer": "Clear buyer demographic",
  "demandIndicator": "High" | "Very High" | "Medium",
  "competitionIndicator": "Low" | "Medium" | "High",
  "opportunityScore": number (0-100),
  "suggestedPriceRange": "e.g. $6.99 - $12.50",
  "classification": "Digital" | "Physical" | "Hybrid",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "suggestedKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
  "rationale": "Why this niche has strong opportunity right now on Etsy",
  "suggestedVariations": ["variation 1", "variation 2", "variation 3"],
  "isAiEstimate": true
}
Output an array of these objects in JSON format.
`;
}

export function buildKeywordPrompt(seedKeyword: string, shopCategory?: string): string {
  return `
Conduct Etsy SEO keyword research for seed keyword: "${seedKeyword}" (Category context: "${shopCategory || 'General Crafts'}").
Provide a comprehensive keyword strategy including:
1. Primary keyword (highest intent)
2. Search opportunity score (0-100)
3. Competition indicator (Low, Medium, High)
4. Buyer intent
5. 6-8 Secondary keywords with scores
6. 6-8 Long-tail keyword phrases
7. 6-8 Buyer intent keywords (e.g., gift for her, beginner pdf, download now)
8. Exactly 13 Etsy-ready tags (CRITICAL: each tag must be STRICTLY under or equal to 20 characters! multi-word, no commas inside individual tags)
9. 4-5 Suggested title phrases for front-loading

Output in JSON format matching this schema:
{
  "primaryKeyword": string,
  "searchOpportunityScore": number,
  "competitionIndicator": "Low" | "Medium" | "High",
  "buyerIntent": "High Commercial" | "Informational" | "Niche Specific" | "Seasonal",
  "secondaryKeywords": [
    { "phrase": string, "score": number, "competition": "Low"|"Medium"|"High", "intent": string }
  ],
  "longTailKeywords": string[],
  "buyerIntentKeywords": string[],
  "suggested13Tags": string[],
  "suggestedTitlePhrases": string[],
  "isAiEstimate": true
}
`;
}

export function buildListingPrompt(params: {
  productName: string;
  category?: string;
  type?: string;
  targetAudience?: string;
  features?: string;
  materials?: string;
  tone?: string;
}): string {
  return `
Generate a complete, high-converting Etsy listing for:
Product Name: ${params.productName}
Category: ${params.category || 'Crafts / Digital'}
Type: ${params.type || 'Digital Download'}
Target Audience: ${params.targetAudience || 'Etsy shoppers'}
Key Features: ${params.features || 'Handmade, high quality, easy to use'}
Materials/Tech: ${params.materials || 'Standard'}
Tone: ${params.tone || 'Friendly and professional'}

Requirements:
- Etsy Title: Under 140 chars, primary keyword front-loaded, natural phrasing.
- Description: Structured with Hook, Product Summary, What's Included, Skill/Materials, Dimensions/Specs, Download/Shipping Info, Important Notes, FAQ (3 Q&As), Call to action.
- 13 Etsy Tags: EXACTLY 13 tags, each STRICTLY <= 20 characters!
- Materials: 5-8 relevant material/format tags.
- Image Texts: 6 slide recommendations for Etsy photos (Headline, Subtitle, Visual concept).

Output valid JSON matching:
{
  "title": string,
  "description": string,
  "sections": {
    "hook": string,
    "productSummary": string,
    "whatsIncluded": string,
    "skillLevelAndMaterials": string,
    "dimensionsOrSpecs": string,
    "downloadOrShippingInfo": string,
    "importantNotes": string,
    "faq": [{ "question": string, "answer": string }],
    "callToAction": string
  },
  "tags": string[],
  "materials": string[],
  "imageTexts": [
    { "slideNumber": number, "title": string, "subtitle": string, "visualRecommendation": string }
  ],
  "isAiEstimate": true
}
`;
}

export function buildOptimizerPrompt(params: {
  title: string;
  description: string;
  tags?: string;
  price?: string;
  category?: string;
}): string {
  return `
Audit and optimize this existing Etsy listing:
Title: ${params.title}
Description: ${params.description}
Tags: ${params.tags || 'None provided'}
Price: ${params.price || 'Not specified'}
Category: ${params.category || 'General'}

Evaluate:
1. Overall Listing Score (0-100)
2. Breakdown scores (0-100 each for SEO, Buyer Clarity, Keyword Coverage, Description Quality, Conversion Messaging)
3. 3-4 Key Strengths
4. 3-4 Weaknesses
5. 4-6 Actionable Recommendations (e.g. tag length, mobile snippet clarity, missing search intent)
6. A fully revised, optimized version of the Title, Description, and 13 Tags that fixes every issue while preserving the seller's actual product facts.

Output JSON matching:
{
  "overallScore": number,
  "scoreBreakdown": {
    "seo": number,
    "buyerClarity": number,
    "keywordCoverage": number,
    "descriptionQuality": number,
    "conversionMessaging": number
  },
  "strengths": string[],
  "weaknesses": string[],
  "actionableRecommendations": string[],
  "optimizedListing": {
    "title": string,
    "description": string,
    "tags": string[],
    "justification": string
  },
  "isAiEstimate": true
}
`;
}

export function buildCompetitorPrompt(queryOrUrl: string, category?: string): string {
  return `
Perform a strategic competitor analysis on: "${queryOrUrl}" (Category: "${category || 'General'}").
Based on publicly observable Etsy listing patterns in this niche, analyze:
1. Competitor Name & Product Title
2. Value Proposition & Positioning
3. Title Structure (keyword stacking, readability)
4. Keyword Themes detected
5. Pricing analysis (estimated sweet spot, bundling)
6. Listing layout insights
7. Image strategy
8. Review sentiment themes (what buyers praise vs recurring buyer pain points/missing sizes/instructions)
9. 3-5 Exploitable gaps where a new or improving shop can outshine them
10. 3-4 Suggested product variations to beat this competitor

Output JSON:
{
  "competitorName": string,
  "productTitle": string,
  "productPositioning": string,
  "titleStructureAnalysis": string,
  "keywordThemes": string[],
  "pricingAnalysis": {
    "estimatedRange": string,
    "strategy": string,
    "recommendation": string
  },
  "listingStructureInsights": string[],
  "imageStrategy": string,
  "reviewThemes": {
    "whatBuyersLove": string[],
    "commonComplaintsOrGaps": string[]
  },
  "exploitableGaps": string[],
  "suggestedVariations": string[],
  "isAiEstimate": true
}
`;
}

export function buildProductIdeasPrompt(category: string, count: number = 20): string {
  return `
Brainstorm ${count} profitable, distinctive Etsy product ideas in the category: "${category}".
Ensure ideas vary across niches, difficulty levels, and price points.
For each idea provide:
- id: unique string (e.g., "idea-1")
- productName: appealing product name
- targetCustomer: specific buyer persona
- problemSolved: what emotional or practical need it fills
- productFormat: "Digital PDF" | "SVG/Cut File" | "Physical Handmade" | "Print on Demand" | "Template" | "Pattern"
- suggestedPrice: reasonable Etsy retail price
- difficulty: "Beginner" | "Intermediate" | "Advanced"
- seoKeywords: 4-5 high-conversion search keywords
- differentiationAngle: unique twist that stands out in Etsy search
- demandEstimate: "High" | "Very High" | "Medium"

Output an array of ${count} JSON objects.
`;
}

export function buildCustomerReplyPrompt(message: string, context?: string, scenario?: string): string {
  return `
Generate 3 distinct, Etsy-seller-friendly customer responses for this buyer inquiry:
Scenario: ${scenario || 'General Inquiry'}
Context: ${context || 'Friendly Etsy Shop Seller'}
Buyer Message: "${message}"

Generate:
1. Professional: Polished, reassuring, standard business etiquette.
2. Friendly: Warm, enthusiastic, personalized craft-seller voice.
3. Short: Concise, clear, direct to the point (great for quick mobile messaging).
Include customization notes reminding the seller where to insert tracking, download links, or customer names.

Output JSON:
{
  "professional": string,
  "friendly": string,
  "short": string,
  "customizationNotes": string,
  "detectedTopic": string,
  "isAiEstimate": true
}
`;
}

export function buildShopAuditPrompt(shopData: any): string {
  return `
Perform an exhaustive Etsy Shop Health Audit based on the seller's shop profile:
Shop Name: ${shopData.shopName || 'Etsy Shop'}
Category: ${shopData.category || 'General'}
Product Count: ${shopData.listingCount || '15'}
Monthly Sales: ${shopData.monthlySales || '10-25'}
Product Types: ${shopData.productType || 'Digital & Physical'}
Primary Goal: ${shopData.goal || 'Get more sales'}

Calculate:
- Shop Health Score (0-100)
- Radar Scores (0-100 each for SEO, Product Strategy, Listing Quality, Keyword Coverage, Conversion Messaging, Product Diversity)
- Concise Executive Summary
- Top 10 High-Impact Action Items with priority ('Critical' | 'High' | 'Medium'), clear impact statement, category, and exact suggested fix.

Output JSON:
{
  "shopHealthScore": number,
  "radarScores": {
    "seo": number,
    "productStrategy": number,
    "listingQuality": number,
    "keywordCoverage": number,
    "conversionMessaging": number,
    "productDiversity": number
  },
  "summary": string,
  "top10Actions": [
    {
      "priority": "Critical" | "High" | "Medium",
      "action": string,
      "impact": string,
      "category": string,
      "suggestedFix": string
    }
  ],
  "isAiEstimate": true
}
`;
}
