export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // AI Endpoints
  productResearch: (data: { query: string; category?: string; type?: string }) =>
    fetchJson<{ results: any[] }>('/api/ai/product-research', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  keywords: (data: { seedKeyword: string; shopCategory?: string }) =>
    fetchJson<{ result: any }>('/api/ai/keywords', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateListing: (data: any) =>
    fetchJson<{ result: any }>('/api/ai/generate-listing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  optimizeListing: (data: any) =>
    fetchJson<{ result: any }>('/api/ai/optimize-listing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  analyzeCompetitor: (data: { queryOrUrl: string; category?: string }) =>
    fetchJson<{ result: any }>('/api/ai/analyze-competitor', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  productIdeas: (data: { category?: string; count?: number }) =>
    fetchJson<{ results: any[] }>('/api/ai/product-ideas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  mockupStrategy: (data: { productName: string; category?: string }) =>
    fetchJson<{ result: any }>('/api/ai/mockup-strategy', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  customerReply: (data: { message: string; context?: string; scenario?: string }) =>
    fetchJson<{ result: any }>('/api/ai/customer-reply', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  shopAudit: () =>
    fetchJson<{ result: any }>('/api/ai/shop-audit', {
      method: 'POST',
    }),

  copilot: (data: { query: string; history?: any[] }) =>
    fetchJson<{ answer: string }>('/api/ai/copilot', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Shop Profile
  getProfile: () => fetchJson<{ profile: any }>('/api/profile'),
  updateProfile: (profile: any) =>
    fetchJson<{ profile: any }>('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),

  // Products
  getProducts: () => fetchJson<{ products: any[] }>('/api/products'),
  createProduct: (product: any) =>
    fetchJson<{ product: any }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, product: any) =>
    fetchJson<{ product: any }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),
  deleteProduct: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // Keywords
  getKeywords: () => fetchJson<{ keywords: any[] }>('/api/keywords'),
  saveKeyword: (data: any) =>
    fetchJson<{ keyword: any }>('/api/keywords', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteKeyword: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/keywords/${id}`, {
      method: 'DELETE',
    }),

  // Analytics
  getAnalytics: () => fetchJson<{ analytics: any }>('/api/analytics'),
  updateAnalytics: (data: any) =>
    fetchJson<{ analytics: any }>('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Competitors
  getCompetitors: () => fetchJson<{ competitors: any[] }>('/api/competitors'),
  addCompetitor: (data: any) =>
    fetchJson<{ competitor: any }>('/api/competitors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Subscription
  getSubscription: () => fetchJson<{ subscription: any }>('/api/subscription'),
  updateSubscription: (plan: string) =>
    fetchJson<{ subscription: any }>('/api/subscription', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),

  // Etsy sync
  syncEtsy: () => fetchJson<any>('/api/etsy/sync', { method: 'POST' }),

  // Admin
  getAdminMetrics: () => fetchJson<any>('/api/admin/metrics'),
};
