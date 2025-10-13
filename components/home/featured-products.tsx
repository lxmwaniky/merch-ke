"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api/endpoints";
import type { Product } from "@/types/api";
import { ShoppingCart } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        // Show featured products or first 6 products
        const featured = data.products.filter((p) => p.is_featured).slice(0, 6);
        setProducts(featured.length > 0 ? featured : data.products.slice(0, 6));
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground mt-2">
            Check out our most popular tech swag
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">
                      KSh {product.base_price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Add to cart functionality
                        console.log("Add to cart:", product.id);
                      }}
                      className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
