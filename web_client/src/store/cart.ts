'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const items = get().items;
        const existing = items.find(i => i.product.id === product.id);
        if (existing) {
          set({ items: items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => set({ items: get().items.filter(i => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter(i => i.product.id !== productId) });
        } else {
          set({ items: get().items.map(i => i.product.id === productId ? { ...i, quantity } : i) });
        }
      },
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
