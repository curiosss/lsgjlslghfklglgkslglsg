import { serverFetch } from '@/lib/api/server';
import type { ApiResponse, Category } from '@/types';
import { CatalogClient } from './catalog-client';

export const metadata = { title: 'Catalog' };

export default async function CatalogPage() {
  let categories: Category[] = [];
  try {
    const res = await serverFetch<ApiResponse<Category[]>>('/categories');
    categories = res.data ?? [];
  } catch { /* silent */ }

  return <CatalogClient initialCategories={categories} />;
}
