export interface ShopProfile {
  id: string;
  shopName: string;
  category: string;
  whatYouSell: string;
  productType: 'Digital' | 'Physical' | 'Both';
  targetMarket: string;
  listingCount: number;
  monthlySales: string;
  primaryGoal: string;
  etsyConnected: boolean;
  etsyShopId?: string;
  lastSync?: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  productType: 'Digital' | 'Physical' | 'Print on Demand' | 'Pattern' | 'Template';
  price: number;
  status: 'Idea' | 'Draft' | 'Ready' | 'Published' | 'Needs Optimization';
  seoScore: number;
  views: number;
  favorites: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  tags: string[];
  materials?: string[];
  description: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedKeyword {
  id: string;
  phrase: string;
  score: number;
  competition: 'Low' | 'Medium' | 'High';
  intent: string;
  tagsCount: number;
  addedAt: string;
}

export interface UserSubscription {
  plan: 'Free' | 'Starter' | 'Pro' | 'Business';
  priceMonthly: number;
  generationsLimit: number;
  generationsUsed: number;
  ideasSaved: number;
  listingsOptimized: number;
  billingCycleEnd: string;
  status: 'active' | 'trialing' | 'cancelled';
}

export interface AnalyticsData {
  timeframe: '7d' | '30d' | '90d' | 'year';
  totalRevenue: number;
  totalOrders: number;
  totalViews: number;
  totalFavorites: number;
  conversionRate: number;
  averageOrderValue: number;
  revenueHistory: Array<{ date: string; revenue: number; orders: number; views: number }>;
  topProducts: Array<{ id: string; title: string; revenue: number; orders: number; seoScore: number }>;
  underperforming: Array<{ id: string; title: string; views: number; conversion: number; issue: string; seoScore: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
  isEtsyData: boolean;
}

class MemoryStore {
  shopProfile: ShopProfile = {
    id: 'shop_001',
    shopName: 'Oak & Willow Craft Co.',
    category: 'Handmade Crafts & Patterns',
    whatYouSell: 'Crochet patterns, digital craft guides, and artisan pouch accessories',
    productType: 'Both',
    targetMarket: 'United States & UK Crafters (Ages 24-52)',
    listingCount: 24,
    monthlySales: '$2,850/mo',
    primaryGoal: 'Get more sales',
    etsyConnected: true,
    etsyShopId: 'oakandwillowco',
    lastSync: '2026-09-27T08:15:00Z',
    createdAt: '2026-01-15T10:00:00Z',
  };

  subscription: UserSubscription = {
    plan: 'Pro',
    priceMonthly: 49,
    generationsLimit: 500,
    generationsUsed: 42,
    ideasSaved: 16,
    listingsOptimized: 18,
    billingCycleEnd: '2026-10-15T00:00:00Z',
    status: 'active',
  };

