import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api/server';
import type { ApiResponse, Product } from '@/types';
import { ProductDetailClient } from './product-detail-client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const res = await serverFetch<ApiResponse<Product>>(`/products/${id}`);
    const p = res.data;
    if (!p) return { title: 'Product Not Found' };
    return {
      title: p.name,
      description: `${p.brand_name} - ${p.name}. ${p.price} m.`,
      openGraph: {
        title: p.name,
        description: `${p.brand_name} - ${p.name}`,
        images: p.image_url ? [{ url: p.image_url }] : [],
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  let product: Product | null = null;
  let related: Product[] = [];

  try {
    const [prodRes, relRes] = await Promise.all([
      serverFetch<ApiResponse<Product>>(`/products/${id}`),
      serverFetch<ApiResponse<Product[]>>(`/products/${id}/related`),
    ]);
    product = prodRes.data ?? null;
    related = relRes.data ?? [];
  } catch { /* silent */ }

  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.image_url,
            brand: { '@type': 'Brand', name: product.brand_name },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'TMT',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
