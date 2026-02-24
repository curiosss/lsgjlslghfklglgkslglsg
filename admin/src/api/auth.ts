import { api } from './client';
import type { ApiResponse, LoginRequest, LoginResponse, Admin } from '../types';

export const login = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', data);

export const refresh = (refresh_token: string) =>
  api.post<ApiResponse<LoginResponse>>('/auth/refresh', { refresh_token });

export const getMe = () =>
  api.get<ApiResponse<Admin>>('/auth/me');
