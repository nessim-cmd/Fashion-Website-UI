
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, ProductColor } from "@/lib/types";
import { toast } from "@/components/ui/sonner";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: ProductColor) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  hasItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1, size?: string, color?: ProductColor) => {
    setItems((currentItems) => {
      // Find if we have the exact same product with same size and color
      const existingItemIndex = currentItems.findIndex(
        (item) => 
          item.productId === product.id && 
          item.selectedSize === size && 
          ((!item.selectedColor && !color) || 
           (item.selectedColor?.name === color?.name))
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        let itemDetails = `${product.name}`;
        if (size) itemDetails += ` - Size: ${size}`;
        if (color) itemDetails += ` - Color: ${color.name}`;
        
        toast.success(`Added ${itemDetails} to cart`);
        return [
          ...currentItems, 
          { 
            productId: product.id, 
            quantity, 
            product,
            selectedSize: size,
            selectedColor: color
          }
        ];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find(item => item.productId === productId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.product.name} from cart`);
      }
      return currentItems.filter((item) => item.productId !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
