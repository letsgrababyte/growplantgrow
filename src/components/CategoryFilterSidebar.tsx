'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products';

interface CategoryFilterSidebarProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  categoryName: string;
}

export default function CategoryFilterSidebar({ 
  products, 
  onFilterChange,
  categoryName 
}: CategoryFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'featured'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags from products
  const allTags = Array.from(new Set(products.flatMap(p => p.tags))).sort();
  
  // Get price range
  const prices = products.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(p => 
        p.price >= priceRange.min && p.price <= priceRange.max
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => 
        selectedTags.some(tag => p.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'featured':
        default:
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
      }
    });

    onFilterChange(filtered);
  }, [products, priceRange, selectedTags, sortBy, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setPriceRange(prev => {
      if (!prev) {
        return type === 'min' 
          ? { min: value, max: maxPrice }
          : { min: minPrice, max: value };
      }
      return {
        ...prev,
        [type]: value
      };
    });
  };

  const clearFilters = () => {
    setPriceRange(null);
    setSelectedTags([]);
    setSortBy('featured');
  };

  // Apply filters when state changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-4 py-3 bg-botanical-green-600 text-white rounded-md hover:bg-botanical-green-700 transition-colors flex items-center justify-between"
        >
          <span className="font-medium">Filters & Sort</span>
          <svg
            className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Sidebar */}
      <aside
        className={`${
          showFilters ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 lg:mb-0 lg:mr-6`}
      >
        <div className="space-y-6">
          {/* Sort Section */}
          <div>
            <h3 className="text-lg font-serif text-botanical-green-800 mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                applyFilters();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-lg font-serif text-botanical-green-800 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange?.min || minPrice}
                  onChange={(e) => handlePriceRangeChange('min', parseFloat(e.target.value) || minPrice)}
                  onBlur={applyFilters}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange?.max || maxPrice}
                  onChange={(e) => handlePriceRangeChange('max', parseFloat(e.target.value) || maxPrice)}
                  onBlur={applyFilters}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
                />
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div>
              <h3 className="text-lg font-serif text-botanical-green-800 mb-3">Tags</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allTags.map(tag => (
                  <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => {
                        handleTagToggle(tag);
                        setTimeout(applyFilters, 0);
                      }}
                      className="w-4 h-4 text-botanical-green-600 border-gray-300 rounded focus:ring-botanical-green-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(priceRange || selectedTags.length > 0 || sortBy !== 'featured') && (
            <button
              onClick={() => {
                clearFilters();
                setTimeout(applyFilters, 0);
              }}
              className="w-full px-4 py-2 text-sm text-botanical-green-700 border border-botanical-green-300 rounded-md hover:bg-botanical-green-50 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

