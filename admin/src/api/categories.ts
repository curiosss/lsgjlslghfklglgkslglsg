import { api } from './client';
import type {
  ApiResponse,
  Category,
  SubCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
} from '../types';

export const getCategories = () =>
  api.get<ApiResponse<Category[]>>('/categories');

export const createCategory = (data: CreateCategoryRequest) =>
  api.post<ApiResponse<Category>>('/categories', data);

export const updateCategory = (id: number, data: UpdateCategoryRequest) =>
  api.put<ApiResponse<Category>>(`/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  api.delete<ApiResponse<void>>(`/categories/${id}`);

export const createSubCategory = (data: CreateSubCategoryRequest) =>
  api.post<ApiResponse<SubCategory>>('/subcategories', data);

export const updateSubCategory = (id: number, data: UpdateSubCategoryRequest) =>
  api.put<ApiResponse<SubCategory>>(`/subcategories/${id}`, data);

export const deleteSubCategory = (id: number) =>
  api.delete<ApiResponse<void>>(`/subcategories/${id}`);
