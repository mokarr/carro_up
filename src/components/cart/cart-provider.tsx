"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type CartItem,
  getCartItems,
  addCartItem as addCartItemLib,
  removeCartItem as removeCartItemLib,
  clearCart as clearCartLib,
  getCartTotal,
  getCartCount,
} from "@/lib/cart";

type CartContextType = {
  items: CartItem[];
  total: number;
  count: number;
  sidebarOpen: boolean;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(getCartItems());
    setMounted(true);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "id" | "quantity">) => {
    const updated = addCartItemLib(item);
    setItems(updated);
    setSidebarOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    const updated = removeCartItemLib(id);
    setItems(updated);
  }, []);

  const clear = useCallback(() => {
    const updated = clearCartLib();
    setItems(updated);
  }, []);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Don't flash wrong count during hydration
  const total = mounted ? getCartTotal(items) : 0;
  const count = mounted ? getCartCount(items) : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        sidebarOpen,
        addItem,
        removeItem,
        clear,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
