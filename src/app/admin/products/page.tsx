import { requireAdmin } from '@/lib/admin/auth';
import { getAllAdminProducts } from '@/lib/admin/products';
import Link from 'next/link';
import ProductTable from '@/components/admin/ProductTable';

export default async function AdminProductsPage() {
  await requireAdmin(['super_admin', 'admin', 'editor']);
  const products = await getAllAdminProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-botanical-green-900">Products</h1>
          <p className="mt-2 text-botanical-green-700">
            Manage your product listings and inventory
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-botanical-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-botanical-green-700 transition-colors"
        >
          Create Product
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}

