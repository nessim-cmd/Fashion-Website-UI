/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";
import { apiClient } from "./AuthContext"; // Import the configured axios instance

// Define the structure of the WishlistItem coming from the backend
// Assuming backend returns the full product object in the wishlist
interface BackendWishlistItem {
  id: string; // Wishlist item ID from backend (if available, otherwise use productId)
  productId: string;
  userId: string;
  product: Product; // Assuming backend populates product details
}

// Define the structure for the Wishlist response from the backend
interface BackendWishlist {
  id: string;
  userId: string;
  items: BackendWishlistItem[];
}

interface WishlistContextType {
  items: Product[]; // Store full Product objects
  addItem: (product: Product) => Promise<void>; // Make async
  removeItem: (productId: string) => Promise<void>; // Make async
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>; // Make async
  itemCount: number;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>; // Expose fetchWishlist
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth(); // Get auth state

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setItems([]); // Clear wishlist if not authenticated
      return;
    }
    setIsLoading(true);
    try {
      // Assuming the backend returns an array of WishlistItems with populated products
      const response = await apiClient.get<BackendWishlist>("/wishlist"); 
      // Extract the product objects from the wishlist items
      const products = response.data.items.map(item => item.product);
      setItems(products);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      // Don't toast on initial fetch error
      setItems([]); // Clear items on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch wishlist when auth state changes or component mounts
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Remove localStorage logic
  // useEffect(() => { ... }); 
  // useEffect(() => { ... });

  const addItem = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }
    // Prevent adding if already in wishlist (client-side check)
    if (isInWishlist(product.id)) {
        toast.info(`${product.name} is already in your wishlist.`);
        return;
    }

    setIsLoading(true);
    try {
      // Backend expects productId
      await apiClient.post("/wishlist", { productId: product.id });
      // Optimistic update
      setItems(prevItems => [...prevItems, product]);
      toast.success(`Added ${product.name} to wishlist`);
      // Or refetch: await fetchWishlist(); 
    } catch (error: any) {
      console.error("Failed to add item to wishlist:", error);
      const message = error.response?.data?.message || "Failed to add item to wishlist.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await apiClient.delete(`/wishlist/${productId}`);
      // Optimistic update
      const removedItem = items.find(item => item.id === productId);
      setItems(prevItems => prevItems.filter(item => item.id !== productId));
      if (removedItem) {
          toast.success(`Removed ${removedItem.name} from wishlist`);
      }
      // Or refetch: await fetchWishlist();
    } catch (error: any) {
      console.error("Failed to remove item from wishlist:", error);
      const message = error.response?.data?.message || "Failed to remove item.";
      toast.error(message);
      // Consider refetching on error
      await fetchWishlist();
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) return;
    // Check if wishlist is already empty
    if (items.length === 0) return;
    
    setIsLoading(true);
    try {
      await apiClient.delete("/wishlist");
      setItems([]);
      toast.success("Wishlist cleared");
    } catch (error: any) {
      console.error("Failed to clear wishlist:", error);
      const message = error.response?.data?.message || "Failed to clear wishlist.";
      toast.error(message);
      // Consider refetching on error
      await fetchWishlist();
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    itemCount: items.length,
    isLoading,
    fetchWishlist, // Expose fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
