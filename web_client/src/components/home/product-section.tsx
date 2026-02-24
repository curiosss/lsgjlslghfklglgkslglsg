'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTr } from '@/i18n';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types';

interface ProductSectionProps {
  titleKey: string;
  products: Product[];
  linkTo: string;
}

export function ProductSection({ titleKey, products, linkTo }: ProductSectionProps) {
  const t = useTr();

  if (products.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t(titleKey)}</h2>
        <Link href={linkTo} className="flex items-center gap-0.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          {t('see_all')}
          <ChevronRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="w-[160px] flex-shrink-0 md:w-[200px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
