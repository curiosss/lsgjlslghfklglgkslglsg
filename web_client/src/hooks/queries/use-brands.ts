import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, Brand } from '@/types';

export function useBrands(search?: string) {
  return useQuery({
    queryKey: ['brands', search],
    queryFn: () =>
      clientFetch<ApiResponse<Brand[]>>('/brands', {
        params: search ? { search } : {},
      }),
  });
}
