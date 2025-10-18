"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Package, Clock } from "lucide-react";
import { adminGetOrders } from "@/lib/api/endpoints";

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  user_id?: number;
  session_id?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminGetOrders();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      setError(err.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getPaymentBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Orders</h1>
        <div className="text-sm text-muted-foreground">
          Total: {orders.length} orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-lg shadow border p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No orders yet
          </h3>
          <p className="text-muted-foreground">
            Orders will appear here when customers make purchases.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow border overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {order.order_number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.user_id ? "Registered" : "Guest"}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      KES {order.total_amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground lg:hidden">
                      {order.payment_method || "N/A"}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadge(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.payment_method || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:text-primary/80"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5 inline" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
