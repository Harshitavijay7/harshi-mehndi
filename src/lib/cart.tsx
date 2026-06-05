import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/catalog";

export type CartItem = { product: Product; qty: number };

type CartContextType = {
  items: CartItem[];
  wishlist: string[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWishlist: (id: string) => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const priceOf = (p: Product) => p.discountPrice ?? p.price;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("harshi_cart");
      const w = localStorage.getItem("harshi_wishlist");
      if (c) setItems(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("harshi_cart", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("harshi_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const add = (product: Product, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product, qty }];
    });

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);
  const toggleWishlist = (id: string) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + priceOf(i.product) * i.qty, 0), [items]);

  const value = { items, wishlist, add, remove, setQty, clear, toggleWishlist, count, subtotal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
