'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, getUser } from '@/lib/auth';

export default function AdminHeader() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
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
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
