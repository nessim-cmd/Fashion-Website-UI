/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { api } from "@/utils/api";
import { useAuth } from "./AuthContext";
import React from "react";

// Define types
type Product = {
  slug: any;
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  // Add other product properties as needed
};

type ProductColor = {
  name: string;
  hex: string;
};

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: ProductColor;
  product: Product;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hasItems: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: ProductColor) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Calculate derived values
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  const hasItems = items.length > 0;

  // Load cart on initial render
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const cartData = await api.getCart();
          setItems(cartData.items);
        } catch (error) {
          console.error('Failed to load cart from API:', error);
        }
      } else {
        // Load from localStorage for non-authenticated users
        try {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } catch (error) {
          console.error("Failed to load cart from localStorage:", error);
        }
      }
    };
    
    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // Add item to cart
  const addItem = async (product: Product, quantity = 1, size?: string, color?: ProductColor) => {
    if (isAuthenticated) {
      try {
        await api.addToCart({
          productId: product.id,
          quantity,
          selectedSize: size,
          selectedColor: color
        });
        
        // Refresh cart
        const cartData = await api.getCart();
        setItems(cartData.items);
        
        let itemDetails = `${product.name}`;
        if (size) itemDetails += ` - Size: ${size}`;
        if (color) itemDetails += ` - Color: ${color.name}`;
        
        toast.success(`Added ${itemDetails} to cart`);
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        toast.error('Failed to add item to cart');
      }
    } else {
      // For non-authenticated users, handle cart locally
      const existingItemIndex = items.findIndex(
        (item) => 
          item.productId === product.id && 
          item.selectedSize === size && 
          JSON.stringify(item.selectedColor) === JSON.stringify(color)
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += quantity;
        setItems(updatedItems);
      } else {
        // Add new item
        const newItem = {
          id: `local-${Date.now()}`,
          productId: product.id,
          quantity,
          selectedSize: size,
          selectedColor: color,
          product
        };
        setItems([...items, newItem]);
      }

      let itemDetails = `${product.name}`;
      if (size) itemDetails += ` - Size: ${size}`;
      if (color) itemDetails += ` - Color: ${color.name}`;
      
      toast.success(`Added ${itemDetails} to cart`);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    if (isAuthenticated) {
      try {
        await api.removeFromCart(itemId);
        
        // Refresh cart
        const cartData = await api.getCart();
        setItems(cartData.items);
        
        toast.success('Item removed from cart');
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        toast.error('Failed to remove item from cart');
      }
    } else {
      // For non-authenticated users
      setItems(items.filter((item) => item.id !== itemId));
      toast.success('Item removed from cart');
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    if (isAuthenticated) {
      try {
        await api.updateCartItem(itemId, { quantity });
        
        // Refresh cart
        const cartData = await api.getCart();
        setItems(cartData.items);
      } catch (error) {
        console.error('Failed to update cart item:', error);
        toast.error('Failed to update cart item');
      }
    } else {
      // For non-authenticated users
      const updatedItems = items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.clearCart();
        setItems([]);
        toast.success('Cart cleared');
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error('Failed to clear cart');
      }
    } else {
      // For non-authenticated users
      setItems([]);
      localStorage.removeItem("cart");
      toast.success('Cart cleared');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        hasItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
