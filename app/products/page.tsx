'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Tech Swags</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">🎽</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary-600 transition">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {product.short_description || product.description}
                </p>
                <p className="text-lg font-bold mt-2">
                  KES {product.base_price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
