import { useQuery, useMutation } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, Order, OrderWithItems, CreateOrderRequest } from '@/types';

export function useOrdersByPhone(phone: string) {
  return useQuery({
    queryKey: ['orders', phone],
    queryFn: () =>
      clientFetch<ApiResponse<Order[]>>('/orders', {
        params: { phone },
      }),
    enabled: !!phone.trim(),
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) =>
      clientFetch<ApiResponse<OrderWithItems>>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}
