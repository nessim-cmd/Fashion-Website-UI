/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  slug: string;
  subSubcategories?: SubSubcategory[];
}

export interface SubSubcategory {
  id: string;
  name: string;
  subcategoryId: string;
  slug: string;
}

export interface Product {
  createdAt: any;
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  categoryId: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  slug: string;
  sizes?: string[];
  colors?: ProductColor[];
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Add id field to CartItem to uniquely identify the cart item itself
export interface CartItem {
  id: string; // Unique identifier for the cart item entry
  productId: string;
  quantity: number;
  product: Product;
  selectedSize?: string;
  selectedColor?: ProductColor;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: Address;
  paymentMethod: 'cash-on-delivery';
  createdAt: string;
  couponApplied?: Coupon;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minPurchase?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

export interface SpecialOffer {
  id: string;
  value: string;
  title: string;
  description: string;
  buttonText?: string;
  linkUrl?: string;
  isActive: boolean;
}
