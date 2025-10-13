"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, updateCartItem, removeFromCart } from "@/lib/api/endpoints";
import type { CartItem } from "@/types/api";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, User } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/toast";

export default function CartPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const fetchCart = async () => {
    try {
      const data = await getCart();
      const items = data.items || [];
      
      // Calculate subtotal if not provided
      const calculatedSubtotal = items.reduce((sum, item) => {
        const itemSubtotal = item.subtotal || (item.price * item.quantity);
        return sum + itemSubtotal;
      }, 0);
      
      setCartItems(items);
      setSubtotal(data.subtotal || calculatedSubtotal);
      setTotalItems(data.total_items || items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => new Set(prev).add(productId));
    try {
      await updateCartItem(productId, newQuantity);
      await fetchCart();
      await refreshCart();
      showToast("Cart updated");
    } catch (err) {
      console.error("Failed to update cart:", err);
      showToast("Failed to update quantity", "error");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
      await fetchCart();
      await refreshCart();
      showToast("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      showToast("Failed to remove item", "error");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some products to get started!
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const isUpdating = updatingItems.has(item.product_id);
            return (
              <div
                key={item.id}
                className={`border rounded-lg p-4 ${
                  isUpdating ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product_id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-3xl">📦</span>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="font-semibold hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product_name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      KSh {item.price.toLocaleString()} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.product_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1 || isUpdating}
                        className="p-1 border rounded hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.product_id, item.quantity + 1)
                        }
                        disabled={isUpdating}
                        className="p-1 border rounded hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold">
                      KSh {(item.subtotal || item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={isUpdating}
                      className="text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20 space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-2 py-4 border-y">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  KSh {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>

            {user ? (
              <button
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Login to Checkout
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  You need to be logged in to complete your purchase
                </p>
              </div>
            )}

            <Link
              href="/products"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
