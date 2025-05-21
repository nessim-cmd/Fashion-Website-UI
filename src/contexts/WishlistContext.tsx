import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/types';

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);
  
  const addItem = (product: Product) => {
    setItems(prevItems => {
      // Check if product is already in wishlist
      if (prevItems.some(item => item.id === product.id)) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };
  
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };
  
  const clearWishlist = () => {
    setItems([]);
  };
  
  const value = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    itemCount: items.length,
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
