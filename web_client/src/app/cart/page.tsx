'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useTr } from '@/i18n';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const t = useTr();
  const { items, clearCart, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for localStorage state
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={48} strokeWidth={1} />}
        title={t('cart_empty_title')}
        subtitle={t('cart_empty_subtitle')}
        action={<Link href="/"><Button>{t('go_home')}</Button></Link>}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('cart_title')}</h1>
        <button
          onClick={() => { if (confirm(t('clear_cart_confirm'))) clearCart(); }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={14} strokeWidth={1.5} />
          {t('clear_cart')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>
        <CartSummary
          subtotal={totalPrice()}
          actionLabel={t('checkout')}
          onAction={() => window.location.href = '/checkout'}
        />
      </div>
    </div>
  );
}
