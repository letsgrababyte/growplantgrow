'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProduct } from '@/lib/admin/products';
import Image from 'next/image';

interface ProductEditorProps {
  product?: AdminProduct;
}

export default function ProductEditor({ product }: ProductEditorProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price || 0,
    category: product?.category || '',
    tags: product?.tags.join(', ') || '',
    file_type: product?.fileType || 'PDF',
    page_count: product?.pageCount || 0,
    file_size_mb: product?.file_size_mb || 0,
    is_featured: product?.isFeatured || false,
    status: product?.status || 'draft',
    lemon_squeezy_url: product?.lemonSqueezyUrl || '',
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
    meta_keywords: product?.meta_keywords?.join(', ') || '',
    thumbnail_url: product?.thumbnailUrl || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const keywordsArray = formData.meta_keywords
        .split(',')
        .map(kw => kw.trim())
        .filter(kw => kw.length > 0);

      const productData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price.toString()),
        category: formData.category,
        tags: tagsArray,
        thumbnailUrl: formData.thumbnail_url,
        previewImages: product?.previewImages || [],
        fileType: formData.file_type,
        pageCount: parseInt(formData.page_count.toString()),
        file_size_mb: formData.file_size_mb ? parseFloat(formData.file_size_mb.toString()) : undefined,
        isFeatured: formData.is_featured,
        status: formData.status as 'draft' | 'active' | 'inactive' | 'archived',
        lemonSqueezyUrl: formData.lemon_squeezy_url,
        seo_title: formData.seo_title || undefined,
        seo_description: formData.seo_description || undefined,
        meta_keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
      };

      const url = isEditing 
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-botanical-green-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-title"
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
              <p className="mt-1 text-xs text-botanical-green-600">
                URL-friendly identifier (leave empty to auto-generate from title)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief description for product cards"
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Details */}
        <div>
          <h2 className="text-lg font-semibold text-botanical-green-900 mb-4">Pricing & Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              >
                <option value="">Select category</option>
                <option value="Guides">Guides</option>
                <option value="Workbooks">Workbooks</option>
                <option value="Printables">Printables</option>
                <option value="Ebooks">Ebooks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                File Type
              </label>
              <input
                type="text"
                value={formData.file_type}
                onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                placeholder="PDF, ZIP, etc."
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Page Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.page_count}
                onChange={(e) => setFormData({ ...formData, page_count: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                File Size (MB)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.file_size_mb}
                onChange={(e) => setFormData({ ...formData, file_size_mb: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div>
          <h2 className="text-lg font-semibold text-botanical-green-900 mb-4">Media</h2>
          <div>
            <label className="block text-sm font-medium text-botanical-green-800 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
            />
            {formData.thumbnail_url && (
              <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-botanical-green-300">
                <Image
                  src={formData.thumbnail_url}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tags & SEO */}
        <div>
          <h2 className="text-lg font-semibold text-botanical-green-900 mb-4">Tags & SEO</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="SEO-optimized title"
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                SEO Description
              </label>
              <textarea
                rows={3}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="SEO meta description"
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Meta Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-lg font-semibold text-botanical-green-900 mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-botanical-green-800 mb-1">
                Lemon Squeezy URL
              </label>
              <input
                type="url"
                value={formData.lemon_squeezy_url}
                onChange={(e) => setFormData({ ...formData, lemon_squeezy_url: e.target.value })}
                placeholder="https://lemonsqueezy.com/..."
                className="w-full rounded-md border border-botanical-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 text-botanical-green-600 focus:ring-botanical-green-500 border-botanical-green-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-botanical-green-800">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-botanical-cream-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-botanical-green-700 bg-white border border-botanical-green-300 rounded-md hover:bg-botanical-cream-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-botanical-green-600 rounded-md hover:bg-botanical-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
}

