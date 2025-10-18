"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { adminGetProducts, adminGetOrders, adminGetCustomers } from "@/lib/api/endpoints";

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  stock_quantity?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
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
      const products = productsData.products || [];
      
      // Find low stock products (stock_quantity < 10 or null)
      const lowStock = products.filter((p: any) => 
        p.stock_quantity !== undefined && p.stock_quantity !== null && p.stock_quantity < 10
      ).slice(0, 5);
      setLowStockProducts(lowStock);
      
      // Fetch orders
      let totalOrders = 0;
      let totalRevenue = 0;
      let orders: Order[] = [];
      try {
        const ordersData = await adminGetOrders();
        orders = ordersData.orders || [];
        totalOrders = ordersData.total || orders.length || 0;
        totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
        
        // Get recent 5 orders
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
      }

      // Fetch customers
      let totalCustomers = 0;
      try {
        const customersData = await adminGetCustomers();
        totalCustomers = customersData.total || customersData.customers?.length || 0;
      } catch (err) {
      }

      setStats({
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
      });
    } catch (err) {
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            <Link 
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent orders
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        KES {order.total_amount.toLocaleString()}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-card rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Low Stock Alerts</h2>
            <Link 
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading...
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              All products in stock
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock_quantity || 0} units
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      Low Stock
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}