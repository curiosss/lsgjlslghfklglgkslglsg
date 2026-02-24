import { serverFetch } from '@/lib/api/server';
import type { ApiResponse, HomeData } from '@/types';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { BrandStrip } from '@/components/home/brand-strip';
import { CategoryChips } from '@/components/home/category-chips';
import { ProductSection } from '@/components/home/product-section';

export default async function HomePage() {
  let data: HomeData | null = null;
  try {
    const response = await serverFetch<ApiResponse<HomeData>>('/home');
    data = response.data ?? null;
  } catch {
    /* silent */
  }

  if (!data) {
    return <div className="py-20 text-center text-muted-foreground">Failed to load</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {data.categories.length > 0 && <CategoryChips categories={data.categories} />}
      {data.banners.length > 0 && <BannerCarousel banners={data.banners} />}
      {data.brands.length > 0 && <BrandStrip brands={data.brands} />}
      {data.new_products.length > 0 && (
        <ProductSection titleKey="new_arrivals" products={data.new_products} linkTo="/products?is_new=true" />
      )}
      {data.discount_products.length > 0 && (
        <ProductSection titleKey="discounts" products={data.discount_products} linkTo="/products?is_discount=true" />
      )}
    </div>
  );
}
