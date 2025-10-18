"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/api/endpoints";
import { useAuth } from "@/contexts/auth-context";
import type { Order } from "@/types/api";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && orderId) {
      fetchOrder();
    }
  }, [user, authLoading, orderId]);

  const fetchOrder = async () => {
    try {
      setError(null);
      const data = await getOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const getStatusProgress = (status: string) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status);
    return status === "cancelled" ? 0 : ((currentIndex + 1) / statuses.length) * 100;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Order Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/orders"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Order #{order.order_number}
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusIcon(order.status)}
            <span
              className={`px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Progress */}
          {order.status !== "cancelled" && (
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Order Progress</h2>
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getStatusProgress(order.status)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-4 text-sm">
                  <div className={`text-center ${["pending", "processing", "shipped", "delivered"].indexOf(order.status) >= 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    Pending
                  </div>
                  <div className={`text-center ${["processing", "shipped", "delivered"].indexOf(order.status) >= 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    <Package className="h-4 w-4 mx-auto mb-1" />
                    Processing
                  </div>
                  <div className={`text-center ${["shipped", "delivered"].indexOf(order.status) >= 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    <Truck className="h-4 w-4 mx-auto mb-1" />
                    Shipped
                  </div>
                  <div className={`text-center ${order.status === "delivered" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    <CheckCircle className="h-4 w-4 mx-auto mb-1" />
                    Delivered
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-md">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-muted-foreground">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Order Notes</h2>
              <p className="text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="capitalize">{order.payment_method}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{user?.first_name} {user?.last_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/orders"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              View All Orders
            </Link>
            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}