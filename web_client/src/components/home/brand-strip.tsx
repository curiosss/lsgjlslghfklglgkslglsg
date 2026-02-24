'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Brand } from '@/types';

interface BrandStripProps {
  brands: Brand[];
}

export function BrandStrip({ brands }: BrandStripProps) {
  return (
    <div className="flex gap-4 overflow-x-auto py-2 hide-scrollbar">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/products?brand_id=${brand.id}`}
          className="flex flex-shrink-0 flex-col items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
            {brand.logo_url ? (
              <Image src={brand.logo_url} alt={brand.name} width={40} height={40} className="object-contain" />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">{brand.name[0]}</span>
            )}
          </div>
          <span className="max-w-[60px] truncate text-[10px] font-medium text-muted-foreground">{brand.name}</span>
        </Link>
      ))}
    </div>
  );
}
