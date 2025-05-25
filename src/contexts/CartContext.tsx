/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem as FrontendCartItem, Product, ProductColor } from "@/lib/types"; // Rename to avoid conflict
import { toast } from "@/components/ui/sonner";
import { useAuth } from "./AuthContext";
import { apiClient } from "./AuthContext"; // Import the configured axios instance

// Define the structure of the CartItem coming from the backend
// Adjust based on actual backend response structure if different
interface BackendCartItem {
  id: string; // Cart item ID from backend
  quantity: number;
  productId: string;
  product: Product; // Assuming backend populates product details
  // Add selectedSize and selectedColor if backend stores them per cart item
  // selectedSize?: string;
  // selectedColor?: ProductColor;
}

// Define the structure for the Cart response from the backend
interface BackendCart {
  id: string;
  userId: string;
  items: BackendCartItem[];
  // Add other cart properties if available (e.g., total)
}

interface CartContextType {
  items: FrontendCartItem[]; // Keep using FrontendCartItem for consistency in the UI components
  addItem: (product: Product, quantity?: number, size?: string, color?: ProductColor) => Promise<void>; // Make async
  removeItem: (id: string) => Promise<void>; // Use id from backend, make async
  updateQuantity: (id: string, quantity: number) => Promise<void>; // Use id, make async
  clearCart: () => Promise<void>; // Make async
  itemCount: number;
  subtotal: number;
  hasItems: boolean;
  isLoading: boolean;
  fetchCart: () => Promise<void>; // Expose fetchCart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Helper to map backend item to frontend item structure
const mapBackendItemToFrontend = (backendItem: BackendCartItem): FrontendCartItem => {
  return {
    id: backendItem.id, // Store the backend cart item ID
    productId: backendItem.productId,
    quantity: backendItem.quantity,
    product: backendItem.product,
    // Map selectedSize and selectedColor if they exist on backendItem
    // selectedSize: backendItem.selectedSize,
    // selectedColor: backendItem.selectedColor,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [items, setItems] = useState<FrontendCartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth(); // Get auth state

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setItems([]); // Clear cart if not authenticated
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get<BackendCart>("/cart");
      const frontendItems = response.data.items.map(mapBackendItemToFrontend);
      setItems(frontendItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      // Don't show toast on initial fetch error, maybe handle silently or log
      // toast.error("Failed to load your cart.");
      setItems([]); // Clear items on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch cart when auth state changes or component mounts
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Remove localStorage logic
  // useEffect(() => { ... }); 
  // useEffect(() => { ... });

  const addItem = async (product: Product, quantity = 1, size?: string, color?: ProductColor) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    setIsLoading(true);
    try {
      // Backend expects productId, quantity, potentially size/color
      const payload = { 
        productId: product.id, 
        quantity, 
        // Add size and color if backend supports them
        // size: size,
        // color: color ? color.name : undefined // Or send the whole color object if needed
      };
      const response = await apiClient.post<BackendCartItem>("/cart", payload);
      // Refetch cart to get the updated list with backend IDs
      await fetchCart(); 
      let itemDetails = `${product.name}`;
      if (size) itemDetails += ` - Size: ${size}`;
      if (color) itemDetails += ` - Color: ${color.name}`;
      toast.success(`Added ${itemDetails} to cart`);

    } catch (error: any) {
      console.error("Failed to add item to cart:", error);
      const message = error.response?.data?.message || "Failed to add item to cart.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => { // Changed cartItemId to id
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await apiClient.delete(`/cart/${id}`); // Use id in the URL
      // Optimistic update or refetch
      setItems((currentItems) => {
        const itemToRemove = currentItems.find(item => item.id === id); // Use id for finding
        if (itemToRemove) {
          toast.success(`Removed ${itemToRemove.product.name} from cart`);
        }
        return currentItems.filter((item) => item.id !== id); // Use id for filtering
      });
      // Or refetch: await fetchCart();
    } catch (error: any) {
      console.error("Failed to remove item from cart:", error);
      const message = error.response?.data?.message || "Failed to remove item.";
      toast.error(message);
      // Consider refetching on error to ensure consistency
      await fetchCart(); 
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => { // Changed cartItemId to id
    if (!isAuthenticated) return;
    if (quantity <= 0) {
      await removeItem(id); // Use id
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.put<BackendCartItem>(`/cart/${id}`, { quantity }); // Use id in the URL
      // Optimistic update or refetch
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, quantity: response.data.quantity } : item // Use id for matching
        )
      );
      // Or refetch: await fetchCart();
      toast.success("Cart updated");
    } catch (error: any) {
      console.error("Failed to update item quantity:", error);
      const message = error.response?.data?.message || "Failed to update quantity.";
      toast.error(message);
      // Consider refetching on error
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await apiClient.delete("/cart");
      setItems([]);
      toast.success("Cart cleared");
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      const message = error.response?.data?.message || "Failed to clear cart.";
      toast.error(message);
      // Consider refetching on error
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  const hasItems = items.length > 0;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    hasItems,
    isLoading,
    fetchCart, // Expose fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
