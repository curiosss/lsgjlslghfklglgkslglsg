import { api } from './client';
import type { ApiResponse, Admin, CreateAdminRequest, UpdateAdminRequest } from '../types';

export const getAdmins = () =>
  api.get<ApiResponse<Admin[]>>('/admins');

export const createAdmin = (data: CreateAdminRequest) =>
  api.post<ApiResponse<Admin>>('/admins', data);

export const updateAdmin = (id: number, data: UpdateAdminRequest) =>
  api.put<ApiResponse<Admin>>(`/admins/${id}`, data);

export const deleteAdmin = (id: number) =>
  api.delete<ApiResponse<void>>(`/admins/${id}`);
