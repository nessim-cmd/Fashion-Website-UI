/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = ( ) => localStorage.getItem('token');

// Generic fetch function with auth
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return response.json();
};

// API methods
export const api = {
  // Auth
  register: (data: any) => 
    fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => 
    fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => 
    fetchWithAuth('/auth/me'),
  
  // Products
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return fetchWithAuth(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getProductById: (id: string) => fetchWithAuth(`/products/${id}`),
  getProductBySlug: (slug: string) => fetchWithAuth(`/products/slug/${slug}`),
  getFeaturedProducts: () => fetchWithAuth('/products/featured'),
  
  // Categories
  getCategories: () => fetchWithAuth('/categories'),
  getCategoryBySlug: (slug: string) => fetchWithAuth(`/categories/slug/${slug}`),
  
  // Cart
  getCart: () => fetchWithAuth('/cart'),
  addToCart: (data: any) => fetchWithAuth('/cart', { method: 'POST', body: JSON.stringify(data) }),
  updateCartItem: (id: string, data: any) => fetchWithAuth(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeFromCart: (id: string) => fetchWithAuth(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => fetchWithAuth('/cart', { method: 'DELETE' }),
  
  // Wishlist
  getWishlist: () => fetchWithAuth('/wishlist'),
  addToWishlist: (data: any) => fetchWithAuth('/wishlist', { method: 'POST', body: JSON.stringify(data) }),
  removeFromWishlist: (productId: string) => fetchWithAuth(`/wishlist/${productId}`, { method: 'DELETE' }),
  
  // Orders
  getOrders: () => fetchWithAuth('/orders'),
  getOrderById: (id: string) => fetchWithAuth(`/orders/${id}`),
  createOrder: (data: any) => fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify(data) }),
  
  // Coupons
  validateCoupon: (code: string) => fetchWithAuth(`/coupons/${code}`),
  getActiveCoupons: () => fetchWithAuth('/coupons'),
  
  // Banners
  getBanners: () => fetchWithAuth('/banners'),
  
  // Special Offers
  getSpecialOffers: () => fetchWithAuth('/special-offers'),
};
