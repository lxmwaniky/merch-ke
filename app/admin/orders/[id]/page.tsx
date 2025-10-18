"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, MapPin } from "lucide-react";
import { adminUpdateOrderStatus } from "@/lib/api/endpoints";
import { useToast } from "@/components/ui/toast";

interface OrderItem {
  id: number;
  product_name: string;
  variant_sku: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  user_id: number;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
  customer?: {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // For now, we'll need to add this endpoint or fetch from the orders list
      // Since we don't have a single order endpoint, let's use the list and filter
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch order");
      
      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      showToast("Failed to load order", "error");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!order) return;
    
    try {
      setUpdating(true);
      await adminUpdateOrderStatus(order.id, { status });
      setOrder({ ...order, status });
      showToast(`Order ${status}`, "success");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to update order", "error");
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (payment_status: string) => {
    if (!order) return;
    
    try {
      setUpdating(true);
      await adminUpdateOrderStatus(order.id, { payment_status });
      setOrder({ ...order, payment_status });
      showToast(`Payment marked as ${payment_status}`, "success");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to update payment", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Order #{order.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
            {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-card rounded-lg shadow-md border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.product_name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.variant_sku}</p>
                      {item.size && (
                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">KES {item.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">KES {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">KES {order.shipping_cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">KES {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.customer && (
            <div className="bg-card rounded-lg shadow-md border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h2>
              <div className="space-y-2">
                <p className="text-foreground">
                  <span className="font-medium">Name:</span>{" "}
                  {order.customer.first_name && order.customer.last_name
                    ? `${order.customer.first_name} ${order.customer.last_name}`
                    : order.customer.username}
                </p>
                <p className="text-foreground">
                  <span className="font-medium">Email:</span> {order.customer.email}
                </p>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h2>
            <p className="text-foreground whitespace-pre-line">{order.shipping_address}</p>
          </div>

          {/* Payment Info */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </h2>
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-medium">Method:</span>{" "}
                {order.payment_method || "Not specified"}
              </p>
              <p className="text-foreground">
                <span className="font-medium">Status:</span>{" "}
                <span className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Update Order Status</h2>
            <div className="space-y-3">
              <button
                onClick={() => updateStatus("confirmed")}
                disabled={updating || order.status === "confirmed"}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Order
              </button>
              <button
                onClick={() => updateStatus("processing")}
                disabled={updating || order.status === "processing"}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Processing
              </button>
              <button
                onClick={() => updateStatus("shipped")}
                disabled={updating || order.status === "shipped"}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => updateStatus("delivered")}
                disabled={updating || order.status === "delivered"}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Delivered
              </button>
              <button
                onClick={() => updateStatus("cancelled")}
                disabled={updating || order.status === "cancelled"}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Order
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-card rounded-lg shadow-md border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Update Payment Status</h2>
            <div className="space-y-3">
              <button
                onClick={() => updatePaymentStatus("paid")}
                disabled={updating || order.payment_status === "paid"}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => updatePaymentStatus("pending")}
                disabled={updating || order.payment_status === "pending"}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Pending
              </button>
              <button
                onClick={() => updatePaymentStatus("failed")}
                disabled={updating || order.payment_status === "failed"}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
