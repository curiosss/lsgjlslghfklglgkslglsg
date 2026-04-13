import { api } from './client';
import type { ApiResponse } from '../types/api';
import type { POSUser, CreatePOSUserRequest, UpdatePOSUserRequest } from '../types/pos-user';

export const getPOSUsers = async (): Promise<ApiResponse<POSUser[]>> => {
  const { data } = await api.get('/pos-users');
  return data;
};

export const createPOSUser = async (req: CreatePOSUserRequest): Promise<ApiResponse<POSUser>> => {
  const { data } = await api.post('/pos-users', req);
  return data;
};

export const updatePOSUser = async (id: number, req: UpdatePOSUserRequest): Promise<ApiResponse<POSUser>> => {
  const { data } = await api.put(`/pos-users/${id}`, req);
  return data;
};

export const deletePOSUser = async (id: number): Promise<ApiResponse<void>> => {
  const { data } = await api.delete(`/pos-users/${id}`);
  return data;
};
