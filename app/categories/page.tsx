"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api/endpoints";
import type { Category, Product } from "@/types/api";
import { ArrowRight, Package } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(categoriesData.categories.filter((c) => c.is_active));
        setProducts(productsData.products);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count products per category
  const getProductCount = (categoryId: number) => {
    return products.filter((p) => p.category_id === categoryId && p.is_active).length;
  };

  // Group categories by parent
  const topLevelCategories = categories.filter((c) => c.parent_id === null);
  const getSubcategories = (parentId: number) => {
    return categories.filter((c) => c.parent_id === parentId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Browse products by category
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-12">
        {topLevelCategories.map((category) => {
          const subcategories = getSubcategories(category.id);
          const productCount = getProductCount(category.id);

          return (
            <div key={category.id} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                <Link
                  href={`/products?category=${category.id}`}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Main Category Card */}
              <Link
                href={`/products?category=${category.id}`}
                className="group block"
              >
                <div className="border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                        <p className="text-sm font-medium mt-2">
                          {productCount} {productCount === 1 ? "product" : "products"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                  {subcategories.map((subcategory) => {
                    const subProductCount = getProductCount(subcategory.id);
                    return (
                      <Link
                        key={subcategory.id}
                        href={`/products?category=${subcategory.id}`}
                        className="group"
                      >
                        <div className="border rounded-lg p-4 hover:shadow-md transition-all hover:scale-[1.02]">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {subcategory.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {subcategory.description}
                              </p>
                              <p className="text-xs font-medium mt-2">
                                {subProductCount} {subProductCount === 1 ? "product" : "products"}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {topLevelCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories available.</p>
        </div>
      )}
    </div>
  );
}
