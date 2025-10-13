// API Response Types based on Merch KE API Documentation

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "customer" | "admin";
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  base_price: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductImagesResponse {
  images: ProductImage[];
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_slug: string;
  price: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  subtotal: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  message: string;
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

export interface PointsTransaction {
  id: number;
  points: number;
  transaction_type: "earned" | "redeemed";
  description: string;
  created_at: string;
}

export interface PointsResponse {
  balance: number;
  transactions: PointsTransaction[];
}

export interface ApiError {
  error: string;
  details?: string;
}
