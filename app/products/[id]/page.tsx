"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProduct, getProductImages, addToCart } from "@/lib/api/endpoints";
import type { Product, ProductImage } from "@/types/api";
import { ShoppingCart, Minus, Plus, ArrowLeft, Star } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { refreshCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, imagesData] = await Promise.all([
          getProduct(productId),
          getProductImages(productId),
        ]);
        setProduct(productData);
        
        // Handle images safely
        const imagesList = imagesData?.images || [];
        setImages(imagesList);
        
        // Set primary image as selected
        const primaryImage = imagesList.find((img) => img.is_primary);
        setSelectedImage(primaryImage || imagesList[0] || null);
      } catch (err) {
        console.error("Failed to load product:", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity });
      await refreshCart();
      showToast(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      showToast("Failed to add to cart", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Product not found</p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 text-primary hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {selectedImage ? (
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || product.name}
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-9xl">📦</span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images && images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage?.id === image.id
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || product.name}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Featured Badge */}
          {product.is_featured && (
            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              <Star className="h-4 w-4 fill-current" />
              Featured Product
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">
              KSh {product.base_price.toLocaleString()}
            </p>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                className="p-2 border rounded-md hover:bg-accent transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-medium w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="p-2 border rounded-md hover:bg-accent transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>

          {/* Product Details */}
          <div className="border rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product ID</span>
              <span className="font-medium">#{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU</span>
              <span className="font-medium">{product.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium text-green-600">In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
