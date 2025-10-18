"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, createOrder } from "@/lib/api/endpoints";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/toast";
import type { CartItem } from "@/types/api";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  Plus,
  Edit,
  Check,
  Lock,
  ShoppingBag,
} from "lucide-react";

interface ShippingAddress {
  id?: number;
  first_name: string;
  last_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  county: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refreshCart } = useCart();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Guest checkout
  const [isGuest, setIsGuest] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  // Payment simulation
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState("");

  // Checkout form state
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(true); // Start with form open for guests
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "cod">("mpesa");
  const [orderNotes, setOrderNotes] = useState("");

  // New address form
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    county: "",
  });

  useEffect(() => {
    // Allow both logged-in users and guests
    if (!authLoading) {
      if (!user) {
        setIsGuest(true);
      }
      fetchCart();
    }
  }, [user, authLoading]);

  const fetchCart = async () => {
    try {
      // Try to fetch cart from API (works for both guests and logged-in users via cookies)
      const data = await getCart();
      const items = data.items || [];
      
      if (items.length === 0) {
        showToast("Your cart is empty", "error");
        router.push("/cart");
        return;
      }

      const calculatedSubtotal = items.reduce((sum, item) => {
        return sum + (item.subtotal || item.price * item.quantity);
      }, 0);

      setCartItems(items);
      setSubtotal(data.subtotal || calculatedSubtotal);
    } catch (err) {
      showToast("Failed to load cart", "error");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = () => {
    // Validate guest email if user is not logged in
    if (isGuest && !guestEmail) {
      showToast("Please provide your email address", "error");
      return;
    }

    if (isGuest && !guestEmail.includes('@')) {
      showToast("Please provide a valid email address", "error");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name", 
      "phone",
      "address_line1",
      "city",
      "county"
    ] as const;
    
    const missingFields = requiredFields.filter(field => !newAddress[field]);
    
    if (missingFields.length > 0) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setSelectedAddress(newAddress);
    setIsAddingAddress(false);
    showToast("Address saved successfully!");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast("Please select a shipping address", "error");
      return;
    }

    // Validate guest email
    if (isGuest && !guestEmail) {
      showToast("Please provide your email address", "error");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      showToast("Your cart is empty. Please add items before placing an order.", "error");
      return;
    }

    if (subtotal <= 0) {
      showToast("Invalid cart total. Please refresh and try again.", "error");
      return;
    }

    // Show payment modal for M-Pesa and Card, skip for COD
    if (paymentMethod === "mpesa" || paymentMethod === "card") {
      setShowPaymentModal(true);
      return;
    }

    // For COD, proceed directly
    await processOrder();
  };

  const handlePaymentSimulation = async () => {
    if (paymentMethod === "mpesa" && !mpesaPhone) {
      showToast("Please enter your M-Pesa phone number", "error");
      return;
    }

    setPaymentProcessing(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setPaymentProcessing(false);
    setShowPaymentModal(false);
    
    showToast(`${paymentMethod === "mpesa" ? "M-Pesa" : "Card"} payment simulated successfully!`);
    
    // Proceed with order
    await processOrder();
  };

  const processOrder = async () => {
    if (!selectedAddress) return; // Already validated
    
    setIsPlacingOrder(true);
    
    try {
      // Prepare the shipping address string for backend
      const addressString = `${selectedAddress.first_name} ${selectedAddress.last_name}, ${selectedAddress.phone}\n${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}\n${selectedAddress.city}, ${selectedAddress.county} ${selectedAddress.postal_code}`;
      
      // Prepare order data for API (works for both guest and logged-in users)
      const orderData = {
        payment_method: paymentMethod,
        shipping_address: addressString,
        billing_address: addressString,
        notes: orderNotes || `Guest Email: ${isGuest ? guestEmail : user?.email}`
      };

      const response = await createOrder(orderData);
      
      // Store the order details for the success page
      const orderDetails = {
        ...response.order,
        email: isGuest ? guestEmail : user?.email,
        shipping_address_details: selectedAddress,
        items: cartItems // Include cart items for success page
      };
      
      // Store in localStorage for success page access
      localStorage.setItem('last_order', JSON.stringify(orderDetails));
      
      showToast("Order placed successfully!");
      await refreshCart();
      
      // Redirect to order confirmation with guest flag if applicable
      const successUrl = isGuest 
        ? `/checkout/success?order=${response.order.id}&guest=true&success=true`
        : `/checkout/success?order=${response.order.id}&success=true`;
      
      router.push(successUrl);
      
    } catch (err: any) {
      
      let errorMessage = "Failed to place order. Please try again.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 500) {
        // Check for any database schema errors (missing columns)
        if (err.response?.data?.details?.includes?.('column "') && err.response?.data?.details?.includes?.('does not exist')) {
          errorMessage = "🚧 Database is being updated by the backend team. Please try again in a few minutes.";
        } else {
          errorMessage = "Server error. Please check if you have items in your cart and try again.";
        }
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to place an order.";
      }
      
      showToast(errorMessage, "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const shippingCost = 0; // Free shipping
  const total = subtotal + shippingCost;

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </button>
        
        {/* Guest Checkout Banner */}
        {isGuest && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Guest Checkout
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  You're checking out as a guest. Want to save your order history?{" "}
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="underline hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    Create an account
                  </button>
                  {" "}or{" "}
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="underline hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    log in
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h2>

            {selectedAddress ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {selectedAddress.first_name} {selectedAddress.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.phone}
                      </p>
                      <p className="text-sm">
                        {selectedAddress.address_line1}
                        {selectedAddress.address_line2 && (
                          <>, {selectedAddress.address_line2}</>
                        )}
                      </p>
                      <p className="text-sm">
                        {selectedAddress.city}, {selectedAddress.county}
                        {selectedAddress.postal_code && ` ${selectedAddress.postal_code}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingAddress(true);
                        setNewAddress(selectedAddress);
                      }}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsAddingAddress(true);
                    setNewAddress({
                      first_name: user?.first_name || "",
                      last_name: user?.last_name || "",
                      phone: user?.phone || "",
                      address_line1: "",
                      address_line2: "",
                      city: "",
                      postal_code: "",
                      county: "",
                    });
                  }}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add New Address
                </button>
              </div>
            ) : null}

            {/* Address Form */}
            {isAddingAddress && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-4">
                  {selectedAddress ? "Edit" : "Add"} Shipping Address
                </h3>
                
                {/* Guest Email Field */}
                {isGuest && (
                  <div className="mb-6 p-4 bg-muted/50 border rounded-lg">
                    <label className="block text-sm font-medium mb-2">
                      Email Address * (for order confirmation)
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll send your order confirmation to this email
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={newAddress.first_name}
                      onChange={(e) => handleAddressChange("first_name", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={newAddress.last_name}
                      onChange={(e) => handleAddressChange("last_name", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      placeholder="+254712345678"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      County *
                    </label>
                    <select
                      value={newAddress.county}
                      onChange={(e) => handleAddressChange("county", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    >
                      <option value="">Select County</option>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Machakos">Machakos</option>
                      <option value="Kajiado">Kajiado</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={newAddress.postal_code}
                      onChange={(e) => handleAddressChange("postal_code", e.target.value)}
                      placeholder="00100"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={newAddress.address_line1}
                      onChange={(e) => handleAddressChange("address_line1", e.target.value)}
                      placeholder="Street address, P.O. Box, etc."
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={newAddress.address_line2}
                      onChange={(e) => handleAddressChange("address_line2", e.target.value)}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Save Address
                  </button>
                  <button
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* M-Pesa */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value as "mpesa")}
                    className="text-primary"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center text-sm font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-medium">M-Pesa</p>
                      <p className="text-sm text-muted-foreground">
                        Pay with your M-Pesa mobile money
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Card Payment */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as "card")}
                    className="text-primary"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, and other cards
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Cash on Delivery */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value as "cod")}
                    className="text-primary"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded flex items-center justify-center text-xs font-bold">
                      COD
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Special instructions for your order..."
              rows={3}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.subtotal || item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || isPlacingOrder}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Placing Order...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Place Order
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </div>

      {/* Payment Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background border rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {paymentMethod === "mpesa" ? "M-Pesa Payment" : "Card Payment"}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-muted-foreground hover:text-foreground"
                disabled={paymentProcessing}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethod === "mpesa" ? (
                <>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        M
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">M-Pesa Payment</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Amount: {formatCurrency(total)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Enter your M-Pesa phone number to receive a payment prompt
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      M-Pesa Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={paymentProcessing}
                    />
                  </div>

                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="font-medium mb-1">📱 Simulation Mode:</p>
                    <p className="text-muted-foreground">
                      This is a demo. In production, you'll receive an actual M-Pesa STK push prompt on your phone.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-10 h-10 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Card Payment</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Amount: {formatCurrency(total)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        disabled={paymentProcessing}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          disabled={paymentProcessing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          disabled={paymentProcessing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="font-medium mb-1">💳 Simulation Mode:</p>
                    <p className="text-muted-foreground">
                      This is a demo. In production, payments will be processed via Stripe or your payment gateway.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
                disabled={paymentProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSimulation}
                disabled={paymentProcessing || (paymentMethod === "mpesa" && !mpesaPhone)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay {formatCurrency(total)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}