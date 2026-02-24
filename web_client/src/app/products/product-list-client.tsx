'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTr } from '@/i18n';
import { useProductsInfinite } from '@/hooks/queries/use-products';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Chip } from '@/components/ui/chip';
import { ProductGrid } from '@/components/product/product-grid';
import type { Product, Pagination, ApiResponse } from '@/types';

interface ProductListClientProps {
  initialProducts: Product[];
  initialPagination?: Pagination;
  filters: Record<string, string | undefined>;
}

export function ProductListClient({ initialProducts, initialPagination, filters }: ProductListClientProps) {
  const t = useTr();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || '';

  const queryFilters = {
    category_id: filters.category_id ? Number(filters.category_id) : undefined,
    subcategory_id: filters.subcategory_id ? Number(filters.subcategory_id) : undefined,
    brand_id: filters.brand_id ? Number(filters.brand_id) : undefined,
    is_new: filters.is_new ? true : undefined,
    is_discount: filters.is_discount ? true : undefined,
    sort: sort || undefined,
  };

  const initialPage: ApiResponse<Product[]> = {
    success: true,
    data: initialProducts,
    pagination: initialPagination,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useProductsInfinite(
    queryFilters,
    { pages: [initialPage], pageParams: [1] },
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScroll(loadMore, !!hasNextPage, isFetchingNextPage);

  const allProducts = data?.pages.flatMap(p => p.data ?? []) ?? initialProducts;
  const total = data?.pages[0]?.pagination?.total ?? initialPagination?.total ?? 0;

  const toggleSort = (s: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === s) params.delete('sort');
    else params.set('sort', s);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {t('total_products')} {total} {t('products_count')}
        </span>
        <div className="flex gap-2">
          <Chip active={sort === 'price_asc'} onClick={() => toggleSort('price_asc')}>{t('low_price')}</Chip>
          <Chip active={sort === 'price_desc'} onClick={() => toggleSort('price_desc')}>{t('high_price')}</Chip>
        </div>
      </div>

      <ProductGrid products={allProducts} loading={isLoading && allProducts.length === 0} />

      {hasNextPage && <div ref={sentinelRef} className="h-10" />}
    </div>
  );
}
