import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, DeliveryZone } from '@/types';

export function useDeliveryZones() {
  return useQuery({
    queryKey: ['delivery-zones'],
    queryFn: () => clientFetch<ApiResponse<DeliveryZone[]>>('/delivery-zones'),
    staleTime: 5 * 60 * 1000,
  });
}