  products: ProductItem[] = [
    {
      id: 'prod-101',
      title: 'Wildflower Meadow Zipper Pouch Sewing Pattern & Step-by-Step PDF Tutorial',
      category: 'Sewing & Patterns',
      productType: 'Pattern',
      price: 6.99,
      status: 'Needs Optimization',
      seoScore: 62,
      views: 1240,
      favorites: 142,
      orders: 28,
      revenue: 195.72,
      conversionRate: 2.25,
      tags: ['sewing pattern', 'zipper pouch', 'pdf tutorial', 'diy pouch pattern', 'craft pdf', 'handmade bag'],
      materials: ['PDF Digital Download', 'Illustrated Pattern Sheets', 'Video Link'],
      description: 'Step by step sewing instructions for a lined zipper pouch with boxed corners.',
      notes: 'Needs front-loaded title keywords and 7 missing tags filled out.',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-02-10T14:00:00Z',
      updatedAt: '2026-09-20T11:20:00Z',
    },
    {
      id: 'prod-102',
      title: 'Chunky Ribbed Crochet Beanie Pattern - Instant Beginner PDF Download',
      category: 'Crochet',
      productType: 'Pattern',
      price: 5.50,
      status: 'Published',
      seoScore: 94,
      views: 4890,
      favorites: 630,
      orders: 195,
      revenue: 1072.50,
      conversionRate: 3.98,
      tags: ['crochet beanie pdf', 'beginner crochet hat', 'ribbed winter hat', 'instant download', 'easy crochet pattern', 'diy knit beanie', 'cozy winter craft', 'chunky yarn hat', 'unisex beanie pattern', 'mens crochet hat', 'crochet gift idea', 'modern crochet pdf', 'fall craft pattern'],
      materials: ['Instant PDF Download', 'US / UK Terminology Chart'],
      description: 'Foolproof beginner friendly crochet beanie pattern designed for bulky yarn.',
      notes: 'Current bestseller! High click-through rate.',
      imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-03-01T09:30:00Z',
      updatedAt: '2026-09-24T16:45:00Z',
    },
    {
      id: 'prod-103',
      title: 'Minimalist Botanical Monthly Budget Planner Spreadsheet for Excel & Google Sheets',
      category: 'Printables & Templates',
      productType: 'Template',
      price: 12.99,
      status: 'Published',
      seoScore: 88,
      views: 3100,
      favorites: 412,
      orders: 84,
      revenue: 1091.16,
      conversionRate: 2.71,
      tags: ['budget spreadsheet', 'google sheets budget', 'excel expense tracker', 'monthly finance sheet', 'minimalist budget', 'digital money planner', 'debt payoff tracker', 'savings goal sheet', 'automatic budget tab', 'paycheck budget log', 'personal finance pdf', 'aesthetic sheet', 'instant download'],
      materials: ['Google Sheets Access', 'Excel File .xlsx', 'Instructions PDF'],
      description: 'Track income, sinking funds, debt snowball, and automatic expense summaries.',
      notes: 'Stable performer. Conversion improves during payday weekends.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-04-14T11:15:00Z',
      updatedAt: '2026-09-22T08:10:00Z',
    },
    {
      id: 'prod-104',
      title: 'Handmade Organic Lavender & Oatmeal Ceramic Bath Soap Bars (Set of 3)',
      category: 'Bath & Beauty',
      productType: 'Physical',
      price: 24.00,
      status: 'Published',
      seoScore: 78,
      views: 1850,
      favorites: 220,
      orders: 41,
      revenue: 984.00,
      conversionRate: 2.21,
      tags: ['organic soap set', 'lavender bath soap', 'oatmeal body bar', 'handmade soap gift', 'natural skincare bar', 'artisan cold process', 'spa gift box her', 'eco friendly bath', 'zero waste soap', 'cottagecore bath', 'self care package'],
      materials: ['Saponified Olive Oil', 'Shea Butter', 'Organic Lavender Buds', 'Colloidal Oatmeal'],
      description: 'Cold process gentle soap bars scented with pure essential oils.',
      notes: 'Good gift demand. Could add gift box mockup to increase conversion.',
      imageUrl: 'https://images.unsplash.com/photo-1607006314392-491a78ebc685?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-05-19T13:00:00Z',
      updatedAt: '2026-09-25T14:10:00Z',
    },
    {
      id: 'prod-105',
      title: 'Boho Linen Canvas Crossbody Tote Bag with Brass Hardware',
      category: 'Bags & Purses',
      productType: 'Physical',
      price: 48.00,
      status: 'Ready',
      seoScore: 85,
      views: 890,
      favorites: 110,
      orders: 16,
      revenue: 768.00,
      conversionRate: 1.80,
      tags: ['linen crossbody bag', 'canvas tote purse', 'boho messenger bag', 'handmade shoulder bag', 'eco friendly purse', 'artisan daily bag', 'minimalist tote gift', 'womens crossbody bag', 'durable cotton tote', 'brass zipper purse', 'travel shoulder bag', 'gift for mom', 'cottagecore tote'],
      materials: ['Washed Belgian Linen', 'Heavy Cotton Canvas', 'Solid Brass Zippers', 'Veg-Tan Leather Straps'],
      description: 'Everyday durable tote bag with interior pockets for laptop and water bottle.',
      notes: 'Ready for full launch with fall collection.',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-08-01T15:20:00Z',
      updatedAt: '2026-09-26T10:05:00Z',
    },
    {
      id: 'prod-106',
      title: 'Vintage Botanical Herbarium Wall Art Prints - 6 Pack Digital Download 300DPI',
      category: 'Digital Art',
      productType: 'Digital',
      price: 9.99,
      status: 'Draft',
      seoScore: 71,
      views: 340,
      favorites: 45,
      orders: 6,
      revenue: 59.94,
      conversionRate: 1.76,
      tags: ['botanical wall art', 'vintage herb prints', 'printable gallery set', 'pressed flower art', 'cottagecore wall art', 'kitchen decor prints', 'instant art download'],
      materials: ['High Res 300 DPI JPEGs', 'Print Ratio Size Guide'],
      description: 'Set of 6 antique herbarium scientific illustration prints.',
      notes: 'Needs 6 more tags and high-contrast hero mockup.',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      createdAt: '2026-09-12T16:00:00Z',
      updatedAt: '2026-09-26T12:00:00Z',
    },
  ];

