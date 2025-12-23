'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();
  const { cartCount } = useCart();
  const [ordersCount, setOrdersCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Try to get session first
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await Promise.all([
            loadOrdersCount(session.user.id),
            loadDownloadsCount(session.user.id),
          ]);
        } else {
          // Fallback to getUser
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setUser(user);
            await Promise.all([
              loadOrdersCount(user.id),
              loadDownloadsCount(user.id),
            ]);
          } else {
            router.push('/signin');
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        Promise.all([
          loadOrdersCount(session.user.id),
          loadDownloadsCount(session.user.id),
        ]);
      } else {
        router.push('/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const loadOrdersCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (!error && count !== null) {
        setOrdersCount(count);
      }
    } catch (error) {
      console.error('Error loading orders count:', error);
    }
  };

  const loadDownloadsCount = async (userId: string) => {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', userId);

      if (ordersError) throw ordersError;

      if (orders && orders.length > 0) {
        const orderIds = orders.map((o: { id: string }) => o.id);
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id')
          .in('order_id', orderIds);

        if (!itemsError && items) {
          // Count unique products
          const uniqueProducts = new Set(items.map((item: { product_id: string }) => item.product_id));
          setDownloadsCount(uniqueProducts.size);
        }
      }
    } catch (error) {
      console.error('Error loading downloads count:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

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
        <SectionHeading
          title="My Account"
          subtitle="Manage your account, orders, and preferences"
        />

        {/* Profile Header Card */}
        <div className="bg-botanical-cream-100 rounded-lg p-6 mb-6 border border-botanical-green-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-botanical-green-800 text-botanical-cream-50 flex items-center justify-center font-semibold text-xl">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-botanical-green-800">
                Welcome back!
              </h2>
              <p className="text-botanical-green-600">{user.email}</p>
              <p className="text-sm text-botanical-green-500 mt-1">
                Member since {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
            <Button href="/settings" variant="outline">
              Edit Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link
            href="/account/favorites"
            className="bg-white rounded-lg p-6 border border-botanical-green-200 hover:border-botanical-green-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-botanical-green-800">{favorites.length}</p>
                <p className="text-sm text-botanical-green-600">Favorites</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/orders"
            className="bg-white rounded-lg p-6 border border-botanical-green-200 hover:border-botanical-green-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-botanical-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-botanical-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-botanical-green-800">{ordersCount}</p>
                <p className="text-sm text-botanical-green-600">Orders</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cart"
            className="bg-white rounded-lg p-6 border border-botanical-green-200 hover:border-botanical-green-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-botanical-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-botanical-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-botanical-green-800">{cartCount}</p>
                <p className="text-sm text-botanical-green-600">Cart Items</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/downloads"
            className="bg-white rounded-lg p-6 border border-botanical-green-200 hover:border-botanical-green-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-botanical-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-botanical-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-botanical-green-800">{downloadsCount}</p>
                <p className="text-sm text-botanical-green-600">Downloads</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-botanical-cream-100 rounded-lg p-8 border border-botanical-green-200">
          <h3 className="text-xl font-serif text-botanical-green-800 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button href="/shop" variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Browse Shop</p>
                <p className="text-xs text-botanical-green-600">Discover new products</p>
              </div>
            </Button>

            <Button href="/account/favorites" variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">My Favorites</p>
                <p className="text-xs text-botanical-green-600">{favorites.length} saved items</p>
              </div>
            </Button>

            <Button href="/account/orders" variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Order History</p>
                <p className="text-xs text-botanical-green-600">{ordersCount} orders</p>
              </div>
            </Button>

            <Button href="/account/downloads" variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Downloads</p>
                <p className="text-xs text-botanical-green-600">Purchased items</p>
              </div>
            </Button>

            <Button href="/cart" variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Shopping Cart</p>
                <p className="text-xs text-botanical-green-600">{cartCount} items</p>
              </div>
            </Button>

            <Button href="/settings" variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Account Settings</p>
                <p className="text-xs text-botanical-green-600">Email, password, etc.</p>
              </div>
            </Button>

            <Button onClick={handleSignOut} variant="outline" className="justify-start h-auto py-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Sign Out</p>
                <p className="text-xs text-botanical-green-600">Log out of your account</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
