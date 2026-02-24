'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface FavoritesState {
  products: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      products: [],
      addFavorite: (product) => set({ products: [...get().products, product] }),
      removeFavorite: (productId) => set({ products: get().products.filter(p => p.id !== productId) }),
      toggleFavorite: (product) => {
        if (get().isFavorite(product.id)) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },
      isFavorite: (productId) => get().products.some(p => p.id === productId),
    }),
    { name: 'favorites-storage' }
  )
);
