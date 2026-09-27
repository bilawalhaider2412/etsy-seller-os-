import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  CanvaDesignRecord,
  CanvaDesignBrief,
  CanvaIntegrationStatus,
  BrandKit,
  CanvaDesignType,
  CanvaLayoutStyle,
  CanvaTemplate,
} from '../../lib/canva/canva-types.ts';
import { CANVA_TEMPLATES } from '../../lib/canva/canva-templates.ts';
import {
  getCanvaWorkflowUrl,
  openCanvaWindow,
} from '../../lib/canva/canva-client.ts';
import { canvaService } from '../../services/canva/canvaService.ts';
import { CanvaConnectModal } from './CanvaConnectModal.tsx';
import { CanvaDesignBriefModal } from './CanvaDesignBriefModal.tsx';
import { EtsyImageGuidancePanel } from './EtsyImageGuidancePanel.tsx';
import { ProductItem } from '../../types/index.ts';
import {
  Sparkles,
  Plus,
  Layers,
  Palette,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Copy,
  Edit3,
  Bookmark,
  Store,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  UploadCloud,
  FileCheck,
  Layout,
  Instagram,
  Share2,
  Sliders,
  Camera,
  FolderDown,
  Wand2,
} from 'lucide-react';

type CanvaTab = 'create' | 'designs' | 'templates' | 'brand_kit' | 'exported';

