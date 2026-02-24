import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, HomeData } from '@/types';

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: () => clientFetch<ApiResponse<HomeData>>('/home'),
  });
}
