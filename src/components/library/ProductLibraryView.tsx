import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ProductItem } from '../../types/index.ts';
import { uploadWorkspaceFile } from '../../lib/firebase/firebase-storage.ts';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  Download,
  Tag,
  CheckCircle2,
  Sparkles,
  X,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Palette,
} from 'lucide-react';

export const ProductLibraryView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, setActiveTab, setPrefillOptimizerData, showToast, activeWorkspaceId } =
    useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Idea' | 'Draft' | 'Ready' | 'Published' | 'Needs Optimization'>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form for new/editing product
  const [modalForm, setModalForm] = useState<Partial<ProductItem>>({
    title: '',
    category: 'Handmade Crafts',
    productType: 'Digital',
    price: 9.99,
    status: 'Draft',
    seoScore: 80,
    tags: [],
    description: '',
    notes: '',
    imageUrl: '',
  });

  const statuses = ['All', 'Idea', 'Draft', 'Ready', 'Published', 'Needs Optimization'] as const;

  const filtered = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setModalForm({
      title: '',
      category: 'Crochet & Sewing',
      productType: 'Digital',
      price: 6.99,
      status: 'Draft',
      seoScore: 78,
      tags: ['handmade craft', 'instant download', 'artisan pdf'],
      description: 'Full product details and description...',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setSelectedProduct(p);
    setModalForm(p);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(10);
    try {
      const res = await uploadWorkspaceFile(
        activeWorkspaceId || 'ws_default',
        'products',
        file,
        (progress) => setUploadProgress(progress)
      );
      setModalForm((prev) => ({
        ...prev,
        imageUrl: res.url,
      }));
      showToast('Uploaded image to Firebase Storage!');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, modalForm);
    } else {
      await addProduct(modalForm);
    }
    setIsModalOpen(false);
  };

  const handleOptimizeProduct = (p: ProductItem) => {
    setPrefillOptimizerData({
      title: p.title,
      description: p.description,
      tags: p.tags?.join(', '),
      price: `$${p.price}`,
      category: p.category,
    });
    setActiveTab('optimizer');
  };

  const exportLibraryCSV = () => {
    const rows = [
      ['Title', 'Category', 'Format', 'Price', 'Status', 'SEO Score', 'Views', 'Orders', 'Revenue', 'Tags'],
      ...products.map((p) => [
        `"${p.title.replace(/"/g, '""')}"`,
        p.category,
        p.productType,
        p.price,
        p.status,
        p.seoScore,
        p.views || 0,
        p.orders || 0,
        p.revenue || 0,
        `"${(p.tags || []).join(', ')}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `etsy_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported inventory to CSV!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <Package className="w-4 h-4" />
            </span>
            <h1 className="text-lg font-extrabold text-stone-900 dark:text-white">
              Etsy Product &amp; Listing Library
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Manage your shop catalog across all lifecycle stages: Ideas, Drafts, Ready, and Published.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportLibraryCSV}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or tags..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
          />
        </div>

        {/* Status Pill Tabs */}
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 font-semibold text-[11px] bg-stone-50/50 dark:bg-stone-800/40">
                <th className="py-3 px-4">Item &amp; Category</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">SEO Score</th>
                <th className="py-3 px-2">Performance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'}
                        alt={prod.title}
                        className="w-11 h-11 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                      <div className="max-w-md">
                        <div className="font-bold text-stone-900 dark:text-white line-clamp-1 hover:text-amber-600 cursor-pointer" onClick={() => handleOpenEdit(prod)}>
                          {prod.title}
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span>{prod.tags?.length || 0} tags</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                      {prod.productType}
                    </span>
                  </td>

                  <td className="py-3 px-2 font-bold text-stone-900 dark:text-white">
                    ${prod.price.toFixed(2)}
                  </td>

                  <td className="py-3 px-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prod.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : prod.status === 'Needs Optimization'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : prod.status === 'Ready'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </td>

                  <td className="py-3 px-2">
                    <span className="font-extrabold text-stone-900 dark:text-white">
                      {prod.seoScore}/100
                    </span>
                  </td>

                  <td className="py-3 px-2 text-[11px] text-stone-500">
                    <div>{prod.views || 0} views • {prod.orders || 0} orders</div>
                    <div className="font-semibold text-emerald-600">${(prod.revenue || 0).toFixed(2)}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setActiveTab('canva');
                          showToast(`Opened Canva Studio for "${prod.title}"!`, 'info');
                        }}
                        className="p-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Create Canva Graphics"
                      >
                        <Palette className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOptimizeProduct(prod)}
                        className="p-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white transition-colors"
                        title="Optimize with AI"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-xs max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/40">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                {selectedProduct ? 'Edit Product Details' : 'Add New Product to Library'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Product Title</label>
                <input
                  type="text"
                  required
                  value={modalForm.title || ''}
                  onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modalForm.price || 0}
                    onChange={(e) => setModalForm({ ...modalForm, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Status</label>
                  <select
                    value={modalForm.status || 'Draft'}
                    onChange={(e: any) => setModalForm({ ...modalForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Draft">Draft</option>
                    <option value="Ready">Ready</option>
                    <option value="Published">Published</option>
                    <option value="Needs Optimization">Needs Optimization</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">SEO Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={modalForm.seoScore || 80}
                    onChange={(e) => setModalForm({ ...modalForm, seoScore: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Description</label>
                <textarea
                  rows={4}
                  value={modalForm.description || ''}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={modalForm.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span>Product Image (Firebase Storage)</span>
                  <span className="text-[10px] text-stone-400">Stores to workspaces/{activeWorkspaceId}/products/</span>
                </label>
                <div className="flex items-center gap-3">
                  {modalForm.imageUrl ? (
                    <img
                      src={modalForm.imageUrl}
                      alt="Product preview"
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading ({uploadProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload Image to Firebase</span>
                        </>
                      )}
                    </button>
                    {uploadingImage && (
                      <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Internal Shop Notes</label>
                <input
                  type="text"
                  value={modalForm.notes || ''}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  placeholder="e.g. Schedule photo reshoot next week"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  {selectedProduct ? 'Update Product' : 'Add to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
