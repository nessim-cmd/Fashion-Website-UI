/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { api } from "@/utils/api";
import { useAuth } from "./AuthContext";
import React from "react";

// Define types
type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  // Add other product properties as needed
};

type WishlistItem = {
  name: any;
  slug: any;
  images: any;
  inStock: any;
  salePrice: any;
  price: any;
  id: string;
  productId: string;
  product: Product;
};

type WishlistContextType = {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
};

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Load wishlist on initial render
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated) {
        try {
          const wishlistData = await api.getWishlist();
          setItems(wishlistData);
        } catch (error) {
          console.error('Failed to load wishlist from API:', error);
        }
      } else {
        // Load from localStorage for non-authenticated users
        try {
          const savedWishlist = localStorage.getItem("wishlist");
          if (savedWishlist) {
            setItems(JSON.parse(savedWishlist));
          }
        } catch (error) {
          console.error("Failed to load wishlist from localStorage:", error);
        }
      }
    };
    
    loadWishlist();
  }, [isAuthenticated]);

  // Save wishlist to localStorage (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  // Add item to wishlist
  const addItem = async (product: Product) => {
    if (isInWishlist(product.id)) {
      toast.info(`${product.name} is already in your wishlist`);
      return;
    }

    if (isAuthenticated) {
      try {
        await api.addToWishlist({ productId: product.id });
        
        // Refresh wishlist
        const wishlistData = await api.getWishlist();
        setItems(wishlistData);
        
        toast.success(`${product.name} added to wishlist`);
      } catch (error) {
        console.error('Failed to add item to wishlist:', error);
        toast.error('Failed to add item to wishlist');
      }
    } else {
      // For non-authenticated users
      const newItem = {
        id: `local-${Date.now()}`,
        productId: product.id,
        product
      };
      setItems([...items, newItem]);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  // Remove item from wishlist
  const removeItem = async (productId: string) => {
    if (isAuthenticated) {
      try {
        await api.removeFromWishlist(productId);
        
        // Refresh wishlist
        const wishlistData = await api.getWishlist();
        setItems(wishlistData);
        
        toast.success('Item removed from wishlist');
      } catch (error) {
        console.error('Failed to remove item from wishlist:', error);
        toast.error('Failed to remove item from wishlist');
      }
    } else {
      // For non-authenticated users
      setItems(items.filter((item) => item.productId !== productId));
      toast.success('Item removed from wishlist');
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        // Note: Backend needs to implement this endpoint
        await fetch(`${api}/wishlist`, { method: 'DELETE' });
        setItems([]);
        toast.success('Wishlist cleared');
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
        toast.error('Failed to clear wishlist');
      }
    } else {
      // For non-authenticated users
      setItems([]);
      localStorage.removeItem("wishlist");
      toast.success('Wishlist cleared');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addItem,
        removeItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
