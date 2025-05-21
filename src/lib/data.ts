
import { Product, Category, Subcategory, Banner, Coupon } from './types';

export const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Latest and greatest electronic gadgets',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    slug: 'electronics',
    subcategories: [
      { id: '1', name: 'Smartphones', categoryId: '1', slug: 'smartphones' },
      { id: '2', name: 'Laptops', categoryId: '1', slug: 'laptops' },
      { id: '3', name: 'Accessories', categoryId: '1', slug: 'electronics-accessories' }
    ]
  },
  {
    id: '2',
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    slug: 'fashion',
    subcategories: [
      { id: '4', name: 'Men', categoryId: '2', slug: 'men' },
      { id: '5', name: 'Women', categoryId: '2', slug: 'women' },
      { id: '6', name: 'Accessories', categoryId: '2', slug: 'fashion-accessories' }
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    description: 'Everything for your home',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    slug: 'home-garden',
    subcategories: [
      { id: '7', name: 'Furniture', categoryId: '3', slug: 'furniture' },
      { id: '8', name: 'Decor', categoryId: '3', slug: 'decor' },
      { id: '9', name: 'Kitchen', categoryId: '3', slug: 'kitchen' }
    ]
  },
  {
    id: '4',
    name: 'Books',
    description: 'Bestsellers and classics',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    slug: 'books',
    subcategories: [
      { id: '10', name: 'Fiction', categoryId: '4', slug: 'fiction' },
      { id: '11', name: 'Non-Fiction', categoryId: '4', slug: 'non-fiction' },
      { id: '12', name: 'Children', categoryId: '4', slug: 'children-books' }
    ]
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    description: 'High-performance laptop with the latest processor and stunning display.',
    price: 1299.99,
    salePrice: 1099.99,
    images: ['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'],
    categoryId: '1',
    subcategoryId: '2',
    featured: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    slug: 'premium-laptop'
  },
  {
    id: '2',
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with noise cancellation and long battery life.',
    price: 199.99,
    salePrice: 149.99,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
    categoryId: '1',
    subcategoryId: '3',
    featured: true,
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    slug: 'wireless-earbuds'
  },
  {
    id: '3',
    name: 'Slim Fit Jeans',
    description: 'Classic slim fit jeans with premium denim quality.',
    price: 79.99,
    salePrice: null,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
    categoryId: '2',
    subcategoryId: '4',
    featured: false,
    inStock: true,
    rating: 4.3,
    reviewCount: 56,
    slug: 'slim-fit-jeans'
  },
  {
    id: '4',
    name: 'Designer Handbag',
    description: 'Luxury designer handbag with premium materials.',
    price: 299.99,
    salePrice: 249.99,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
    categoryId: '2',
    subcategoryId: '6',
    featured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 45,
    slug: 'designer-handbag'
  },
  {
    id: '5',
    name: 'Modern Coffee Table',
    description: 'Sleek modern coffee table with tempered glass top.',
    price: 349.99,
    salePrice: null,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04'],
    categoryId: '3',
    subcategoryId: '7',
    featured: false,
    inStock: true,
    rating: 4.5,
    reviewCount: 32,
    slug: 'modern-coffee-table'
  },
  {
    id: '6',
    name: 'Bestselling Novel',
    description: 'Award-winning fiction novel that topped charts worldwide.',
    price: 24.99,
    salePrice: 19.99,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
    categoryId: '4',
    subcategoryId: '10',
    featured: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 98,
    slug: 'bestselling-novel'
  },
];

// Add more products to reach 30
for (let i = 7; i <= 30; i++) {
  const categoryId = ((i % 4) + 1).toString();
  const subcategoryId = ((i % 12) + 1).toString();
  const isFeatured = i <= 10; // First 10 products are featured
  
  products.push({
    id: i.toString(),
    name: `Product ${i}`,
    description: `This is product number ${i} with detailed description.`,
    price: 50 + i * 10,
    salePrice: i % 3 === 0 ? 40 + i * 10 : null, // Every 3rd product has a sale
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
    categoryId,
    subcategoryId,
    featured: isFeatured,
    inStock: i % 5 !== 0, // Every 5th product is out of stock
    rating: 3.5 + (Math.random() * 1.5),
    reviewCount: Math.floor(Math.random() * 100) + 10,
    slug: `product-${i}`
  });
}

export const banners: Banner[] = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    linkUrl: '/products?sale=true',
    isActive: true,
  },
  {
    id: '2',
    title: 'New Collection',
    subtitle: 'Check out our latest arrivals',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    linkUrl: '/products?new=true',
    isActive: true,
  },
  {
    id: '3',
    title: 'Free Shipping',
    subtitle: 'On orders over $100',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    linkUrl: '/shipping-policy',
    isActive: true,
  },
];

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minPurchase: 50,
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: '2',
    code: 'SUMMER25',
    discount: 25,
    type: 'percentage',
    minPurchase: 100,
    expiresAt: '2025-09-01T23:59:59Z',
    isActive: true,
  },
  {
    id: '3',
    code: 'FREESHIP',
    discount: 15,
    type: 'fixed',
    minPurchase: 75,
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
  },
];
