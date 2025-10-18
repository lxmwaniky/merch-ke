"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { adminGetProducts, adminGetOrders } from "@/lib/api/endpoints";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsData = await adminGetProducts();
      const totalProducts = productsData.total || productsData.products?.length || 0;
      
      // Fetch orders
      let totalOrders = 0;
      let totalRevenue = 0;
      try {
        const ordersData = await adminGetOrders();
        totalOrders = ordersData.total || ordersData.orders?.length || 0;
        totalRevenue = ordersData.orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0;
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }

      setStats({
        totalProducts,
        totalOrders,
        totalCustomers: 0, // TODO: Add customers endpoint
        totalRevenue,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: loading ? "..." : stats.totalProducts,
      icon: Package,
      color: "bg-blue-500 dark:bg-blue-600",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500 dark:bg-green-600",
    },
    {
      title: "Total Customers",
      value: loading ? "..." : stats.totalCustomers,
      icon: Users,
      color: "bg-purple-500 dark:bg-purple-600",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-orange-500 dark:bg-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-card rounded-lg shadow border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-lg shadow border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Orders</h2>
          <div className="text-center text-muted-foreground py-8">
            No recent orders
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-card rounded-lg shadow border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Low Stock Alerts
          </h2>
          <div className="text-center text-muted-foreground py-8">
            All products in stock
          </div>
        </div>
      </div>
    </div>
  );
}
