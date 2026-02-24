import { serverFetch } from '@/lib/api/server';
import type { ApiResponse, Product, Pagination } from '@/types';
import { ProductListClient } from './product-list-client';

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProductListPage({ searchParams }: Props) {
  const params = await searchParams;
  let products: Product[] = [];
  let pagination: Pagination | undefined;

  try {
    const res = await serverFetch<ApiResponse<Product[]>>('/products', {
      category_id: params.category_id,
      subcategory_id: params.subcategory_id,
      brand_id: params.brand_id,
      is_new: params.is_new,
      is_discount: params.is_discount,
      sort: params.sort,
      page: '1',
      limit: '20',
    });
    products = res.data ?? [];
    pagination = res.pagination;
  } catch { /* silent */ }

  return (
    <ProductListClient
      initialProducts={products}
      initialPagination={pagination}
      filters={params}
    />
  );
}