  savedKeywords: SavedKeyword[] = [
    { id: 'kw-1', phrase: 'crochet baby blanket pattern', score: 94, competition: 'Medium', intent: 'High Commercial', tagsCount: 13, addedAt: '2026-09-25T10:00:00Z' },
    { id: 'kw-2', phrase: 'budget spreadsheet google sheets', score: 91, competition: 'Medium', intent: 'High Commercial', tagsCount: 13, addedAt: '2026-09-24T12:30:00Z' },
    { id: 'kw-3', phrase: 'handmade ceramic soap dish', score: 86, competition: 'Low', intent: 'Gifting', tagsCount: 13, addedAt: '2026-09-22T09:15:00Z' },
    { id: 'kw-4', phrase: 'zipper pouch sewing tutorial', score: 79, competition: 'Low', intent: 'DIY Craft', tagsCount: 13, addedAt: '2026-09-20T14:40:00Z' },
    { id: 'kw-5', phrase: 'adhd daily planner printable', score: 89, competition: 'Medium', intent: 'Self Care', tagsCount: 13, addedAt: '2026-09-18T16:20:00Z' },
  ];

  analytics: AnalyticsData = {
    timeframe: '30d',
    totalRevenue: 4171.32,
    totalOrders: 366,
    totalViews: 12310,
    totalFavorites: 1559,
    conversionRate: 2.97,
    averageOrderValue: 11.40,
    revenueHistory: [
      { date: 'Sep 01', revenue: 112, orders: 10, views: 380 },
      { date: 'Sep 05', revenue: 145, orders: 13, views: 420 },
      { date: 'Sep 10', revenue: 198, orders: 17, views: 560 },
      { date: 'Sep 15', revenue: 164, orders: 14, views: 490 },
      { date: 'Sep 20', revenue: 235, orders: 21, views: 680 },
      { date: 'Sep 25', revenue: 210, orders: 19, views: 620 },
      { date: 'Sep 27', revenue: 185, orders: 16, views: 540 },
    ],
    topProducts: [
      { id: 'prod-103', title: 'Minimalist Botanical Monthly Budget Planner', revenue: 1091.16, orders: 84, seoScore: 88 },
      { id: 'prod-102', title: 'Chunky Ribbed Crochet Beanie Pattern', revenue: 1072.50, orders: 195, seoScore: 94 },
      { id: 'prod-104', title: 'Handmade Lavender & Oatmeal Bath Soap Bars', revenue: 984.00, orders: 41, seoScore: 78 },
      { id: 'prod-105', title: 'Boho Linen Canvas Crossbody Tote Bag', revenue: 768.00, orders: 16, seoScore: 85 },
      { id: 'prod-101', title: 'Wildflower Meadow Zipper Pouch Sewing Pattern', revenue: 195.72, orders: 28, seoScore: 62 },
    ],
    underperforming: [
      { id: 'prod-101', title: 'Wildflower Meadow Zipper Pouch Sewing Pattern', views: 1240, conversion: 2.25, issue: 'Low SEO Score (62/100) & Missing 7 Tag Slots', seoScore: 62 },
      { id: 'prod-106', title: 'Vintage Botanical Herbarium Wall Art Prints', views: 340, conversion: 1.76, issue: 'Insufficient photo mockups and unoptimized tags', seoScore: 71 },
    ],
    trafficSources: [
      { source: 'Etsy Search', percentage: 58 },
      { source: 'Etsy App & Other Pages', percentage: 22 },
      { source: 'Direct & Pinterest Traffic', percentage: 14 },
      { source: 'Social Media / Instagram', percentage: 6 },
    ],
    isEtsyData: true,
  };

  competitors: any[] = [
    {
      id: 'comp-1',
      shopName: 'The Cozy Stitch Co.',
      salesCount: '18,420 sales',
      rating: '4.9 (2,810 reviews)',
      starSeller: true,
      category: 'Crochet Patterns',
      priceRange: '$5.00 – $8.50',
      keyStrengths: ['Video tutorials linked in PDF', 'Cohesive pastel branding', 'Bundle discounts'],
      vulnerabilities: ['No left-handed versions', 'Single sizes only', 'Slow customer response on weekends'],
      addedAt: '2026-09-20T10:00:00Z',
    },
    {
      id: 'comp-2',
      shopName: 'Clean Slate Studio',
      salesCount: '34,190 sales',
      rating: '5.0 (4,920 reviews)',
      starSeller: true,
      category: 'Spreadsheets & Templates',
      priceRange: '$12.00 – $22.00',
      keyStrengths: ['Currency conversion included', 'Video setup guides', 'Free monthly updates'],
      vulnerabilities: ['Complex tabs intimidate beginners', 'No dark mode variant'],
      addedAt: '2026-09-22T14:00:00Z',
    },
  ];

  auditHistory: any[] = [];
  adminMetrics = {
    totalUsers: 1420,
    activeSubscribers: 864,
    mrr: 28940,
    totalAIGenerations: 124800,
    apiHealth: '100% Operational',
    avgResponseTimeMs: 412,
  };
}

export const db = new MemoryStore();
