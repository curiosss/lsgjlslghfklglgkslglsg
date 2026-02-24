import { api } from './client';
import type { ApiResponse, DeliveryZone, CreateDeliveryZoneRequest, UpdateDeliveryZoneRequest } from '../types';

export const getDeliveryZones = () =>
  api.get<ApiResponse<DeliveryZone[]>>('/delivery-zones');

export const createDeliveryZone = (data: CreateDeliveryZoneRequest) =>
  api.post<ApiResponse<DeliveryZone>>('/delivery-zones', data);

export const updateDeliveryZone = (id: number, data: UpdateDeliveryZoneRequest) =>
  api.put<ApiResponse<DeliveryZone>>(`/delivery-zones/${id}`, data);

export const deleteDeliveryZone = (id: number) =>
  api.delete<ApiResponse<void>>(`/delivery-zones/${id}`);
