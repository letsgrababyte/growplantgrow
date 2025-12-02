'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';

interface ProductScrollerProps {
  products: Product[];
  title?: string;
}

export default function ProductScroller({ products, title = 'Shop Our Products' }: ProductScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleFavoriteClick = async (productId: string) => {
    await toggleFavorite(productId, true); // Require auth
  };
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 px-4 bg-botanical-cream-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-botanical-green-800">
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full bg-botanical-green-100 text-botanical-green-700 hover:bg-botanical-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full bg-botanical-green-100 text-botanical-green-700 hover:bg-botanical-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative group"
            >
              {/* Favorite Heart Button */}
              <button
                onClick={() => handleFavoriteClick(product.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
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

              {/* Deal Indicator */}
              {product.isFeatured && (
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Featured
                </div>
              )}

              <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative w-full h-48 bg-botanical-green-100">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="256px"
                  />
                </div>
              </Link>

              <div className="p-4">
                <div className="mb-1">
                  <span className="text-xs text-botanical-green-600 font-medium">
                    {product.category}
                  </span>
                </div>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="text-lg font-serif text-botanical-green-900 mb-2 hover:text-botanical-green-700 transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-serif text-botanical-green-800">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="px-4 py-2 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

