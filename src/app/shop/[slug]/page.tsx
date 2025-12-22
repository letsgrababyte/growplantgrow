import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/products';
import Button from '@/components/Button';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-6 sm:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Images */}
          <div>
            <div className="relative w-full h-64 sm:h-96 md:h-[500px] bg-botanical-green-100 rounded-lg overflow-hidden mb-3 sm:mb-4">
              <Image
                src={product.thumbnailUrl}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {product.previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {product.previewImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full h-20 sm:h-24 bg-botanical-green-100 rounded-md overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 sm:mb-4">
              <span className="text-xs sm:text-sm text-botanical-green-600 font-medium">
                {product.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-botanical-green-900 mb-3 sm:mb-4">
              {product.title}
            </h1>
            <div className="text-2xl sm:text-3xl font-serif text-botanical-green-800 mb-4 sm:mb-6">
              ${product.price.toFixed(2)}
            </div>
            <p className="text-base sm:text-lg text-botanical-green-700 mb-6 sm:mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="bg-botanical-cream-100 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-serif text-botanical-green-800 mb-3 sm:mb-4">
                Product Details
              </h2>
              <dl className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-semibold text-botanical-green-800 sm:w-32 mb-1 sm:mb-0">File Type:</dt>
                  <dd className="text-botanical-green-700">{product.fileType}</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-semibold text-botanical-green-800 sm:w-32 mb-1 sm:mb-0">Pages:</dt>
                  <dd className="text-botanical-green-700">{product.pageCount}</dd>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <dt className="font-semibold text-botanical-green-800 sm:w-32 mb-1 sm:mb-0">Category:</dt>
                  <dd className="text-botanical-green-700">{product.category}</dd>
                </div>
                {product.tags.length > 0 && (
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-semibold text-botanical-green-800 sm:w-32 mb-1 sm:mb-0">Tags:</dt>
                    <dd className="text-botanical-green-700">
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-botanical-green-200 text-botanical-green-800 rounded text-xs sm:text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Buy Button */}
            <Button
              href={product.lemonSqueezyUrl}
              size="lg"
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto min-h-[44px]"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

