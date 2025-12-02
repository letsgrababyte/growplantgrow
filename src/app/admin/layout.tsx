import { getAdminUser } from '@/lib/admin/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Try to get admin user without requiring it (to avoid redirect loops)
  // This allows signin/unauthorized pages to render
  const adminUser = await getAdminUser();

  // If we have an admin user, show the full admin layout with sidebar
  if (adminUser) {
    return (
      <div className="min-h-screen bg-botanical-cream-50">
        <AdminSidebar user={adminUser} />
        <div className="lg:pl-64">
          <main className="py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // If no admin user, just render children (signin/unauthorized pages will render)
  // Other admin pages will handle their own redirects via requireAdmin()
  return <>{children}</>;
}

