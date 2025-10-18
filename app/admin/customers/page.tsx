"use client";

import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Customers</h1>

      <div className="bg-card rounded-lg shadow border p-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Customer Management
        </h3>
        <p className="text-muted-foreground mb-6">
          Customer list and management features coming soon.
        </p>
        <p className="text-sm text-muted-foreground">
          This feature is in development. You'll be able to view customer details,
          order history, and manage customer accounts.
        </p>
      </div>
    </div>
  );
}
