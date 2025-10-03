const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: any) => fetchAPI('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (token: string) => fetchAPI('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } }),

  // Products
  getProducts: () => fetchAPI('/api/products'),
  getProduct: (id: string) => fetchAPI(`/api/products/${id}`),
  getProductImages: (id: string) => fetchAPI(`/api/products/${id}/images`),

  // Categories
  getCategories: () => fetchAPI('/api/categories'),

  // Cart
  addToCart: (data: any, token?: string, sessionId?: string) => {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (sessionId) headers['X-Session-ID'] = sessionId;
    return fetchAPI('/api/cart', { method: 'POST', body: JSON.stringify(data), headers });
  },
  getCart: (token?: string, sessionId?: string) => {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (sessionId) headers['X-Session-ID'] = sessionId;
    return fetchAPI('/api/cart', { headers });
  },
  updateCartItem: (id: string, quantity: number, token?: string, sessionId?: string) => {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (sessionId) headers['X-Session-ID'] = sessionId;
    return fetchAPI(`/api/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }), headers });
  },
  removeFromCart: (id: string, token?: string, sessionId?: string) => {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (sessionId) headers['X-Session-ID'] = sessionId;
    return fetchAPI(`/api/cart/${id}`, { method: 'DELETE', headers });
  },

  // Orders
  createOrder: (data: any, token: string) => 
    fetchAPI('/api/orders', { method: 'POST', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
  getOrders: (token: string) => 
    fetchAPI('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
  getOrder: (id: string, token: string) => 
    fetchAPI(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};
