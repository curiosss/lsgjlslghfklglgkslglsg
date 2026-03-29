'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Heart, ShoppingCart, Sun, Moon, Monitor, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCartStore } from '@/store/cart';
import { useTr } from '@/i18n';
import { SearchInput } from '@/components/ui/search-input';
import { LanguageSelector } from '@/components/layout/language-selector';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTr();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const totalCount = useCartStore((s) => s.totalCount());

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for localStorage state
  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const handleSearchSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  const themeIcon = !mounted ? <Sun size={20} strokeWidth={1.5} /> :
    theme === 'light' ? <Sun size={20} strokeWidth={1.5} /> :
    theme === 'dark' ? <Moon size={20} strokeWidth={1.5} /> :
    <Monitor size={20} strokeWidth={1.5} />;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 md:px-6">
        <Link href="/" className="text-xl font-black tracking-tight">COMMERCE</Link>

        {/* Desktop search */}
        <div className="hidden flex-1 md:block md:max-w-md">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder={t('search_hint')}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          {/* Mobile search trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors md:hidden"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          <button onClick={cycleTheme} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors">
            {themeIcon}
          </button>

          <LanguageSelector />

          {/* Desktop only nav */}
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/favorites" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {mounted && totalCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="flex gap-2 border-t border-border px-4 py-2 md:hidden">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder={t('search_hint')}
            autoFocus
            onKeyDown={handleSearchSubmit}
            className="flex-1"
          />
          <button onClick={() => setSearchOpen(false)} className="flex h-9 w-9 items-center justify-center">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="mx-auto hidden max-w-[1400px] gap-6 px-6 md:flex">
        <Link href="/" className={cn('border-b-2 pb-2 text-sm font-medium transition-colors', pathname === '/' ? 'border-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
          {t('nav_home')}
        </Link>
        <Link href="/catalog" className={cn('border-b-2 pb-2 text-sm font-medium transition-colors', pathname === '/catalog' ? 'border-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
          {t('nav_catalog')}
        </Link>
      </nav>
    </header>
  );
}
