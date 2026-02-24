'use client';

import Link from 'next/link';
import { Chip } from '@/components/ui/chip';
import type { Category } from '@/types';

interface CategoryChipsProps {
  categories: Category[];
}

export function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/products?category_id=${cat.id}`}>
          <Chip>{cat.name}</Chip>
        </Link>
      ))}
    </div>
  );
}
