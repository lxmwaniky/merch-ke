"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/api/endpoints";
import { useAuth } from "@/contexts/auth-context";
import type { Order } from "@/types/api";
import {
  CheckCircle,
  Package,
  Truck,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("order");
  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && orderId) {
      fetchOrder();
    } else if (user && !orderId) {
      setError("No order ID provided");
      setLoading(false);
    }
  }, [user, authLoading, orderId]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(Number(orderId));
      setOrder(data);
    } catch (err: any) {
      console.error("Failed to load order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
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

  const getEstimatedDelivery = () => {
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days delivery
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Package className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold">Order Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The order you're looking for could not be found."}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              View Orders
            </Link>
            <Link
              href="/products"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Thank you for your purchase, {user?.first_name}!
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-800 font-medium">
              Order #{order.order_number}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Details */}
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Order Date</p>
                      <p className="text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-muted-foreground capitalize">
                        {order.payment_method === "cod" ? "Cash on Delivery" : 
                         order.payment_method === "mpesa" ? "M-Pesa" : "Card Payment"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-muted-foreground">
                        {getEstimatedDelivery()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Order Status</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-md">
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
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
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-2">Order Notes</h3>
                  <p className="text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmation</h3>
                    <p className="text-muted-foreground">
                      You'll receive an email confirmation shortly with your order details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Processing</h3>
                    <p className="text-muted-foreground">
                      We'll prepare your order for shipping within 1-2 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Shipping</h3>
                    <p className="text-muted-foreground">
                      Your order will be shipped and you'll receive tracking information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Delivery</h3>
                    <p className="text-muted-foreground">
                      Enjoy your new tech swag! Estimated delivery: {getEstimatedDelivery()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
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

            {/* Customer Support */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+254 700 000 000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>support@merchke.co.ke</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Our support team is available Monday to Friday, 9 AM to 5 PM.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={`/orders/${order.id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-md hover:bg-accent transition-colors"
              >
                <Package className="h-4 w-4" />
                View Order Details
              </Link>
              
              <Link
                href="/orders"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-md hover:bg-accent transition-colors"
              >
                View All Orders
              </Link>
              
              <Link
                href="/products"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}