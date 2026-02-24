import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, Product, ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () =>
      clientFetch<ApiResponse<Product[]>>('/products', {
        params: filters as unknown as Record<string, string | number | boolean | undefined>,
      }),
  });
}

export function useProductsInfinite(filters: Omit<ProductFilters, 'page'>, initialData?: { pages: ApiResponse<Product[]>[]; pageParams: number[] }) {
  return useInfiniteQuery({
    queryKey: ['products-infinite', filters],
    queryFn: ({ pageParam }) =>
      clientFetch<ApiResponse<Product[]>>('/products', {
        params: { ...filters, page: pageParam, limit: 20 } as unknown as Record<string, string | number | boolean | undefined>,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, total_pages } = lastPage.pagination;
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    ...(initialData ? { initialData } : {}),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => clientFetch<ApiResponse<Product>>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useRelatedProducts(id: number) {
  return useQuery({
    queryKey: ['related-products', id],
    queryFn: () =>
      clientFetch<ApiResponse<Product[]>>(`/products/${id}/related`, {
        params: { limit: 10 },
      }),
    enabled: !!id,
  });
}
