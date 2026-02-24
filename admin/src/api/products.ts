import { api } from './client';
import type { ApiResponse, Product, CreateProductRequest, UpdateProductRequest, ProductFilters } from '../types';

export const getProducts = (params?: ProductFilters) =>
  api.get<ApiResponse<Product[]>>('/products', { params });

export const getProduct = (id: number) =>
  api.get<ApiResponse<Product>>(`/products/${id}`);

export const createProduct = (data: CreateProductRequest) =>
  api.post<ApiResponse<Product>>('/products', data);

export const updateProduct = (id: number, data: UpdateProductRequest) =>
  api.put<ApiResponse<Product>>(`/products/${id}`, data);

export const deleteProduct = (id: number) =>
  api.delete<ApiResponse<void>>(`/products/${id}`);
