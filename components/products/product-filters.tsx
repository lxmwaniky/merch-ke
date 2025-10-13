"use client";

import type { Category } from "@/types/api";
import { SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: "featured" | "price-asc" | "price-desc" | "name";
  onSortByChange: (sortBy: "featured" | "price-asc" | "price-desc" | "name") => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <SlidersHorizontal className="h-5 w-5" />
        <h2 className="font-semibold">Filters</h2>
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as any)}
          className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                onPriceRangeChange([Number(e.target.value), priceRange[1]])
              }
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Min"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([priceRange[0], Number(e.target.value)])
              }
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Max"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onCategoryChange(null);
          onPriceRangeChange([0, 10000]);
          onSortByChange("featured");
        }}
        className="w-full px-4 py-2 border rounded-md text-sm hover:bg-accent transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
