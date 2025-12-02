import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-botanical-cream-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-botanical-green-900 mb-4">Access Denied</h1>
        <p className="text-botanical-green-700 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          href="/admin"
          className="inline-block rounded-md bg-botanical-green-600 px-6 py-3 text-white hover:bg-botanical-green-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

