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
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative w-full h-96 md:h-[500px] bg-botanical-green-100 rounded-lg overflow-hidden mb-4">
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
                    className="relative w-full h-24 bg-botanical-green-100 rounded-md overflow-hidden"
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
            <div className="mb-4">
              <span className="text-sm text-botanical-green-600 font-medium">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-botanical-green-900 mb-4">
              {product.title}
            </h1>
            <div className="text-3xl font-serif text-botanical-green-800 mb-6">
              ${product.price.toFixed(2)}
            </div>
            <p className="text-lg text-botanical-green-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="bg-botanical-cream-100 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-serif text-botanical-green-800 mb-4">
                Product Details
              </h2>
              <dl className="space-y-3">
                <div className="flex">
                  <dt className="font-semibold text-botanical-green-800 w-32">File Type:</dt>
                  <dd className="text-botanical-green-700">{product.fileType}</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold text-botanical-green-800 w-32">Pages:</dt>
                  <dd className="text-botanical-green-700">{product.pageCount}</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold text-botanical-green-800 w-32">Category:</dt>
                  <dd className="text-botanical-green-700">{product.category}</dd>
                </div>
                {product.tags.length > 0 && (
                  <div className="flex">
                    <dt className="font-semibold text-botanical-green-800 w-32">Tags:</dt>
                    <dd className="text-botanical-green-700">
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-botanical-green-200 text-botanical-green-800 rounded text-sm"
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
              className="w-full md:w-auto"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

