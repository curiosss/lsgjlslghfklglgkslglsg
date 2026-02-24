'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/favorites';
import { useTr } from '@/i18n';
import { ProductGrid } from '@/components/product/product-grid';
import { EmptyState } from '@/components/ui/empty-state';

export default function FavoritesPage() {
  const t = useTr();
  const { products } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for localStorage state
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={48} strokeWidth={1} />}
        title={t('favorites_empty_title')}
        subtitle={t('favorites_empty_subtitle')}
      />
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">{t('favorites_title')}</h1>
      <ProductGrid products={products} />
    </div>
  );
}
