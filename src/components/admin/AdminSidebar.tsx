'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminUser } from '@/lib/admin/auth';

interface AdminSidebarProps {
  user: AdminUser;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      roles: ['super_admin', 'admin', 'editor'],
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      roles: ['super_admin', 'admin', 'support'],
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      roles: ['super_admin', 'admin', 'support'],
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      roles: ['super_admin', 'admin', 'editor', 'viewer'],
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      roles: ['super_admin', 'admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-botanical-green-800 text-botanical-cream-50">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-botanical-green-700 px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold">GPG Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-botanical-green-700 text-botanical-cream-50'
                    : 'text-botanical-cream-200 hover:bg-botanical-green-700 hover:text-botanical-cream-50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-botanical-green-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-botanical-green-700">
              <span className="text-xs font-semibold">
                {user.role.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-botanical-cream-50 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-2 block text-center text-xs text-botanical-cream-300 hover:text-botanical-cream-50"
          >
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}

