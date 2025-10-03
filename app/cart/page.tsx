'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getToken, getSessionId } from '@/lib/auth';
import { Cart } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const token = getToken();
      const sessionId = getSessionId();
      const data = await api.getCart(token || undefined, sessionId);
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const token = getToken();
      const sessionId = getSessionId();
      await api.updateCartItem(itemId.toString(), newQuantity, token || undefined, sessionId);
      loadCart();
    } catch (err: any) {
      alert(err.message || 'Failed to update cart');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const token = getToken();
      const sessionId = getSessionId();
      await api.removeFromCart(itemId.toString(), token || undefined, sessionId);
      loadCart();
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/products')}
            className="text-primary-600 hover:underline"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {cart.items.map(item => (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🎽</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product_name}</h3>
                <p className="text-gray-600">KES {item.price.toLocaleString()}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  KES {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:underline text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total:</span>
            <span>KES {cart.subtotal.toLocaleString()}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
