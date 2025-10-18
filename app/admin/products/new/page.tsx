"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { adminCreateProduct, adminGetCategories } from "@/lib/api/endpoints";
import { useToast } from "@/components/ui/toast";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    category_id: 0,
    base_price: 0,
    image_url: "",
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await adminGetCategories();
      const cats = data.categories || [];
      setCategories(cats);
      // Set first category as default if available
      if (cats.length > 0 && formData.category_id === 0) {
        setFormData(prev => ({ ...prev, category_id: cats[0].id }));
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      showToast("Failed to load categories", "error");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminCreateProduct(formData);
      showToast("Product created successfully!", "success");
      router.push("/admin/products");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to create product", "error");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow border p-4 md:p-6 space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Python Developer Hoodie"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., python-developer-hoodie"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-generated from product name. Used in URLs.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Product description..."
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Short Description
          </label>
          <textarea
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Brief product summary..."
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a full URL to the product image
          </p>
        </div>

        {/* Price & Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Base Price (KES) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.base_price}
              onChange={(e) =>
                setFormData({ ...formData, base_price: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            {categoriesLoading ? (
              <div className="w-full px-4 py-2 border rounded-lg bg-background text-muted-foreground">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div>
                <div className="w-full px-4 py-2 border rounded-lg bg-background text-muted-foreground">
                  No categories available
                </div>
                <p className="text-xs text-red-500 mt-1">
                  Please create a category first
                </p>
              </div>
            ) : (
              <select
                required
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-foreground">
              Active (visible to customers)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm text-foreground">
              Featured (show on homepage)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? "Creating..." : "Create Product"}
          </button>
          <Link
            href="/admin/products"
            className="flex items-center justify-center px-6 py-2 border rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
