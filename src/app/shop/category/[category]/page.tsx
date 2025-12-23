'use client';

import { useState, useMemo, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getAllProducts, filterProducts, getFeaturedProducts, Product } from '@/lib/products';
import EtsyProductGrid from '@/components/EtsyProductGrid';
import CategoryFilterSidebar from '@/components/CategoryFilterSidebar';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// All valid categories (from CategoryScroller)
const validCategories = [
  'Planners',
  'Journals',
  'Coloring Pages',
  'Wall Art',
  'Botanical Papers',
  'Garden Planners',
  'Wedding',
  'Kids & School',
  'Home Organizing',
  'Labels & Stickers',
  'Recipe Cards',
  'Business Templates',
  'Branding Kits',
  'Canva Templates',
  'Digital Notebooks',
  'GoodNotes Planners',
  'Activity Packs',
  'Ebooks',
  'Guides & Workbooks',
  'Bundles',
  'Mega Packs',
  'Seasonal',
  'Holiday',
  'Mindfulness',
  'Manifestation',
  'Moon Journals',
  'Classroom Posters',
  'Kids Printables',
  'Vintage Botanicals',
  'Freebies',
];

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default function CategoryPage() {
  const params = useParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Decode the category name from URL
  const categoryName = decodeURIComponent(params.category as string);
  
  // Check if category is valid
  if (!validCategories.includes(categoryName)) {
    notFound();
  }

  // Get all products and filter by category (case-insensitive matching)
  const allProducts = getAllProducts();
  const categoryProducts = useMemo(() => {
    return filterProducts(allProducts, {
      category: categoryName,
    });
  }, [categoryName]);

  // Get featured products from this category
  const featuredCategoryProducts = useMemo(() => {
    return categoryProducts.filter(p => p.isFeatured);
  }, [categoryProducts]);
  
  // Initialize filtered products when category changes
  useEffect(() => {
    setFilteredProducts(categoryProducts);
  }, [categoryProducts]);

  // If no products found, still show the page but with empty state
  const hasProducts = categoryProducts.length > 0;
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : categoryProducts;

  return (
    <div>
      {/* Category Header */}
      <div className="bg-botanical-green-50 py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-botanical-green-900 mb-3 sm:mb-4">
              {categoryName}
            </h1>
            <p className="text-base sm:text-lg text-botanical-green-700">
              {hasProducts 
                ? `Browse our collection of ${categoryName.toLowerCase()} - ${categoryProducts.length} ${categoryProducts.length === 1 ? 'product' : 'products'} available`
                : `Explore our ${categoryName.toLowerCase()} collection`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid with Filters - Same style as home page */}
      {hasProducts ? (
        <div className="py-4 sm:py-8 px-2 sm:px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row">
              {/* Filter Sidebar */}
              <CategoryFilterSidebar
                products={categoryProducts}
                onFilterChange={setFilteredProducts}
                categoryName={categoryName}
              />
              
              {/* Products Grid */}
              <div className="flex-1">
                <EtsyProductGrid
                  products={displayProducts}
                  title={`All ${categoryName}`}
                  featuredTitle={`Featured ${categoryName}`}
                  featuredProducts={featuredCategoryProducts}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 px-4 sm:px-6">
          <div className="container mx-auto text-center">
            <p className="text-lg text-botanical-green-700 mb-4">
              No products found in this category yet.
            </p>
            <a
              href="/shop"
              className="inline-block px-6 py-3 bg-botanical-green-600 text-white rounded-md hover:bg-botanical-green-700 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        </div>
      )}

      {/* Features Section - Same as home page */}
      <section className="bg-botanical-green-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
                Expert Guides
              </h3>
              <p className="text-botanical-green-700">
                Comprehensive guides written by plant enthusiasts for plant lovers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
                Instant Download
              </h3>
              <p className="text-botanical-green-700">
                Get your digital products immediately after purchase
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🖨️</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
                Print at Home
              </h3>
              <p className="text-botanical-green-700">
                High-quality PDFs ready to print and use in your home
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

