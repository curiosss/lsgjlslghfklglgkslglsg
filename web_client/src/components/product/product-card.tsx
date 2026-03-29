'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { useTr } from '@/i18n';
import { formatPrice } from '@/lib/format';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTr();
  const [imgError, setImgError] = useState(false);
  const { items, addToCart, updateQuantity } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const cartItem = items.find(i => i.product.id === product.id);
  const fav = isFavorite(product.id);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Discount badge */}
      {product.discount_percent && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-white">
          -{product.discount_percent}%
        </span>
      )}

      {/* Favorite button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
      >
        <Heart
          size={16}
          strokeWidth={1.5}
          className={fav ? 'fill-destructive text-destructive' : 'text-muted-foreground'}
        />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden bg-muted">
        {!imgError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/40">
            <ImageIcon className="mb-2 h-12 w-12" strokeWidth={1} />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand_name && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.brand_name}
          </span>
        )}
        <Link 
          href={`/product/${product.id}`} 
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight hover:underline"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* mt-auto pushes the price and cart button to the bottom */}
        <div className="mt-auto flex items-end justify-between pt-2">
           <div className="flex flex-col">
             {product.old_price && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.old_price)}</span>
             )}
             <span className="text-base font-bold">{formatPrice(product.price)}</span>
           </div>
        </div>

        {/* Cart action */}
        <div className="mt-2 h-9">
          {cartItem ? (
            <QuantitySelector
              compact
              quantity={cartItem.quantity}
              onDecrement={() => updateQuantity(product.id, cartItem.quantity - 1)}
              onIncrement={() => updateQuantity(product.id, cartItem.quantity + 1)}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart size={14} strokeWidth={1.5} />
              {t('add_to_cart')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
