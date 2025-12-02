'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';
import Button from './Button';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = async () => {
    await toggleFavorite(product.id, true); // Require auth
  };

  return (
    <div className="bg-botanical-cream-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative group">
      {/* Favorite Heart Button */}
      <button
        onClick={handleFavoriteClick}
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
        <div className="relative w-full h-64 bg-botanical-green-100">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-botanical-green-600 font-medium">
            {product.category}
          </span>
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-xl font-serif text-botanical-green-900 mb-2 hover:text-botanical-green-700 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-botanical-green-700 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-serif text-botanical-green-800">
            ${product.price.toFixed(2)}
          </span>
          <Button href={`/shop/${product.slug}`} size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

