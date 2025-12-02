import productsData from '@/data/products.json';

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  previewImages: string[];
  fileType: string;
  pageCount: number;
  isFeatured: boolean;
  lemonSqueezyUrl: string;
}

export function getAllProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsData.find((product) => product.slug === slug) as Product | undefined;
}

export function getFeaturedProducts(): Product[] {
  return productsData.filter((product) => product.isFeatured) as Product[];
}

export function getProductsByCategory(category: string): Product[] {
  return productsData.filter((product) => product.category === category) as Product[];
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return productsData.filter(
    (product) =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      product.category.toLowerCase().includes(lowerQuery)
  ) as Product[];
}

export function getAllCategories(): string[] {
  const categories = new Set(productsData.map((product) => product.category));
  return Array.from(categories).sort();
}

export function filterProducts(
  products: Product[],
  options: {
    category?: string;
    search?: string;
  }
): Product[] {
  let filtered = [...products];

  if (options.category) {
    filtered = filtered.filter((product) => product.category === options.category);
  }

  if (options.search) {
    const lowerSearch = options.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lowerSearch)) ||
        product.category.toLowerCase().includes(lowerSearch)
    );
  }

  return filtered;
}

