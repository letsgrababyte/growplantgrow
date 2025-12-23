'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';

interface EtsyProductGridProps {
  products: Product[];
  title?: string;
  featuredTitle?: string;
  featuredProducts?: Product[];
}

export default function EtsyProductGrid({ 
  products, 
  title = 'Shop Our Products',
  featuredTitle,
  featuredProducts
}: EtsyProductGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Determine featured products: use provided featuredProducts, or filter by isFeatured, or use first 8
  const displayFeaturedProducts = featuredProducts 
    ? featuredProducts 
    : products.filter(p => p.isFeatured).length > 0 
      ? products.filter(p => p.isFeatured).slice(0, 8)
      : products.slice(0, 8);
  
  const displayFeaturedTitle = featuredTitle || 'Featured Products';

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [displayFeaturedProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Split products for two-column grid
  const column1Products = products.filter((_, index) => index % 2 === 0);
  const column2Products = products.filter((_, index) => index % 2 === 1);

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4 bg-white">
      <div className="container mx-auto">
        {/* Horizontal Scroll Section - Top */}
        {displayFeaturedProducts.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-botanical-green-800">
                {displayFeaturedTitle}
              </h2>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="p-2 sm:p-2.5 rounded-full bg-botanical-green-100 text-botanical-green-700 hover:bg-botanical-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="p-2 sm:p-2.5 rounded-full bg-botanical-green-100 text-botanical-green-700 hover:bg-botanical-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

            <div
              ref={scrollRef}
              className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayFeaturedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isHorizontal={true} />
              ))}
            </div>
          </div>
        )}

        {/* Two Column Grid Section - Below */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-botanical-green-800 mb-4 sm:mb-6">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {column1Products.map((product) => (
                <ProductCard key={product.id} product={product} isHorizontal={false} />
              ))}
            </div>
            <div className="space-y-6">
              {column2Products.map((product) => (
                <ProductCard key={product.id} product={product} isHorizontal={false} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, isHorizontal }: { product: Product; isHorizontal: boolean }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleFavoriteClick = async () => {
    await toggleFavorite(product.id, true); // Require auth
  };

  if (isHorizontal) {
    return (
      <div className="flex-shrink-0 w-56 sm:w-64 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative group">
        {/* Favorite Heart */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
              isFavorite(product.id)
                ? 'text-red-500 fill-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
            fill={isFavorite(product.id) ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Deal Badge */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}

        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative w-full h-40 sm:h-48 bg-botanical-green-100">
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 640px) 224px, 256px"
            />
          </div>
        </Link>

        <div className="p-2 sm:p-3">
          <div className="mb-1">
            <span className="text-xs text-botanical-green-600 font-medium">
              {product.category}
            </span>
          </div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-sm sm:text-base font-serif text-botanical-green-900 mb-1 hover:text-botanical-green-700 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-base sm:text-lg font-serif text-botanical-green-800 font-bold">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="px-3 sm:px-4 py-2 bg-botanical-green-600 text-white text-xs sm:text-sm rounded hover:bg-botanical-green-700 transition-colors min-h-[44px] whitespace-nowrap"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vertical card for two-column grid
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative group">
      {/* Favorite Heart */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm"
        aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            isFavorite(product.id)
              ? 'text-red-500 fill-red-500'
              : 'text-gray-400 hover:text-red-500'
          }`}
          fill={isFavorite(product.id) ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Deal Badge */}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
          Featured
        </div>
      )}

      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative w-full h-64 bg-botanical-green-100">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-botanical-green-600 font-medium">
            {product.category}
          </span>
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-base font-serif text-botanical-green-900 mb-2 hover:text-botanical-green-700 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-botanical-green-700 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-serif text-botanical-green-800 font-bold">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="px-4 py-2 bg-botanical-green-600 text-white text-sm rounded hover:bg-botanical-green-700 transition-colors"
            >
              Add to Cart
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className="px-4 py-2 border border-botanical-green-600 text-botanical-green-700 text-sm rounded hover:bg-botanical-green-50 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

