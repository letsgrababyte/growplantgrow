'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadOrders(session.user.id);
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

  const loadOrders = async (userId: string) => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        const ordersWithItems = ordersData.map((order) => ({
          ...order,
          items: (itemsData || []).filter((item) => item.order_id === order.id),
        }));

        setOrders(ordersWithItems as Order[]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
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
            title="Order History"
            subtitle={`${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
          />
          <Button href="/account" variant="outline">
            Back to Account
          </Button>
        </div>

        {orders.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
              No orders yet
            </h3>
            <p className="text-botanical-green-600 mb-6">
              Your purchase history will appear here once you make your first order.
            </p>
            <Button href="/shop">Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-botanical-cream-100 rounded-lg p-6 border border-botanical-green-200"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-botanical-green-300">
                  <div>
                    <h3 className="text-lg font-serif text-botanical-green-800">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-sm text-botanical-green-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-botanical-green-800">
                      ${parseFloat(order.total_amount.toString()).toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white rounded p-3"
                    >
                      <div>
                        <p className="font-medium text-botanical-green-800">
                          {item.product_title}
                        </p>
                        <p className="text-sm text-botanical-green-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-botanical-green-800 font-semibold">
                        ${parseFloat(item.product_price.toString()).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

