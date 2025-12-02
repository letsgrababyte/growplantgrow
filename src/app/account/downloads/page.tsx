'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import { getUserOrders, getOrderItems } from '@/lib/orders';
import { getAllProducts, Product } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  items: OrderItem[];
}

export default function DownloadsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState<Array<{
    product: Product;
    orderNumber: string;
    purchasedAt: string;
  }>>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadDownloads(session.user.id);
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

  const loadDownloads = async (userId: string) => {
    try {
      const orders = await getUserOrders();
      const allProducts = getAllProducts();
      const downloadsList: Array<{
        product: Product;
        orderNumber: string;
        purchasedAt: string;
      }> = [];

      for (const order of orders) {
        const items = await getOrderItems(order.id);
        for (const item of items) {
          const product = allProducts.find((p) => p.id === item.product_id);
          if (product) {
            downloadsList.push({
              product,
              orderNumber: order.order_number,
              purchasedAt: order.created_at,
            });
          }
        }
      }

      // Remove duplicates (same product purchased multiple times)
      const uniqueDownloads = downloadsList.filter(
        (download, index, self) =>
          index === self.findIndex((d) => d.product.id === download.product.id)
      );

      setDownloads(uniqueDownloads);
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
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
        <div className="flex items-center justify-between mb-8">
          <SectionHeading
            title="My Downloads"
            subtitle={`${downloads.length} purchased ${downloads.length === 1 ? 'item' : 'items'}`}
          />
          <Button href="/account" variant="outline">
            Back to Account
          </Button>
        </div>

        {downloads.length === 0 ? (
          <div className="bg-botanical-cream-100 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-botanical-green-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
              No downloads yet
            </h3>
            <p className="text-botanical-green-600 mb-6">
              Your purchased digital products will appear here for download.
            </p>
            <Button href="/shop">Start Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download) => (
              <div
                key={download.product.id}
                className="bg-white rounded-lg border border-botanical-green-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/shop/${download.product.slug}`}>
                  <div className="relative w-full h-48 bg-botanical-green-100">
                    <Image
                      src={download.product.thumbnailUrl}
                      alt={download.product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/shop/${download.product.slug}`}>
                    <h3 className="font-serif text-lg text-botanical-green-800 mb-2 hover:text-botanical-green-600">
                      {download.product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-botanical-green-600 mb-3">
                    Purchased: {new Date(download.purchasedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={download.product.lemonSqueezyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors text-center text-sm font-medium"
                    >
                      Download
                    </a>
                    <Link
                      href={`/shop/${download.product.slug}`}
                      className="px-4 py-2 border border-botanical-green-300 text-botanical-green-800 rounded-md hover:bg-botanical-green-50 transition-colors text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

