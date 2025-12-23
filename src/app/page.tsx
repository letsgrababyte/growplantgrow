import { getAllProducts, getFeaturedProducts } from '@/lib/products';
import EtsyProductGrid from '@/components/EtsyProductGrid';

export default function HomePage() {
  const allProducts = getAllProducts();
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      {/* Etsy-Style Product Grid */}
      <EtsyProductGrid 
        products={allProducts} 
        title="All Products"
        featuredTitle="Featured Products"
        featuredProducts={featuredProducts}
      />

      {/* Features Section */}
      <section className="bg-botanical-green-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
                Expert Guides
              </h3>
              <p className="text-botanical-green-700">
                Comprehensive guides written by plant enthusiasts for plant lovers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
                Instant Download
              </h3>
              <p className="text-botanical-green-700">
                Get your digital products immediately after purchase
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🖨️</div>
              <h3 className="text-xl font-serif text-botanical-green-800 mb-2">
                Print at Home
              </h3>
              <p className="text-botanical-green-700">
                High-quality PDFs ready to print and use in your home
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

