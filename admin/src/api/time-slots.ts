import { api } from './client';
import type { ApiResponse, TimeSlot, CreateTimeSlotRequest, UpdateTimeSlotRequest } from '../types';

export const getTimeSlots = () =>
  api.get<ApiResponse<TimeSlot[]>>('/time-slots');

export const createTimeSlot = (data: CreateTimeSlotRequest) =>
  api.post<ApiResponse<TimeSlot>>('/time-slots', data);

export const updateTimeSlot = (id: number, data: UpdateTimeSlotRequest) =>
  api.put<ApiResponse<TimeSlot>>(`/time-slots/${id}`, data);

export const deleteTimeSlot = (id: number) =>
  api.delete<ApiResponse<void>>(`/time-slots/${id}`);
