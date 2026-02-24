import { api } from './client';
import type { ApiResponse, Banner, CreateBannerRequest, UpdateBannerRequest } from '../types';

export const getBanners = () =>
  api.get<ApiResponse<Banner[]>>('/banners');

export const createBanner = (data: CreateBannerRequest) =>
  api.post<ApiResponse<Banner>>('/banners', data);

export const updateBanner = (id: number, data: UpdateBannerRequest) =>
  api.put<ApiResponse<Banner>>(`/banners/${id}`, data);

export const deleteBanner = (id: number) =>
  api.delete<ApiResponse<void>>(`/banners/${id}`);
