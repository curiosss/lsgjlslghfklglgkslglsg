import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, Category } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => clientFetch<ApiResponse<Category[]>>('/categories'),
    staleTime: 5 * 60 * 1000,
  });
}
