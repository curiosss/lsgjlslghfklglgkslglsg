import { api } from './client';
import type { ApiResponse, Order, OrderWithItems, OrderFilters, OrderStatus } from '../types';

export const getOrders = (params?: OrderFilters) =>
  api.get<ApiResponse<Order[]>>('/orders', { params });

export const getOrder = (id: number) =>
  api.get<ApiResponse<OrderWithItems>>(`/orders/${id}`);

export const updateOrderStatus = (id: number, status: OrderStatus) =>
  api.put<ApiResponse<void>>(`/orders/${id}/status`, { status });
