import { api } from './client';
import type { ApiResponse } from '../types';

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<ApiResponse<{ url: string }>>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteFile = (url: string) =>
  api.delete<ApiResponse<void>>('/upload', { data: { url } });
