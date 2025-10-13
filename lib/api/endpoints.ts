import api, { apiClient } from "./client";
import type {
  AuthResponse,
  ProductsResponse,
  Product,
  CategoriesResponse,
  ProductImagesResponse,
  CartResponse,
  Order,
  OrderResponse,
  OrdersResponse,
  PointsResponse,
  ApiError,
} from "@/types/api";

// Health Check
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

// Authentication
export const register = async (data: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", data);
  if (response.data.token) {
    apiClient.setToken(response.data.token);
  }
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", data);
  if (response.data.token) {
    apiClient.setToken(response.data.token);
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};

export const logout = () => {
  apiClient.clearToken();
};

// Products
export const getProducts = async (): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/api/products");
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/api/products/${id}`);
  return response.data;
};

export const getProductImages = async (
  productId: number
): Promise<ProductImagesResponse> => {
  const response = await api.get<ProductImagesResponse>(
    `/api/products/${productId}/images`
  );
  return response.data;
};

// Categories
export const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>("/api/categories");
  return response.data;
};

// Cart
export const addToCart = async (data: {
  product_id: number;
  quantity: number;
}) => {
  const response = await api.post("/api/cart", data);
  return response.data;
};

export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>("/api/cart");
  return response.data;
};

export const updateCartItem = async (
  productId: number,
  quantity: number
) => {
  const response = await api.put(`/api/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId: number) => {
  const response = await api.delete(`/api/cart/${productId}`);
  return response.data;
};

export const migrateCart = async () => {
  const response = await api.post("/api/cart/migrate");
  apiClient.clearSessionId(); // Clear guest session after migration
  return response.data;
};

// Orders
export const createOrder = async (data: {
  shipping_address_id?: number;
  payment_method: string;
  notes?: string;
}): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>("/api/orders", data);
  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`/api/orders/${id}`);
  return response.data;
};

export const getOrders = async (): Promise<OrdersResponse> => {
  const response = await api.get<OrdersResponse>("/api/orders");
  return response.data;
};

// Loyalty Points
export const getPoints = async (): Promise<PointsResponse> => {
  const response = await api.get<PointsResponse>("/api/points");
  return response.data;
};
