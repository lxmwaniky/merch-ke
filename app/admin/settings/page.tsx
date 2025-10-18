"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Settings</h1>

      <div className="bg-card rounded-lg shadow border p-12 text-center">
        <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Store Settings
        </h3>
        <p className="text-muted-foreground mb-6">
          Store configuration and settings coming soon.
        </p>
        <p className="text-sm text-muted-foreground">
          This feature is in development. You'll be able to configure store details,
          payment settings, shipping options, and more.
        </p>
      </div>
    </div>
  );
}
