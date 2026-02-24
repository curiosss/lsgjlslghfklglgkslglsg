'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/format';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 rounded-xl border border-border p-3">
      <Link href={`/product/${product.id}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={product.image_url || '/placeholder.svg'} alt={product.name} fill className="object-contain p-1" sizes="80px" />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        {product.brand_name && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{product.brand_name}</span>
        )}
        <Link href={`/product/${product.id}`} className="text-sm font-medium leading-tight hover:underline line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-1">
          <QuantitySelector
            compact
            quantity={quantity}
            onDecrement={() => updateQuantity(product.id, quantity - 1)}
            onIncrement={() => updateQuantity(product.id, quantity + 1)}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">{formatPrice(product.price * quantity)}</span>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
