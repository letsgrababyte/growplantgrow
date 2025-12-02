import { requireAdmin } from '@/lib/admin/auth';
import { getAllAdminProducts } from '@/lib/admin/products';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const adminUser = await requireAdmin();
  const products = await getAllAdminProducts();
  const supabase = await createClient();

  // Get basic stats
  const activeProducts = products.filter(p => p.status === 'active').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales_count, 0);

  // Get recent orders
  const { data: recentOrders } = supabase ? await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5) : { data: null };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-botanical-green-900">Dashboard</h1>
        <p className="mt-2 text-botanical-green-700">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-botanical-green-500"
        />
        <StatCard
          title="Total Sales"
          value={totalSales.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          color="bg-blue-500"
        />
        <StatCard
          title="Active Products"
          value={activeProducts.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="bg-purple-500"
        />
        <StatCard
          title="Draft Products"
          value={draftProducts.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-botanical-green-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-botanical-green-600 hover:text-botanical-green-800"
            >
              View all
            </Link>
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-botanical-cream-200 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-botanical-green-900">
                      #{order.order_number || order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-botanical-green-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-botanical-green-900">
                      ${parseFloat(order.total_amount || '0').toFixed(2)}
                    </p>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-botanical-green-600">No orders yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-botanical-green-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              className="block w-full rounded-md bg-botanical-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-botanical-green-700 transition-colors"
            >
              Create New Product
            </Link>
            <Link
              href="/admin/products"
              className="block w-full rounded-md border border-botanical-green-300 bg-white px-4 py-2 text-center text-sm font-medium text-botanical-green-700 hover:bg-botanical-green-50 transition-colors"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/analytics"
              className="block w-full rounded-md border border-botanical-green-300 bg-white px-4 py-2 text-center text-sm font-medium text-botanical-green-700 hover:bg-botanical-green-50 transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-botanical-green-600">{title}</p>
          <p className="mt-2 text-2xl font-bold text-botanical-green-900">{value}</p>
        </div>
        <div className={`${color} rounded-full p-3 text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

