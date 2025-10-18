"use client";

import { Store, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Settings</h1>

      <div className="grid gap-6">
        {/* Store Info */}
        <div className="bg-card rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Store Information</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Store Name</span>
              <span className="font-medium text-foreground">Merch KE</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium text-foreground">KSh (Kenyan Shilling)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-medium text-foreground">Africa/Nairobi (EAT)</span>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-card rounded-lg shadow border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Database</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium text-foreground">PostgreSQL 15</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Schemas</span>
              <span className="font-medium text-foreground">auth, catalog, orders</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Note:</strong> Advanced settings like payment gateways, shipping configuration, and email notifications 
            need to be configured in your backend environment variables and database.
          </p>
        </div>
      </div>
    </div>
  );
}
