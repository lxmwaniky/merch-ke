'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/types';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          Merch KE
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/products" className="hover:text-primary-600 transition">
            Products
          </Link>
          <Link href="/cart" className="hover:text-primary-600 transition">
            Cart 🛒
          </Link>
          
          {user ? (
            <>
              <Link href="/orders" className="hover:text-primary-600 transition">
                Orders
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hi, {user.first_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-primary-600 transition">
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
