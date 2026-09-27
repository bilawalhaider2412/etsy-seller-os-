export type AppTab =
  | 'overview'
  | 'research'
  | 'ideas'
  | 'generator'
  | 'optimizer'
  | 'keywords'
  | 'competitors'
  | 'canva'
  | 'mockups'
  | 'replies'
  | 'library'
  | 'analytics'
  | 'audit'
  | 'billing'
  | 'admin'
  | 'landing';

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

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
