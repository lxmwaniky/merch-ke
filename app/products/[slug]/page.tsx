'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { getToken, getSessionId } from '@/lib/auth';
import { Product, ProductImage } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productsData = await api.getProducts();
        const found = productsData.products.find((p: Product) => p.slug === params.slug);
        
        if (found) {
          setProduct(found);
          const imagesData = await api.getProductImages(found.id.toString());
          setImages(imagesData.images || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAdding(true);
    try {
      const token = getToken();
      const sessionId = getSessionId();
      
      await api.addToCart(
        { product_id: product.id, quantity },
        token || undefined,
        sessionId
      );
      
      alert('Added to cart!');
    } catch (err: any) {
      alert(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <button 
            onClick={() => router.push('/products')}
            className="text-primary-600 hover:underline"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const primaryImage = images.find(img => img.is_primary) || images[0];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {primaryImage ? (
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={primaryImage.image_url}
                  alt={primaryImage.alt_text}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-9xl">🎽</span>
              </div>
            )}
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.map(img => (
                  <div key={img.id} className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={img.image_url}
                      alt={img.alt_text}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary-600 mb-6">
              KES {product.base_price.toLocaleString()}
            </p>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
