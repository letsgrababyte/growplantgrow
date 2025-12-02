'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import SectionHeading from '@/components/SectionHeading';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getAllProducts, getProductBySlug, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error getting user:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [supabase, router]);

  useEffect(() => {
    if (favorites.length > 0) {
      const allProducts = getAllProducts();
      const products = favorites
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);
      setFavoriteProducts(products);
    } else {
      setFavoriteProducts([]);
    }
  }, [favorites]);

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-botanical-green-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading
            title="My Favorites"
            subtitle={`${favorites.length} saved ${favorites.length === 1 ? 'item' : 'items'}`}
          />
          <Button href="/account" variant="outline">
            Back to Account
          </Button>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="bg-botanical-cream-100 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-botanical-green-300 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
              No favorites yet
            </h3>
            <p className="text-botanical-green-600 mb-6">
              Start saving your favorite products by clicking the heart icon on any product.
            </p>
            <Button href="/shop">Browse Products</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

