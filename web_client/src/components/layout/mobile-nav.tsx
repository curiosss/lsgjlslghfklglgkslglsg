'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, Heart, ClipboardList } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useTr } from '@/i18n';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const t = useTr();
  const pathname = usePathname();
  const totalCount = useCartStore((s) => s.totalCount());
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for localStorage state
  useEffect(() => setMounted(true), []);

  const tabs = [
    { href: '/', icon: Home, label: t('nav_home') },
    { href: '/catalog', icon: LayoutGrid, label: t('nav_catalog') },
    { href: '/cart', icon: ShoppingCart, label: t('nav_cart'), badge: mounted ? totalCount : 0 },
    { href: '/favorites', icon: Heart, label: t('nav_favorites') },
    { href: '/orders', icon: ClipboardList, label: t('order_history') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {tabs.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={1.5} />
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
