import { Product, Category, Subcategory, SubSubcategory, Banner, Coupon } from './types';

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

// Fashion-focused categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Women',
    description: 'Women\'s fashion collection',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    slug: 'women',
    subcategories: [
      { 
        id: '1', 
        name: 'Clothing', 
        categoryId: '1', 
        slug: 'womens-clothing',
        subSubcategories: [
          { id: '1', name: 'Dresses', subcategoryId: '1', slug: 'dresses' },
          { id: '2', name: 'Tops', subcategoryId: '1', slug: 'tops' },
          { id: '3', name: 'Pants', subcategoryId: '1', slug: 'pants' },
          { id: '4', name: 'Skirts', subcategoryId: '1', slug: 'skirts' }
        ]
      },
      { 
        id: '2', 
        name: 'Shoes', 
        categoryId: '1', 
        slug: 'womens-shoes',
        subSubcategories: [
          { id: '5', name: 'Heels', subcategoryId: '2', slug: 'heels' },
          { id: '6', name: 'Flats', subcategoryId: '2', slug: 'flats' },
          { id: '7', name: 'Boots', subcategoryId: '2', slug: 'boots' },
          { id: '8', name: 'Sneakers', subcategoryId: '2', slug: 'womens-sneakers' }
        ]
      },
      { 
        id: '3', 
        name: 'Accessories', 
        categoryId: '1', 
        slug: 'womens-accessories',
        subSubcategories: [
          { id: '9', name: 'Jewelry', subcategoryId: '3', slug: 'jewelry' },
          { id: '10', name: 'Bags', subcategoryId: '3', slug: 'bags' },
          { id: '11', name: 'Scarves', subcategoryId: '3', slug: 'scarves' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Men',
    description: 'Men\'s fashion collection',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
    slug: 'men',
    subcategories: [
      { 
        id: '4', 
        name: 'Clothing', 
        categoryId: '2', 
        slug: 'mens-clothing',
        subSubcategories: [
          { id: '12', name: 'T-shirts', subcategoryId: '4', slug: 'tshirts' },
          { id: '13', name: 'Shirts', subcategoryId: '4', slug: 'shirts' },
          { id: '14', name: 'Pants', subcategoryId: '4', slug: 'mens-pants' },
          { id: '15', name: 'Suits', subcategoryId: '4', slug: 'suits' }
        ]
      },
      { 
        id: '5', 
        name: 'Shoes', 
        categoryId: '2', 
        slug: 'mens-shoes',
        subSubcategories: [
          { id: '16', name: 'Formal', subcategoryId: '5', slug: 'formal-shoes' },
          { id: '17', name: 'Casual', subcategoryId: '5', slug: 'casual-shoes' },
          { id: '18', name: 'Sneakers', subcategoryId: '5', slug: 'mens-sneakers' },
          { id: '19', name: 'Boots', subcategoryId: '5', slug: 'mens-boots' }
        ]
      },
      { 
        id: '6', 
        name: 'Accessories', 
        categoryId: '2', 
        slug: 'mens-accessories',
        subSubcategories: [
          { id: '20', name: 'Watches', subcategoryId: '6', slug: 'watches' },
          { id: '21', name: 'Belts', subcategoryId: '6', slug: 'belts' },
          { id: '22', name: 'Ties', subcategoryId: '6', slug: 'ties' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Kids',
    description: 'Fashion for children',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8',
    slug: 'kids',
    subcategories: [
      { 
        id: '7', 
        name: 'Girls', 
        categoryId: '3', 
        slug: 'girls',
        subSubcategories: [
          { id: '23', name: 'Dresses', subcategoryId: '7', slug: 'girls-dresses' },
          { id: '24', name: 'Tops', subcategoryId: '7', slug: 'girls-tops' },
          { id: '25', name: 'Bottoms', subcategoryId: '7', slug: 'girls-bottoms' }
        ]
      },
      { 
        id: '8', 
        name: 'Boys', 
        categoryId: '3', 
        slug: 'boys',
        subSubcategories: [
          { id: '26', name: 'Shirts', subcategoryId: '8', slug: 'boys-shirts' },
          { id: '27', name: 'Pants', subcategoryId: '8', slug: 'boys-pants' },
          { id: '28', name: 'Outerwear', subcategoryId: '8', slug: 'boys-outerwear' }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Seasonal',
    description: 'Season-specific fashion items',
    image: 'https://images.unsplash.com/photo-1515664069236-68a74c369d97',
    slug: 'seasonal',
    subcategories: [
      { 
        id: '9', 
        name: 'Summer', 
        categoryId: '4', 
        slug: 'summer',
        subSubcategories: [
          { id: '29', name: 'Swimwear', subcategoryId: '9', slug: 'swimwear' },
          { id: '30', name: 'Light Clothing', subcategoryId: '9', slug: 'light-clothing' }
        ]
      },
      { 
        id: '10', 
        name: 'Winter', 
        categoryId: '4', 
        slug: 'winter',
        subSubcategories: [
          { id: '31', name: 'Jackets', subcategoryId: '10', slug: 'jackets' },
          { id: '32', name: 'Sweaters', subcategoryId: '10', slug: 'sweaters' },
          { id: '33', name: 'Scarves & Gloves', subcategoryId: '10', slug: 'winter-accessories' }
        ]
      }
    ]
  },
];

// Generate fashion products
export const products: Product[] = [
  // Women's products
  {
    id: '1',
    name: 'Floral Summer Dress',
    description: 'Beautiful floral pattern dress perfect for summer days.',
    price: 79.99,
    salePrice: 59.99,
    images: ['https://images.unsplash.com/photo-1550639525-c97d455acf70'],
    categoryId: '1', // Women
    subcategoryId: '1', // Clothing
    subSubcategoryId: '1', // Dresses
    featured: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    slug: 'floral-summer-dress',
    // Added sizes and colors
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blue', hex: '#1e40af' },
      { name: 'Pink', hex: '#ec4899' },
      { name: 'White', hex: '#ffffff' }
    ]
  },
  {
    id: '2',
    name: 'Designer Handbag',
    description: 'Luxury designer handbag with premium materials.',
    price: 299.99,
    salePrice: 249.99,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa'],
    categoryId: '1', // Women
    subcategoryId: '3', // Accessories
    subSubcategoryId: '10', // Bags
    featured: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 45,
    slug: 'designer-handbag',
    // Added colors only (no sizes for bags)
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#964B00' },
      { name: 'Red', hex: '#dc2626' }
    ]
  },
  // Men's products
  {
    id: '3',
    name: 'Slim Fit Dress Shirt',
    description: 'Classic slim fit dress shirt with premium cotton.',
    price: 69.99,
    salePrice: null,
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10'],
    categoryId: '2', // Men
    subcategoryId: '4', // Clothing
    subSubcategoryId: '13', // Shirts
    featured: false,
    inStock: true,
    rating: 4.5,
    reviewCount: 56,
    slug: 'slim-fit-shirt',
    // Added sizes and colors
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Light Blue', hex: '#93c5fd' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: '4',
    name: 'Formal Leather Shoes',
    description: 'Elegant formal leather shoes for men.',
    price: 149.99,
    salePrice: 129.99,
    images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a'],
    categoryId: '2', // Men
    subcategoryId: '5', // Shoes
    subSubcategoryId: '16', // Formal
    featured: true,
    inStock: true,
    rating: 4.7,
    reviewCount: 38,
    slug: 'formal-leather-shoes',
    // Added sizes and colors
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Brown', hex: '#964B00' },
      { name: 'Black', hex: '#000000' }
    ]
  },
];

// Add more fashion products to reach 30
for (let i = 5; i <= 30; i++) {
  // Randomize categories
  const categoryIndex = (i % 4) + 1;
  const categoryId = categoryIndex.toString();
  
  // Get subcategories for this category
  const category = categories.find(c => c.id === categoryId);
  const subcategoryIndex = (i % (category?.subcategories?.length || 1));
  const subcategoryId = category?.subcategories?.[subcategoryIndex]?.id || '1';
  
  // Get subSubcategories for this subcategory
  const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);
  const subSubcategoryIndex = (i % (subcategory?.subSubcategories?.length || 1));
  const subSubcategoryId = subcategory?.subSubcategories?.[subSubcategoryIndex]?.id || '1';
  
  const isFeatured = i <= 10; // First 10 products are featured
  
  // Define sizes based on category and subcategory
  let sizes: string[] = [];
  let colors: { name: string; hex: string }[] = [];
  
  // Set sizes based on product type
  if (categoryId === '1' || categoryId === '2') { // Women's or Men's
    if (subcategoryId === '1' || subcategoryId === '4') { // Clothing
      sizes = ['XS', 'S', 'M', 'L', 'XL'];
      // Add XXL for men's clothing
      if (categoryId === '2') {
        sizes.push('XXL');
      }
    } else if (subcategoryId === '2' || subcategoryId === '5') { // Shoes
      // Women's shoe sizes
      if (categoryId === '1') {
        sizes = ['5', '6', '7', '8', '9', '10'];
      } else { // Men's shoe sizes
        sizes = ['7', '8', '9', '10', '11', '12'];
      }
    }
    // No sizes for accessories
  } else if (categoryId === '3') { // Kids
    // Kids clothing sizes
    sizes = ['3T', '4T', '5T', '6', '7', '8'];
  } else if (categoryId === '4') { // Seasonal
    // Standard sizes for seasonal items
    sizes = ['S', 'M', 'L', 'XL'];
  }
  
  // Set colors based on product index for variety
  const colorSets = [
    [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#ffffff' }
    ],
    [
      { name: 'Red', hex: '#dc2626' },
      { name: 'Blue', hex: '#2563eb' },
      { name: 'Green', hex: '#16a34a' }
    ],
    [
      { name: 'Navy', hex: '#1e3a8a' },
      { name: 'Gray', hex: '#6b7280' },
      { name: 'Beige', hex: '#f5f5dc' }
    ],
    [
      { name: 'Purple', hex: '#7e22ce' },
      { name: 'Pink', hex: '#ec4899' },
      { name: 'Yellow', hex: '#eab308' }
    ],
    [
      { name: 'Brown', hex: '#964B00' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Teal', hex: '#0d9488' }
    ]
  ];
  
  colors = colorSets[i % colorSets.length];
  
  // For some accessories, only include colors (no sizes)
  const isAccessory = subcategoryId === '3' || subcategoryId === '6';
  
  products.push({
    id: i.toString(),
    name: `Fashion Item ${i}`,
    description: `This is fashion item number ${i} with detailed description.`,
    price: 50 + i * 5,
    salePrice: i % 3 === 0 ? 40 + i * 5 : null, // Every 3rd product has a sale
    images: ['https://images.unsplash.com/photo-1523381294911-8d3cead13475'],
    categoryId,
    subcategoryId,
    subSubcategoryId,
    featured: isFeatured,
    inStock: i % 5 !== 0, // Every 5th product is out of stock
    rating: 3.5 + (Math.random() * 1.5),
    reviewCount: Math.floor(Math.random() * 100) + 10,
    slug: `fashion-item-${i}`,
    // Add sizes only if not an accessory
    ...(isAccessory ? {} : { sizes }),
    // Add colors to all products
    colors
  });
}

export const banners: Banner[] = [
  {
    id: '1',
    title: 'Summer Collection',
    subtitle: 'Up to 50% off on selected fashion items',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    linkUrl: '/products?category=1',
    isActive: true,
  },
  {
    id: '2',
    title: 'Men\'s Style',
    subtitle: 'Check out our latest men\'s fashion arrivals',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    linkUrl: '/products?category=2',
    isActive: true,
  },
  {
    id: '3',
    title: 'Kids Fashion',
    subtitle: 'Stylish and comfortable clothing for kids',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8',
    linkUrl: '/products?category=3',
    isActive: true,
  },
];

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'FASHION10',
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
