'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminBarProps {
  user: User | null;
  adminRole: string;
}

export default function AdminBar({ user, adminRole }: AdminBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminMode, setAdminMode] = useState(true); // Admin mode enabled by default when admin is logged in

  // Don't show admin bar on admin pages (they have their own sidebar)
  if (pathname?.startsWith('/admin')) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (!user || !adminMode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-botanical-green-800 text-botanical-cream-50 shadow-lg border-t-2 border-botanical-green-600">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Admin Mode</span>
              <span className="text-xs text-botanical-cream-200 capitalize">({adminRole.replace('_', ' ')})</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Link
                href="/admin"
                className="px-3 py-1 rounded hover:bg-botanical-green-700 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="px-3 py-1 rounded hover:bg-botanical-green-700 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/products/new"
                className="px-3 py-1 rounded hover:bg-botanical-green-700 transition-colors"
              >
                + New Product
              </Link>
              <Link
                href="/admin/orders"
                className="px-3 py-1 rounded hover:bg-botanical-green-700 transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/analytics"
                className="px-3 py-1 rounded hover:bg-botanical-green-700 transition-colors"
              >
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminMode(!adminMode)}
              className="px-3 py-1 text-xs rounded hover:bg-botanical-green-700 transition-colors"
              title={adminMode ? 'Disable admin mode' : 'Enable admin mode'}
            >
              {adminMode ? '👁️ Hide' : '👁️ Show'}
            </button>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 text-xs rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

