import { useSyncExternalStore } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  lineId: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

type CartState = { items: CartItem[] };
const KEY = "elme_cart_v1";
let state: CartState = { items: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function lineId(productId: string, size?: string, color?: string) {
  return [productId, size ?? "", color ?? ""].join("::");
}
function emit() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) state = JSON.parse(saved) as CartState;
  } catch { /* ignore malformed local cart data */ }
}

export const cartStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get() { hydrate(); return state; },
  getServer() { return { items: [] } as CartState; },
  add(product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) {
    if (!product.inStock || quantity < 1) return;
    const id = lineId(product.id, selectedSize, selectedColor);
    const existing = state.items.find((item) => item.lineId === id);
    state = existing
      ? { items: state.items.map((item) => item.lineId === id ? { ...item, quantity: item.quantity + quantity } : item) }
      : { items: [...state.items, { lineId: id, productId: product.id, product, quantity, selectedSize, selectedColor }] };
    emit();
  },
  update(lineIdValue: string, quantity: number) {
    if (quantity < 1) return cartStore.remove(lineIdValue);
    state = { items: state.items.map((item) => item.lineId === lineIdValue ? { ...item, quantity } : item) };
    emit();
  },
  remove(lineIdValue: string) {
    state = { items: state.items.filter((item) => item.lineId !== lineIdValue) };
    emit();
  },
  clear() { state = { items: [] }; emit(); },
};

export function useCart() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServer);
}
export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity, 0);
}
export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
