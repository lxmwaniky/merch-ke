'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import { User } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.replace('/auth/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      router.replace('/');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛍️' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <>
      {/* Admin Header */}
      <header className="border-b fixed top-0 left-0 right-0 bg-white z-50 h-16">
        <nav className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-primary-600">
              Merch KE Admin
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition"
            >
              View Store
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">
              {user?.first_name} {user?.last_name}
            </span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const { logout } = require('@/lib/auth');
                  logout();
                  router.push('/auth/login');
                }
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Back to Main Site */}
            <div className="mt-6 pt-6 border-t">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">🏠</span>
                <span className="font-medium">Main Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
