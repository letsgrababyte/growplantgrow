import { Product } from '@/lib/products';
import ProductCard from './ProductCard';

interface ProductFeedProps {
  products: Product[];
  className?: string;
}

export default function ProductFeed({ products, className = '' }: ProductFeedProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-botanical-green-700 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

