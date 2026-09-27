import {
  CanvaDesignRecord,
  CanvaDesignBrief,
  CanvaIntegrationStatus,
  BrandKit,
  CanvaDesignType,
  CanvaLayoutStyle,
} from '../../lib/canva/canva-types.ts';
import { ProductItem } from '../../types/index.ts';

/**
 * Canva Frontend API Service
 * Interacts with /api/canva backend routes and provides fallback Firestore synchronization.
 */
class CanvaService {
  private baseApiUrl = '/api/canva';

  /**
   * Check connection status
   */
  async getStatus(workspaceId: string): Promise<CanvaIntegrationStatus> {
    try {
      const res = await fetch(`${this.baseApiUrl}/status?workspaceId=${encodeURIComponent(workspaceId)}`);
      if (!res.ok) throw new Error('Failed to fetch Canva status');
      return await res.json();
    } catch (err) {
      console.warn('Canva status check fallback:', err);
      return {
        canvaConnected: false,
        connectionStatus: 'disconnected',
        scopes: [],
      };
    }
  }

  /**
   * Retrieve OAuth Authorization URL for Canva Connect API
   */
  async getAuthUrl(workspaceId: string): Promise<{ url: string; state: string }> {
    const res = await fetch(`${this.baseApiUrl}/auth-url?workspaceId=${encodeURIComponent(workspaceId)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate Canva auth URL');
    }
    return await res.json();
  }

  /**
   * Disconnect Canva account
   */
  async disconnect(workspaceId: string): Promise<void> {
    const res = await fetch(`${this.baseApiUrl}/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId }),
    });
    if (!res.ok) throw new Error('Failed to disconnect Canva');
  }

  /**
   * Generate an AI-assisted design brief and structured slide sequence
   */
  async generateDesignBrief(params: {
    product: Partial<ProductItem>;
    designType: CanvaDesignType;
    layoutStyle: CanvaLayoutStyle;
    slideCount?: number;
    brandKit?: Partial<BrandKit>;
    customNotes?: string;
  }): Promise<CanvaDesignBrief> {
    const res = await fetch(`${this.baseApiUrl}/ai/design-brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate design brief');
    }
    const data = await res.json();
    return data.brief;
  }

  /**
   * Run AI Brand Assistant to convert style text to palette/typography specs
   */
  async generateBrandRecommendations(prompt: string, shopCategory?: string): Promise<Partial<BrandKit>> {
    const res = await fetch(`${this.baseApiUrl}/ai/brand-kit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, shopCategory }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate brand recommendations');
    }
    const data = await res.json();
    return data.brandKit;
  }

  /**
   * Fetch saved designs for the active workspace
   */
  async getDesigns(workspaceId: string): Promise<CanvaDesignRecord[]> {
    try {
      const res = await fetch(`${this.baseApiUrl}/designs?workspaceId=${encodeURIComponent(workspaceId)}`);
      if (!res.ok) throw new Error('Failed to fetch designs');
      const data = await res.json();
      return data.designs || [];
    } catch (err) {
      console.warn('Canva designs fetch fallback:', err);
      return [];
    }
  }

  /**
   * Save a newly created or linked Canva design
   */
  async saveDesign(design: Partial<CanvaDesignRecord>): Promise<CanvaDesignRecord> {
    const res = await fetch(`${this.baseApiUrl}/designs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save Canva design reference');
    }
    const data = await res.json();
    return data.design;
  }

  /**
   * Update design reference (status, name, attachment)
   */
  async updateDesign(id: string, updates: Partial<CanvaDesignRecord>): Promise<CanvaDesignRecord> {
    const res = await fetch(`${this.baseApiUrl}/designs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update design');
    const data = await res.json();
    return data.design;
  }

  /**
   * Delete a saved design
   */
  async deleteDesign(id: string, workspaceId: string): Promise<void> {
    const res = await fetch(`${this.baseApiUrl}/designs/${encodeURIComponent(id)}?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete design');
  }

  /**
   * Fetch Brand Kit
   */
  async getBrandKit(workspaceId: string): Promise<BrandKit> {
    try {
      const res = await fetch(`${this.baseApiUrl}/brand-kit?workspaceId=${encodeURIComponent(workspaceId)}`);
      if (!res.ok) throw new Error('Failed to fetch brand kit');
      const data = await res.json();
      return data.brandKit;
    } catch {
      return {
        brandName: 'Artisan Wood & Leather',
        primaryColor: '#b45309',
        secondaryColor: '#78350f',
        accentColor: '#f59e0b',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        style: 'Elegant & Handmade',
        tone: 'Warm, authentic, and artisan crafted',
        shopUrl: 'https://etsy.com/shop/artisancreations',
        socialHandles: '@artisanhandcrafted',
      };
    }
  }

  /**
   * Save Brand Kit
   */
  async saveBrandKit(workspaceId: string, brandKit: BrandKit): Promise<BrandKit> {
    const res = await fetch(`${this.baseApiUrl}/brand-kit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, brandKit }),
    });
    if (!res.ok) throw new Error('Failed to save brand kit');
    const data = await res.json();
    return data.brandKit;
  }
}

export const canvaService = new CanvaService();
