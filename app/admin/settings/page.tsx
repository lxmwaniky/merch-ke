"use client";

import { useState } from "react";
import { Store, CreditCard, Truck, Bell, Shield, Database, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "payment" | "shipping" | "notifications">("store");

  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Merch KE",
    storeEmail: "info@merchke.com",
    storePhone: "+254 700 000000",
    currency: "KSh",
    timezone: "Africa/Nairobi",
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    mpesaEnabled: true,
    mpesaBusinessShortcode: "",
    mpesaPasskey: "",
    paypalEnabled: false,
    paypalClientId: "",
    cardPaymentsEnabled: false,
  });

  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 5000,
    standardShippingFee: 300,
    expressShippingFee: 500,
    shippingDays: "3-5",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmationEmail: true,
    orderStatusEmail: true,
    lowStockAlerts: true,
    lowStockThreshold: 10,
    newOrderNotifications: true,
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, save to backend
      const settings = {
        store: storeSettings,
        payment: paymentSettings,
        shipping: shippingSettings,
        notifications: notificationSettings,
      };
      
      localStorage.setItem("adminSettings", JSON.stringify(settings));
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "store" as const, label: "Store Info", icon: Store },
    { id: "payment" as const, label: "Payment", icon: CreditCard },
    { id: "shipping" as const, label: "Shipping", icon: Truck },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Store Settings */}
      {activeTab === "store" && (
        <div className="bg-card rounded-lg shadow border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Store Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, storeEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={storeSettings.storePhone}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, storePhone: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={storeSettings.currency}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, currency: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Timezone
                  </label>
                  <select
                    value={storeSettings.timezone}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === "payment" && (
        <div className="bg-card rounded-lg shadow border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h2>
            
            {/* M-Pesa */}
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">M-Pesa</h3>
                    <p className="text-sm text-muted-foreground">Accept M-Pesa payments</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.mpesaEnabled}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, mpesaEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {paymentSettings.mpesaEnabled && (
                <div className="space-y-3 mt-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Business Shortcode
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.mpesaBusinessShortcode}
                      onChange={(e) =>
                        setPaymentSettings({ ...paymentSettings, mpesaBusinessShortcode: e.target.value })
                      }
                      placeholder="123456"
                      className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Passkey
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.mpesaPasskey}
                      onChange={(e) =>
                        setPaymentSettings({ ...paymentSettings, mpesaPasskey: e.target.value })
                      }
                      placeholder="Enter M-Pesa passkey"
                      className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">PayPal</h3>
                    <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.paypalEnabled}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {paymentSettings.paypalEnabled && (
                <div className="space-y-3 mt-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      PayPal Client ID
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.paypalClientId}
                      onChange={(e) =>
                        setPaymentSettings({ ...paymentSettings, paypalClientId: e.target.value })
                      }
                      placeholder="Enter PayPal Client ID"
                      className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Card Payments */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Card Payments</h3>
                    <p className="text-sm text-muted-foreground">Accept credit/debit cards</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.cardPaymentsEnabled}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, cardPaymentsEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === "shipping" && (
        <div className="bg-card rounded-lg shadow border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Free Shipping Threshold (KSh)
                </label>
                <input
                  type="number"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Orders above this amount qualify for free shipping
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Standard Shipping Fee (KSh)
                  </label>
                  <input
                    type="number"
                    value={shippingSettings.standardShippingFee}
                    onChange={(e) =>
                      setShippingSettings({ ...shippingSettings, standardShippingFee: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Express Shipping Fee (KSh)
                  </label>
                  <input
                    type="number"
                    value={shippingSettings.expressShippingFee}
                    onChange={(e) =>
                      setShippingSettings({ ...shippingSettings, expressShippingFee: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  value={shippingSettings.shippingDays}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, shippingDays: e.target.value })
                  }
                  placeholder="e.g., 3-5 business days"
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="bg-card rounded-lg shadow border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-foreground">Order Confirmation Emails</h3>
                  <p className="text-sm text-muted-foreground">Send confirmation emails to customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderConfirmationEmail}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, orderConfirmationEmail: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-foreground">Order Status Updates</h3>
                  <p className="text-sm text-muted-foreground">Notify customers of order status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderStatusEmail}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, orderStatusEmail: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-foreground">New Order Notifications</h3>
                  <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newOrderNotifications}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, newOrderNotifications: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-foreground">Low Stock Alerts</h3>
                  <p className="text-sm text-muted-foreground">Alert when product stock is low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStockAlerts}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, lowStockAlerts: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {notificationSettings.lowStockAlerts && (
                <div className="pl-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={notificationSettings.lowStockThreshold}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, lowStockThreshold: parseInt(e.target.value) })
                    }
                    min="1"
                    className="w-full max-w-xs px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert when stock falls below this number
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
