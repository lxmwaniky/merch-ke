"use client";

import Link from "next/link";
import type { Product } from "@/types/api";
import { ShoppingCart, Star } from "lucide-react";
import { addToCart } from "@/lib/api/endpoints";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      // TODO: Update cart count in header
      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-muted flex items-center justify-center relative">
          <span className="text-6xl">📦</span>
          {product.is_featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </div>
          )}
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
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
