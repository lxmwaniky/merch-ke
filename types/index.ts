export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id: number;
  base_price: number;
  is_active: boolean;
  is_featured: boolean;
  sku_prefix?: string;
  weight?: number;
  dimensions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  variant_id?: number;
  image_url: string;
  image_path: string;
  image_type: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id?: number;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id?: number;
  session_id?: string;
  product_id: number;
  quantity: number;
  product_name: string;
  product_slug: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  subtotal: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  shipping_address: string;
  billing_address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  product_slug: string;
}
