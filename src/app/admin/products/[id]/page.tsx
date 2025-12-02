import { requireAdmin } from '@/lib/admin/auth';
import { getAdminProductById, updateProduct } from '@/lib/admin/products';
import { redirect } from 'next/navigation';
import ProductEditor from '@/components/admin/ProductEditor';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin(['super_admin', 'admin', 'editor']);
  
  const { id } = await params;
  const product = await getAdminProductById(id);
  
  if (!product) {
    redirect('/admin/products');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-botanical-green-900">Edit Product</h1>
        <p className="mt-2 text-botanical-green-700">
          Update product information and settings
        </p>
      </div>

      <ProductEditor product={product} />
    </div>
  );
}

