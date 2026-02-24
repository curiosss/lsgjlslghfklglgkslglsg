'use client';

import { useState } from 'react';
import { useTr } from '@/i18n';
import { useBrands } from '@/hooks/queries/use-brands';
import { useDebounce } from '@/hooks/use-debounce';
import { Chip } from '@/components/ui/chip';
import { SearchInput } from '@/components/ui/search-input';
import { CategoryList } from '@/components/catalog/category-list';
import { BrandGrid } from '@/components/catalog/brand-grid';
import type { Category } from '@/types';

interface CatalogClientProps {
  initialCategories: Category[];
}

export function CatalogClient({ initialCategories }: CatalogClientProps) {
  const t = useTr();
  const [tab, setTab] = useState<'categories' | 'brands'>('categories');
  const [brandSearch, setBrandSearch] = useState('');
  const debouncedSearch = useDebounce(brandSearch, 300);
  const { data: brandsResp } = useBrands(tab === 'brands' ? debouncedSearch || undefined : undefined);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Chip active={tab === 'categories'} onClick={() => setTab('categories')}>{t('categories')}</Chip>
        <Chip active={tab === 'brands'} onClick={() => setTab('brands')}>{t('brands')}</Chip>
      </div>

      {tab === 'categories' ? (
        <CategoryList categories={initialCategories} />
      ) : (
        <div className="flex flex-col gap-4">
          <SearchInput
            value={brandSearch}
            onChange={setBrandSearch}
            placeholder={t('search_brand')}
          />
          <BrandGrid brands={brandsResp?.data ?? []} />
        </div>
      )}
    </div>
  );
}
