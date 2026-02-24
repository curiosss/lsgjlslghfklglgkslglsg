'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useTr } from '@/i18n';
import { formatPrice } from '@/lib/format';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee?: number;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}

export function CartSummary({ subtotal, deliveryFee = 0, actionLabel, onAction, disabled }: CartSummaryProps) {
  const t = useTr();
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-xl border border-border bg-card p-5 md:sticky md:top-20">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('cart_subtotal')}</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('delivery_fee')}</span>
            <span className="font-medium">{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-base font-bold">
          <span>{t('order_total')}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button className="mt-2 w-full" size="lg" onClick={onAction} disabled={disabled}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
