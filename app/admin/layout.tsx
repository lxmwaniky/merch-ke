"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/admin" className="text-lg md:text-xl font-bold text-foreground">
            Merch KE Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 pb-20">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center px-4 py-3 mt-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-colors"
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 mt-8 text-muted-foreground rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
          <div className="text-sm">
            <p className="font-medium text-foreground truncate">{user.username}</p>
            <p className="text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user.first_name || user.username}!
              </span>
            </div>

            {/* Mobile user info */}
            <div className="md:hidden text-sm">
              <span className="font-medium text-foreground">{user.first_name || user.username}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
