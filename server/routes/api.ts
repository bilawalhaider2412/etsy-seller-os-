import { Router, Request, Response } from 'express';
import { getAIProvider } from '../ai/provider.ts';
import { db, ProductItem } from '../db/store.ts';

export const apiRouter = Router();

// Middleware to track usage
function trackUsage() {
  db.subscription.generationsUsed += 1;
  db.adminMetrics.totalAIGenerations += 1;
}

// 1. AI Product Research
apiRouter.post('/ai/product-research', async (req: Request, res: Response) => {
  try {
    const { query, category, type } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const results = await provider.generateProductResearch(query, category, type);
    res.json({ results });
  } catch (err: any) {
    console.error('Error in /ai/product-research:', err);
    res.status(500).json({ error: err?.message || 'Failed to research products' });
  }
});

// 2. AI SEO Keywords
apiRouter.post('/ai/keywords', async (req: Request, res: Response) => {
  try {
    const { seedKeyword, shopCategory } = req.body;
    if (!seedKeyword) {
      return res.status(400).json({ error: 'Seed keyword is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const result = await provider.generateKeywords(seedKeyword, shopCategory || db.shopProfile.category);
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/keywords:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate keywords' });
  }
});

// 3. AI Listing Generator
apiRouter.post('/ai/generate-listing', async (req: Request, res: Response) => {
  try {
    const { productName, category, type, targetAudience, features, materials, tone } = req.body;
    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const result = await provider.generateListing({
      productName,
      category,
      type,
      targetAudience,
      features,
      materials,
      tone,
    });
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/generate-listing:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate listing' });
  }
});

// 4. Listing Optimizer
apiRouter.post('/ai/optimize-listing', async (req: Request, res: Response) => {
  try {
    const { title, description, tags, price, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    trackUsage();
    db.subscription.listingsOptimized += 1;
    const provider = getAIProvider();
    const result = await provider.optimizeListing({
      title,
      description,
      tags,
      price,
      category,
    });
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/optimize-listing:', err);
    res.status(500).json({ error: err?.message || 'Failed to optimize listing' });
  }
});

// 5. Competitor Analyzer
apiRouter.post('/ai/analyze-competitor', async (req: Request, res: Response) => {
  try {
    const { queryOrUrl, category } = req.body;
    if (!queryOrUrl) {
      return res.status(400).json({ error: 'URL or product query is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const result = await provider.analyzeCompetitor(queryOrUrl, category || db.shopProfile.category);
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/analyze-competitor:', err);
    res.status(500).json({ error: err?.message || 'Failed to analyze competitor' });
  }
});

// 6. AI Product Ideas
apiRouter.post('/ai/product-ideas', async (req: Request, res: Response) => {
  try {
    const { category, count } = req.body;
    trackUsage();
    const provider = getAIProvider();
    const results = await provider.generateProductIdeas(category || db.shopProfile.category, count || 20);
    res.json({ results });
  } catch (err: any) {
    console.error('Error in /ai/product-ideas:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate product ideas' });
  }
});

// 7. Mockup / Image Strategy
apiRouter.post('/ai/mockup-strategy', async (req: Request, res: Response) => {
  try {
    const { productName, category } = req.body;
    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const result = await provider.generateMockupStrategy(productName, category);
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/mockup-strategy:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate mockup strategy' });
  }
});

// 8. Customer Reply
apiRouter.post('/ai/customer-reply', async (req: Request, res: Response) => {
  try {
    const { message, context, scenario } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const result = await provider.generateCustomerReply(message, context, scenario);
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/customer-reply:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate reply' });
  }
});

// 9. Shop Audit
apiRouter.post('/ai/shop-audit', async (req: Request, res: Response) => {
  try {
    trackUsage();
    const provider = getAIProvider();
    const result = await provider.generateShopAudit(db.shopProfile);
    db.auditHistory.unshift({ timestamp: new Date().toISOString(), ...result });
    res.json({ result });
  } catch (err: any) {
    console.error('Error in /ai/shop-audit:', err);
    res.status(500).json({ error: err?.message || 'Failed to audit shop' });
  }
});

// 10. AI Copilot
apiRouter.post('/ai/copilot', async (req: Request, res: Response) => {
  try {
    const { query, history } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    trackUsage();
    const provider = getAIProvider();
    const answer = await provider.generateCopilotResponse(
      query,
      {
        shopName: db.shopProfile.shopName,
        category: db.shopProfile.category,
        listingsCount: db.products.length,
        monthlySales: db.shopProfile.monthlySales,
        goal: db.shopProfile.primaryGoal,
      },
      history
    );
    res.json({ answer });
  } catch (err: any) {
    console.error('Error in /ai/copilot:', err);
    res.status(500).json({ error: err?.message || 'CoPilot generation failed' });
  }
});

// --- SHOP PROFILE & ONBOARDING ---
apiRouter.get('/profile', (req: Request, res: Response) => {
  res.json({ profile: db.shopProfile });
});

apiRouter.post('/profile', (req: Request, res: Response) => {
  db.shopProfile = {
    ...db.shopProfile,
    ...req.body,
  };
  res.json({ profile: db.shopProfile });
});

// --- PRODUCT LIBRARY CRUD ---
apiRouter.get('/products', (req: Request, res: Response) => {
  res.json({ products: db.products });
});

apiRouter.post('/products', (req: Request, res: Response) => {
  const newProduct: ProductItem = {
    id: `prod-${Date.now()}`,
    title: req.body.title || 'Untitled Product',
    category: req.body.category || db.shopProfile.category,
    productType: req.body.productType || 'Digital',
    price: Number(req.body.price) || 9.99,
    status: req.body.status || 'Draft',
    seoScore: Number(req.body.seoScore) || 75,
    views: req.body.views || 0,
    favorites: req.body.favorites || 0,
    orders: req.body.orders || 0,
    revenue: req.body.revenue || 0,
    conversionRate: req.body.conversionRate || 0,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    materials: Array.isArray(req.body.materials) ? req.body.materials : [],
    description: req.body.description || '',
    notes: req.body.notes || '',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  db.shopProfile.listingCount = db.products.length;
  res.status(201).json({ product: newProduct });
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ product: db.products[idx] });
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products.splice(idx, 1);
  db.shopProfile.listingCount = db.products.length;
  res.json({ success: true });
});

// --- SAVED KEYWORDS ---
apiRouter.get('/keywords', (req: Request, res: Response) => {
  res.json({ keywords: db.savedKeywords });
});

apiRouter.post('/keywords', (req: Request, res: Response) => {
  const newKw = {
    id: `kw-${Date.now()}`,
    phrase: req.body.phrase,
    score: req.body.score || 85,
    competition: req.body.competition || 'Medium',
    intent: req.body.intent || 'High Commercial',
    tagsCount: req.body.tagsCount || 13,
    addedAt: new Date().toISOString(),
  };
  db.savedKeywords.unshift(newKw);
  res.status(201).json({ keyword: newKw });
});

apiRouter.delete('/keywords/:id', (req: Request, res: Response) => {
  db.savedKeywords = db.savedKeywords.filter((k) => k.id !== req.params.id);
  res.json({ success: true });
});

// --- ANALYTICS ---
apiRouter.get('/analytics', (req: Request, res: Response) => {
  res.json({ analytics: db.analytics });
});

apiRouter.post('/analytics', (req: Request, res: Response) => {
  db.analytics = {
    ...db.analytics,
    ...req.body,
  };
  res.json({ analytics: db.analytics });
});

// --- COMPETITORS ---
apiRouter.get('/competitors', (req: Request, res: Response) => {
  res.json({ competitors: db.competitors });
});

apiRouter.post('/competitors', (req: Request, res: Response) => {
  const comp = {
    id: `comp-${Date.now()}`,
    ...req.body,
    addedAt: new Date().toISOString(),
  };
  db.competitors.unshift(comp);
  res.status(201).json({ competitor: comp });
});

// --- SUBSCRIPTIONS & BILLING ---
apiRouter.get('/subscription', (req: Request, res: Response) => {
  res.json({ subscription: db.subscription });
});

apiRouter.post('/subscription', (req: Request, res: Response) => {
  const { plan } = req.body;
  const planLimits: Record<string, { price: number; limit: number }> = {
    Free: { price: 0, limit: 5 },
    Starter: { price: 19, limit: 100 },
    Pro: { price: 49, limit: 500 },
    Business: { price: 99, limit: 2000 },
  };
  if (plan && planLimits[plan]) {
    db.subscription.plan = plan;
    db.subscription.priceMonthly = planLimits[plan].price;
    db.subscription.generationsLimit = planLimits[plan].limit;
  }
  res.json({ subscription: db.subscription });
});

// --- ETSY INTEGRATION SIMULATOR ---
apiRouter.post('/etsy/sync', (req: Request, res: Response) => {
  db.shopProfile.etsyConnected = true;
  db.shopProfile.lastSync = new Date().toISOString();
  res.json({
    success: true,
    message: 'Etsy shop synced successfully! Imported 24 listings, 366 orders, and current review scores.',
    shopProfile: db.shopProfile,
  });
});

// --- ADMIN DASHBOARD ---
apiRouter.get('/admin/metrics', (req: Request, res: Response) => {
  res.json({
    metrics: db.adminMetrics,
    subscriptionBreakdown: {
      pro: 480,
      starter: 290,
      business: 94,
      free: 556,
    },
    recentGenerations: [
      { tool: 'AI Listing Generator', user: 'oakandwillowco', timestamp: '2 min ago' },
      { tool: 'Etsy SEO Keywords', user: 'sweetcrochetco', timestamp: '5 min ago' },
      { tool: 'Product Research', user: 'linenandclay', timestamp: '8 min ago' },
      { tool: 'Listing Optimizer', user: 'plannerparadise', timestamp: '12 min ago' },
    ],
  });
});
