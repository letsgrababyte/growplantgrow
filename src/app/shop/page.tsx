'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getAllProducts, getAllCategories, filterProducts, Product } from '@/lib/products';
import SectionHeading from '@/components/SectionHeading';
import ProductFeed from '@/components/ProductFeed';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<string[]>(getAllCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    setSelectedCategory(category);
    setSearchQuery(search);
  }, [searchParams]);

  useEffect(() => {
    const allProducts = getAllProducts();
    const filtered = filterProducts(allProducts, {
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
    });
    setProducts(filtered);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? '' : category;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <SectionHeading
          title="Shop"
          subtitle="Browse our collection of botanical digital products"
        />

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-botanical-green-800 mb-3">
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === ''
                      ? 'bg-botanical-green-600 text-botanical-cream-50'
                      : 'bg-botanical-green-100 text-botanical-green-800 hover:bg-botanical-green-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-botanical-green-600 text-botanical-cream-50'
                        : 'bg-botanical-green-100 text-botanical-green-800 hover:bg-botanical-green-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="mb-4">
              <p className="text-botanical-green-700">
                Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-botanical-green-600 hover:text-botanical-green-800 underline"
                >
                  Clear
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Products */}
        <div className="mb-4">
          <p className="text-botanical-green-700">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        <ProductFeed products={products} />
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-botanical-green-700">Loading...</div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

