'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-border">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center gap-3 py-3">
            {cat.image_url && (
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="40px" />
              </div>
            )}
            <Link
              href={`/products?category_id=${cat.id}`}
              className="flex-1 text-sm font-medium hover:underline"
            >
              {cat.name}
            </Link>
            {cat.has_subcategories && cat.subcategories && cat.subcategories.length > 0 && (
              <button
                onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent transition-colors"
              >
                <ChevronDown
                  size={18}
                  strokeWidth={1.5}
                  className={cn('transition-transform', expanded === cat.id && 'rotate-180')}
                />
              </button>
            )}
          </div>

          {expanded === cat.id && cat.subcategories && (
            <div className="flex flex-col gap-1 pb-3 pl-[52px]">
              {cat.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/products?subcategory_id=${sub.id}`}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
