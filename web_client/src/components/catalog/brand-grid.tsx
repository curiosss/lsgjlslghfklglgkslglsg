'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Brand } from '@/types';

interface BrandGridProps {
  brands: Brand[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/products?brand_id=${brand.id}`}
          className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-shadow hover:shadow-md"
        >
          <div className="relative flex h-12 w-12 items-center justify-center">
            {brand.logo_url ? (
              <Image src={brand.logo_url} alt={brand.name} width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-xl font-bold text-muted-foreground">{brand.name[0]}</span>
            )}
          </div>
          <span className="text-center text-xs font-medium">{brand.name}</span>
        </Link>
      ))}
    </div>
  );
}
