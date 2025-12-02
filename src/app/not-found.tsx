import Link from 'next/link';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="py-20 px-4 text-center">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-6xl font-serif text-botanical-green-800 mb-4">404</h1>
        <h2 className="text-3xl font-serif text-botanical-green-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-botanical-green-700 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button href="/" size="lg">
            Go Home
          </Button>
          <Button href="/shop" variant="outline" size="lg">
            Browse Shop
          </Button>
        </div>
      </div>
    </div>
  );
}

