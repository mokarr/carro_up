// Cart types and utilities for localStorage-based shopping cart

export interface CartAccessory {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart item ID
  productId: string;
  productName: string;
  productImage?: string;
  productPrice: number; // in cents
  currency: string;
  variantId?: string;
  variantName?: string;
  variantPriceModifier: number;
  accessories: CartAccessory[];
  vehicleContext?: {
    brand: string;
    model: string;
    year: number;
    config: string;
  };
  quantity: 1;
}

const CART_STORAGE_KEY = "upcarplay-cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addCartItem(item: Omit<CartItem, "id" | "quantity">): CartItem[] {
  const items = getCartItems();
  const newItem: CartItem = {
    ...item,
    id: crypto.randomUUID(),
    quantity: 1,
  };
  items.push(newItem);
  saveCartItems(items);
  return items;
}

export function removeCartItem(id: string): CartItem[] {
  const items = getCartItems().filter((item) => item.id !== id);
  saveCartItems(items);
  return items;
}

export function clearCart(): CartItem[] {
  saveCartItems([]);
  return [];
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const itemPrice = item.productPrice + item.variantPriceModifier;
    const accessoryTotal = item.accessories.reduce((sum, acc) => sum + acc.price, 0);
    return total + itemPrice + accessoryTotal;
  }, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.length;
}
