'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useTr } from '@/i18n';
import { useDebounce } from '@/hooks/use-debounce';
import { useProducts } from '@/hooks/queries/use-products';
import { SearchInput } from '@/components/ui/search-input';
import { ProductGrid } from '@/components/product/product-grid';
import { EmptyState } from '@/components/ui/empty-state';

export default function SearchPage() {
  const t = useTr();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQ);
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    if (debounced.trim()) {
      router.replace(`/search?q=${encodeURIComponent(debounced.trim())}`);
    }
  }, [debounced, router]);

  const { data, isLoading } = useProducts({
    search: debounced.trim() || undefined,
    limit: 40,
  });

  const products = data?.data ?? [];

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={t('search_hint')}
        autoFocus
        className="mb-4"
      />

      {debounced.trim() && (
        <p className="mb-4 text-sm text-muted-foreground">
          {t('search_results')}: {products.length}
        </p>
      )}

      {debounced.trim() && products.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Search size={48} strokeWidth={1} />}
          title={t('no_results')}
        />
      ) : (
        <ProductGrid products={products} loading={isLoading} />
      )}
    </div>
  );
}
