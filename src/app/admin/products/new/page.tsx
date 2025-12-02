import { requireAdmin } from '@/lib/admin/auth';
import ProductEditor from '@/components/admin/ProductEditor';

export default async function NewProductPage() {
  await requireAdmin(['super_admin', 'admin', 'editor']);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-botanical-green-900">Create New Product</h1>
        <p className="mt-2 text-botanical-green-700">
          Add a new product to your store
        </p>
      </div>

      <ProductEditor />
    </div>
  );
}

