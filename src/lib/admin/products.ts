import { createClient } from '@/lib/supabase/server';

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  short_description?: string;
  tags: string[];
  thumbnailUrl: string;
  previewImages: string[];
  fileType: string;
  pageCount: number;
  file_size_mb?: number;
  isFeatured: boolean;
  lemonSqueezyUrl: string;
  lemon_squeezy_product_id?: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  seo_title?: string;
  seo_description?: string;
  meta_keywords?: string[];
  view_count: number;
  favorite_count: number;
  sales_count: number;
  revenue: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by?: string;
}

/**
 * Get all products (admin only - includes all statuses)
 */
export async function getAllAdminProducts(): Promise<AdminProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching admin products:', error);
    return [];
  }
  
  return (data || []).map(transformProduct);
}

/**
 * Get product by ID (admin)
 */
export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  
  return transformProduct(data);
}

/**
 * Create a new product
 */
export async function createProduct(productData: Partial<AdminProduct>): Promise<AdminProduct | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      title: productData.title,
      slug: productData.slug,
      description: productData.description,
      short_description: productData.short_description,
      price: productData.price,
      category: productData.category,
      tags: productData.tags || [],
      thumbnail_url: productData.thumbnailUrl,
      preview_images: productData.previewImages || [],
      file_type: productData.fileType,
      page_count: productData.pageCount,
      file_size_mb: productData.file_size_mb,
      is_featured: productData.isFeatured || false,
      status: productData.status || 'draft',
      lemon_squeezy_url: productData.lemonSqueezyUrl,
      lemon_squeezy_product_id: productData.lemon_squeezy_product_id,
      seo_title: productData.seo_title,
      seo_description: productData.seo_description,
      meta_keywords: productData.meta_keywords || [],
      created_by: user?.id,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  
  return transformProduct(data);
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  productData: Partial<AdminProduct>
): Promise<AdminProduct | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  
  const updateData: any = {};
  
  if (productData.title !== undefined) updateData.title = productData.title;
  if (productData.slug !== undefined) updateData.slug = productData.slug;
  if (productData.description !== undefined) updateData.description = productData.description;
  if (productData.short_description !== undefined) updateData.short_description = productData.short_description;
  if (productData.price !== undefined) updateData.price = productData.price;
  if (productData.category !== undefined) updateData.category = productData.category;
  if (productData.tags !== undefined) updateData.tags = productData.tags;
  if (productData.thumbnailUrl !== undefined) updateData.thumbnail_url = productData.thumbnailUrl;
  if (productData.previewImages !== undefined) updateData.preview_images = productData.previewImages;
  if (productData.fileType !== undefined) updateData.file_type = productData.fileType;
  if (productData.pageCount !== undefined) updateData.page_count = productData.pageCount;
  if (productData.file_size_mb !== undefined) updateData.file_size_mb = productData.file_size_mb;
  if (productData.isFeatured !== undefined) updateData.is_featured = productData.isFeatured;
  if (productData.status !== undefined) updateData.status = productData.status;
  if (productData.lemonSqueezyUrl !== undefined) updateData.lemon_squeezy_url = productData.lemonSqueezyUrl;
  if (productData.lemon_squeezy_product_id !== undefined) updateData.lemon_squeezy_product_id = productData.lemon_squeezy_product_id;
  if (productData.seo_title !== undefined) updateData.seo_title = productData.seo_title;
  if (productData.seo_description !== undefined) updateData.seo_description = productData.seo_description;
  if (productData.meta_keywords !== undefined) updateData.meta_keywords = productData.meta_keywords;
  
  if (productData.status === 'active' && !updateData.published_at) {
    updateData.published_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  return transformProduct(data);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
}

/**
 * Transform database product to AdminProduct
 */
function transformProduct(dbProduct: any): AdminProduct {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    slug: dbProduct.slug,
    price: parseFloat(dbProduct.price),
    category: dbProduct.category,
    description: dbProduct.description || '',
    tags: dbProduct.tags || [],
    thumbnailUrl: dbProduct.thumbnail_url || '',
    previewImages: dbProduct.preview_images || [],
    fileType: dbProduct.file_type || '',
    pageCount: dbProduct.page_count || 0,
    isFeatured: dbProduct.is_featured || false,
    lemonSqueezyUrl: dbProduct.lemon_squeezy_url || '',
    status: dbProduct.status || 'draft',
    seo_title: dbProduct.seo_title,
    seo_description: dbProduct.seo_description,
    meta_keywords: dbProduct.meta_keywords || [],
    view_count: dbProduct.view_count || 0,
    favorite_count: dbProduct.favorite_count || 0,
    sales_count: dbProduct.sales_count || 0,
    revenue: parseFloat(dbProduct.revenue || '0'),
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    published_at: dbProduct.published_at,
    created_by: dbProduct.created_by,
  };
}