export const CanvaStudioView: React.FC = () => {
  const {
    products,
    shopProfile,
    activeWorkspaceId,
    showToast,
    user,
    setActiveTab,
    setPrefillListingData,
  } = useApp();

  // Active subtab
  const [activeSubTab, setActiveSubTab] = useState<CanvaTab>('create');

  // Canva connection status
  const [canvaStatus, setCanvaStatus] = useState<CanvaIntegrationStatus>({
    canvaConnected: false,
    connectionStatus: 'disconnected',
    scopes: [],
  });
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Saved designs state
  const [designs, setDesigns] = useState<CanvaDesignRecord[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [designSearchQuery, setDesignSearchQuery] = useState('');

  // Design Creator Flow State
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedDesignType, setSelectedDesignType] = useState<CanvaDesignType>('etsy_listing_main');
  const [selectedLayoutStyle, setSelectedLayoutStyle] = useState<CanvaLayoutStyle>('Elegant');
  const [customBriefNotes, setCustomBriefNotes] = useState('');
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<CanvaDesignBrief | null>(null);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  // Brand Kit State
  const [brandKit, setBrandKit] = useState<BrandKit>({
    brandName: shopProfile?.shopName || 'Artisan Workshop',
    primaryColor: '#b45309',
    secondaryColor: '#78350f',
    accentColor: '#f59e0b',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    style: 'Elegant & Handmade',
    tone: 'Warm, authentic, and artisan crafted',
    shopUrl: 'https://etsy.com/shop/' + (shopProfile?.shopName?.toLowerCase().replace(/\s+/g, '') || 'artisan'),
    socialHandles: '@artisanhandcrafted',
  });
  const [aiBrandPrompt, setAiBrandPrompt] = useState('Make my Etsy graphics look earthy, minimalist and handmade with organic terracotta tones');
  const [isAiBrandLoading, setIsAiBrandLoading] = useState(false);

  // Templates filter
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<'All' | 'Etsy' | 'Social Media' | 'Marketing' | 'Digital Preview'>('All');

  // Load initial status & designs
  useEffect(() => {
    async function initCanva() {
      setLoadingDesigns(true);
      try {
        const [status, fetchedDesigns, savedBrandKit] = await Promise.all([
          canvaService.getStatus(activeWorkspaceId),
          canvaService.getDesigns(activeWorkspaceId),
          canvaService.getBrandKit(activeWorkspaceId),
        ]);
        setCanvaStatus(status);
        setDesigns(fetchedDesigns);
        if (savedBrandKit) setBrandKit(savedBrandKit);
      } catch (err) {
        console.warn('Canva initial load notice:', err);
      } finally {
        setLoadingDesigns(false);
      }
    }
    initCanva();
  }, [activeWorkspaceId]);

  // Set default product when products list loads
  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // -------------------------------------------------------------
  // Design Creation & AI Generation
  // -------------------------------------------------------------
  const handleGenerateDesignBrief = async () => {
    if (!selectedProduct) {
      showToast('Please choose a product first', 'error');
      return;
    }

    setIsGeneratingBrief(true);
    try {
      const brief = await canvaService.generateDesignBrief({
        product: selectedProduct,
        designType: selectedDesignType,
        layoutStyle: selectedLayoutStyle,
        brandKit,
        customNotes: customBriefNotes,
      });

      setGeneratedBrief(brief);
      setIsBriefModalOpen(true);
      showToast('AI Canva Design Brief generated with 6-image sequence!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate design brief', 'error');
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleLaunchCanvaAndSave = async (template?: CanvaTemplate) => {
    if (!selectedProduct) return;

    const title = `${selectedProduct.title} - ${selectedLayoutStyle} ${selectedDesignType.replace(/_/g, ' ')}`;
    const url = getCanvaWorkflowUrl({
      designType: selectedDesignType,
      templateUrl: template?.canvaTemplateUrl,
      queryTitle: selectedProduct.title,
    });

    // 1. Open official Canva in new tab
    openCanvaWindow(url);

    // 2. Persist design reference in database
    try {
      const newDesign = await canvaService.saveDesign({
        workspaceId: activeWorkspaceId,
        userId: user?.uid || 'user_default',
        productId: selectedProduct.id,
        canvaDesignId: `canva_${Date.now()}`,
        designName: title,
        designType: selectedDesignType,
        templateId: template?.id || 'tmpl_custom',
        thumbnailUrl: template?.thumbnailUrl || selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        canvaUrl: url,
        status: 'in_progress',
        layoutStyle: selectedLayoutStyle,
        brief: generatedBrief || undefined,
      });

      setDesigns((prev) => [newDesign, ...prev]);
      showToast('Canva opened! Design reference saved to My Designs.', 'success');
    } catch (err: any) {
      console.warn('Save design fallback:', err);
    }
  };

  const handleDeleteDesign = async (id: string) => {
    if (!confirm('Remove this design from your library?')) return;
    try {
      await canvaService.deleteDesign(id, activeWorkspaceId);
      setDesigns((prev) => prev.filter((d) => d.id !== id));
      showToast('Design reference removed', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete design', 'error');
    }
  };

  const handleDuplicateDesign = async (design: CanvaDesignRecord) => {
    try {
      const duplicated = await canvaService.saveDesign({
        ...design,
        id: undefined,
        designName: `${design.designName} (Copy)`,
        createdAt: new Date().toISOString(),
      });
      setDesigns((prev) => [duplicated, ...prev]);
      showToast('Duplicated design reference', 'success');
    } catch (err: any) {
      showToast('Failed to duplicate design', 'error');
    }
  };

  const handleAttachToListing = (design: CanvaDesignRecord) => {
    // Attach to product/listing and route to Listing Generator/Optimizer
    const matchedProduct = products.find((p) => p.id === design.productId);
    if (matchedProduct) {
      setPrefillListingData({
        title: matchedProduct.title,
        description: matchedProduct.description,
        tags: matchedProduct.tags,
        price: matchedProduct.price,
        category: matchedProduct.category,
        attachedCanvaDesign: design,
      });
      showToast(`Attached "${design.designName}" to Etsy Listing Generator!`, 'success');
      setActiveTab('generator');
    } else {
      showToast('Design marked as attached to listing', 'success');
      canvaService.updateDesign(design.id, { status: 'attached' }).then((updated) => {
        setDesigns((prev) => prev.map((d) => (d.id === design.id ? updated : d)));
      });
    }
  };

  // -------------------------------------------------------------
  // AI Brand Assistant
  // -------------------------------------------------------------
  const handleGenerateBrandKitWithAi = async () => {
    if (!aiBrandPrompt.trim()) return;
    setIsAiBrandLoading(true);
    try {
      const recommended = await canvaService.generateBrandRecommendations(
        aiBrandPrompt,
        shopProfile?.category
      );
      const updated = {
        ...brandKit,
        ...recommended,
      };
      setBrandKit(updated);
      await canvaService.saveBrandKit(activeWorkspaceId, updated);
      showToast('AI Brand Assistant generated color palette and fonts!', 'success');
    } catch (err: any) {
      showToast('Failed to generate brand recommendations', 'error');
    } finally {
      setIsAiBrandLoading(false);
    }
  };

  const handleSaveBrandKit = async () => {
    try {
      await canvaService.saveBrandKit(activeWorkspaceId, brandKit);
      showToast('Brand Kit saved and linked to Canva generation briefs!', 'success');
    } catch {
      showToast('Failed to save brand kit', 'error');
    }
  };

  // Filtered designs
  const filteredDesigns = designs.filter((d) =>
    d.designName.toLowerCase().includes(designSearchQuery.toLowerCase()) ||
    d.designType.toLowerCase().includes(designSearchQuery.toLowerCase())
  );

  // Filtered templates
  const filteredTemplates = CANVA_TEMPLATES.filter((t) =>
    templateCategoryFilter === 'All' ? true : t.category === templateCategoryFilter
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Canva Integration &amp; Visual Design Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Canva Studio
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Create professional Etsy listing graphics, what's-included breakdowns, size guides, and marketing designs in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {canvaStatus.canvaConnected ? (
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/30 transition-colors"
                title="View Canva connection details"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Canva Connected</span>
              </button>
            ) : (
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Connect Canva</span>
              </button>
            )}

            <button
              onClick={() => setActiveSubTab('create')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Design</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-stone-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'create'
                ? 'bg-white text-stone-900 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Design</span>
          </button>

          <button
            onClick={() => setActiveSubTab('designs')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'designs'
                ? 'bg-white text-stone-900 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Designs ({designs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'templates'
                ? 'bg-white text-stone-900 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveSubTab('brand_kit')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'brand_kit'
                ? 'bg-white text-stone-900 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Brand Kit</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exported')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'exported'
                ? 'bg-white text-stone-900 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Exported Assets</span>
          </button>
        </div>
      </div>

      {/* 2. SUBTAB: CREATE DESIGN FLOW */}
      {activeSubTab === 'create' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Select Product & Design Type */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Selector */}
              <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                      Select Etsy Product
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500">
                    {products.length} products available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {products.map((prod) => {
                    const isSelected = selectedProduct?.id === prod.id;
                    return (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-sm ring-2 ring-amber-500/20'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
                          {prod.imageUrl ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Store className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-stone-900 dark:text-white truncate">
                            {prod.title}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            {prod.category} • ${prod.price}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Design Type Selector */}
              <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                    Choose Design Category
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'etsy_listing_main', label: 'Etsy Hero Listing Image', desc: '4:3 high-contrast search thumbnail' },
                    { id: 'etsy_whats_included', label: "What's Included Breakdown", desc: 'Package checklist & digital files' },
                    { id: 'etsy_features', label: 'Features & Callouts', desc: 'Craftsmanship & benefits pointer' },
                    { id: 'etsy_size_guide', label: 'Size & Dimensions Guide', desc: 'Visual scale and measurement specs' },
                    { id: 'pinterest_pin', label: 'Viral Pinterest Pin', desc: '2:3 vertical traffic driver' },
                    { id: 'instagram_post', label: 'Instagram Post / Story', desc: 'Square & story promotional graphics' },
                  ].map((type) => {
                    const isSelected = selectedDesignType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setSelectedDesignType(type.id as CanvaDesignType)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30'
                        }`}
                      >
                        <p className="font-bold text-xs text-stone-900 dark:text-white">
                          {type.label}
                        </p>
                        <p className="text-[11px] text-stone-500 leading-snug">
                          {type.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Layout Style Selector */}
              <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                    Choose Visual Layout Style
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Minimal',
                    'Elegant',
                    'Handmade',
                    'Modern',
                    'Playful',
                    'Luxury',
                    'Beginner-friendly',
                  ].map((style) => {
                    const isSelected = selectedLayoutStyle === style;
                    return (
                      <button
                        key={style}
                        onClick={() => setSelectedLayoutStyle(style as CanvaLayoutStyle)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                    Custom Notes or Promotion Hook (Optional)
                  </label>
                  <input
                    type="text"
                    value={customBriefNotes}
                    onChange={(e) => setCustomBriefNotes(e.target.value)}
                    placeholder="e.g. Free shipping, organic cotton certified, includes step-by-step video..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 Right Column: AI Generation & Launch */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-sm">
                  <Wand2 className="w-4 h-4 text-amber-500" />
                  <span>AI Design Assistant</span>
                </div>

                {selectedProduct ? (
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2 text-xs">
                    <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Selected Target
                    </p>
                    <p className="font-extrabold text-stone-900 dark:text-white truncate">
                      {selectedProduct.title}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Category: {selectedProduct.category} • Style: {selectedLayoutStyle}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to formulate 6-image sequence</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">Please choose an Etsy product first.</p>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleGenerateDesignBrief}
                    disabled={isGeneratingBrief || !selectedProduct}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isGeneratingBrief ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Formulating AI Design Plan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate AI Design Brief &amp; Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleLaunchCanvaAndSave()}
                    disabled={!selectedProduct}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Straight in Canva Editor</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                  Opens Canva's official developer layout intent with predefined dimensions.
                </p>
              </div>

              {/* Etsy Image Guidance Helper Panel */}
              <EtsyImageGuidancePanel />
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBTAB: MY DESIGNS */}
      {activeSubTab === 'designs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={designSearchQuery}
                onChange={(e) => setDesignSearchQuery(e.target.value)}
                placeholder="Search saved Canva designs..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={() => setActiveSubTab('create')}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Design</span>
            </button>
          </div>

          {loadingDesigns ? (
            <div className="py-16 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading saved Canva design records...</span>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 space-y-3">
              <Layers className="w-8 h-8 text-stone-300 dark:text-stone-700 mx-auto" />
              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                No Canva Designs Found
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Create your first Etsy listing graphics set or social media pin using our AI Design Assistant.
              </p>
              <button
                onClick={() => setActiveSubTab('create')}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold"
              >
                Start Designing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDesigns.map((design) => {
                const linkedProduct = products.find((p) => p.id === design.productId);
                return (
                  <div
                    key={design.id}
                    className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    {/* Thumbnail preview */}
                    <div className="h-44 bg-stone-100 dark:bg-stone-800 relative overflow-hidden">
                      <img
                        src={design.thumbnailUrl}
                        alt={design.designName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white">
                          {design.layoutStyle || 'Modern'}
                        </span>
                        {design.status === 'attached' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                            Attached to Listing
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                          {design.designName}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Product: {linkedProduct?.title || 'Etsy Shop Item'}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          Last edited: {new Date(design.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => openCanvaWindow(design.canvaUrl)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 hover:from-cyan-700 hover:to-blue-700 transition-all shadow-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open in Canva</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleAttachToListing(design)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            title="Attach to Etsy Listing Generator"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateDesign(design)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            title="Duplicate Design"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDesign(design.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. SUBTAB: TEMPLATES CATALOG */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {['All', 'Etsy', 'Social Media', 'Marketing', 'Digital Preview'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateCategoryFilter(cat as any)}
                className={`px-4 py-2 rounded-2xl transition-all ${
                  templateCategoryFilter === cat
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="h-44 bg-stone-100 dark:bg-stone-800 relative overflow-hidden">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white">
                      {template.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-stone-200 backdrop-blur-sm">
                      {template.dimensions}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                      {template.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.variables.map((v) => (
                        <span
                          key={v}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                        >
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-400">
                      Style: {template.defaultLayoutStyle}
                    </span>

                    <button
                      onClick={() => handleLaunchCanvaAndSave(template)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SUBTAB: BRAND KIT & AI BRAND ASSISTANT */}
      {activeSubTab === 'brand_kit' && (
        <div className="space-y-6 max-w-4xl">
          {/* AI Brand Assistant Banner */}
          <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                  AI Brand Identity Assistant
                </h3>
                <p className="text-xs text-stone-500">
                  Tell the AI your desired aesthetic (e.g. "Earthy cottagecore with botanical typography") and we'll configure your Brand Kit.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={aiBrandPrompt}
                onChange={(e) => setAiBrandPrompt(e.target.value)}
                placeholder="Describe your brand vibe..."
                className="flex-1 w-full px-4 py-2.5 rounded-2xl text-xs border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleGenerateBrandKitWithAi}
                disabled={isAiBrandLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition-all disabled:opacity-50"
              >
                {isAiBrandLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Brand Specs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Brand Kit Config Form */}
          <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Visual Brand Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandKit.brandName}
                  onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Etsy Shop URL
                </label>
                <input
                  type="text"
                  value={brandKit.shopUrl}
                  onChange={(e) => setBrandKit({ ...brandKit, shopUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              {/* Color Palette */}
              <div className="sm:col-span-2 space-y-2 pt-2">
                <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                  Color Palette (Hex Codes)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
                    <input
                      type="color"
                      value={brandKit.primaryColor}
                      onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <div>
                      <p className="text-[10px] text-stone-400">Primary</p>
                      <p className="font-mono font-bold text-xs">{brandKit.primaryColor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
                    <input
                      type="color"
                      value={brandKit.secondaryColor}
                      onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <div>
                      <p className="text-[10px] text-stone-400">Secondary</p>
                      <p className="font-mono font-bold text-xs">{brandKit.secondaryColor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
                    <input
                      type="color"
                      value={brandKit.accentColor}
                      onChange={(e) => setBrandKit({ ...brandKit, accentColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <div>
                      <p className="text-[10px] text-stone-400">Accent</p>
                      <p className="font-mono font-bold text-xs">{brandKit.accentColor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Heading Font (Canva Compatible)
                </label>
                <input
                  type="text"
                  value={brandKit.headingFont}
                  onChange={(e) => setBrandKit({ ...brandKit, headingFont: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Body Font (Canva Compatible)
                </label>
                <input
                  type="text"
                  value={brandKit.bodyFont}
                  onChange={(e) => setBrandKit({ ...brandKit, bodyFont: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Brand Voice &amp; Copy Tone
                </label>
                <textarea
                  rows={2}
                  value={brandKit.tone}
                  onChange={(e) => setBrandKit({ ...brandKit, tone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveBrandKit}
                className="px-6 py-2.5 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm"
              >
                Save Brand Kit Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBTAB: EXPORTED ASSETS */}
      {activeSubTab === 'exported' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Exported Etsy Listing Assets &amp; Graphics
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
              Canva graphics associated with your Etsy shop. Once you finish editing your designs in Canva, you can export them at 2700x2025px PNG or JPG and attach them directly to your Etsy listings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {designs.map((design, idx) => (
                <div
                  key={design.id}
                  className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2.5"
                >
                  <div className="h-32 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800">
                    <img
                      src={design.thumbnailUrl}
                      alt={design.designName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-bold text-xs text-stone-900 dark:text-white truncate">
                    {design.designName}
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-400">Slot #{idx + 1}</span>
                    <button
                      onClick={() => handleAttachToListing(design)}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      Attach to Listing →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      <CanvaConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        status={canvaStatus}
        workspaceId={activeWorkspaceId}
        onStatusChanged={(s) => setCanvaStatus(s)}
        showToast={showToast}
      />

      {/* AI Design Brief Modal */}
      <CanvaDesignBriefModal
        brief={generatedBrief}
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        onDesignLaunched={() => handleLaunchCanvaAndSave()}
        showToast={showToast}
      />
    </div>
  );
};
