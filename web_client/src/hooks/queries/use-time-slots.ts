import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client';
import type { ApiResponse, TimeSlot } from '@/types';

export function useTimeSlots() {
  return useQuery({
    queryKey: ['time-slots'],
    queryFn: () => clientFetch<ApiResponse<TimeSlot[]>>('/time-slots'),
    staleTime: 5 * 60 * 1000,
  });
}
