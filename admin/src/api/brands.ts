import { api } from './client';
import type { ApiResponse, Brand, CreateBrandRequest, UpdateBrandRequest } from '../types';

export const getBrands = () =>
  api.get<ApiResponse<Brand[]>>('/brands');

export const createBrand = (data: CreateBrandRequest) =>
  api.post<ApiResponse<Brand>>('/brands', data);

export const updateBrand = (id: number, data: UpdateBrandRequest) =>
  api.put<ApiResponse<Brand>>(`/brands/${id}`, data);

export const deleteBrand = (id: number) =>
  api.delete<ApiResponse<void>>(`/brands/${id}`);
