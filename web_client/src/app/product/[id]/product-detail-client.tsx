'use client';

import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { useTr } from '@/i18n';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { ProductImageViewer } from '@/components/product/product-image-viewer';
import { ProductSection } from '@/components/home/product-section';
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const t = useTr();
  const router = useRouter();
  const { items, addToCart, updateQuantity } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const cartItem = items.find(i => i.product.id === product.id);
  const fav = isFavorite(product.id);

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} strokeWidth={1.5} /> {t('back')}
      </button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductImageViewer mainImage={product.image_url} images={product.images} />

        <div className="flex flex-col gap-3">
          {product.brand_name && (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.brand_name}</span>
          )}
          <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.old_price && (
              <span className="text-base text-muted-foreground line-through">{formatPrice(product.old_price)}</span>
            )}
            {product.discount_percent && (
              <span className="text-sm font-semibold text-destructive">-{product.discount_percent}%</span>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            {cartItem ? (
              <QuantitySelector
                quantity={cartItem.quantity}
                onDecrement={() => updateQuantity(product.id, cartItem.quantity - 1)}
                onIncrement={() => updateQuantity(product.id, cartItem.quantity + 1)}
              />
            ) : (
              <Button size="lg" onClick={() => addToCart(product)}>{t('add_to_cart')}</Button>
            )}
            <button
              onClick={() => toggleFavorite(product)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border transition-colors hover:bg-accent"
            >
              <Heart
                size={22}
                strokeWidth={1.5}
                className={fav ? 'fill-destructive text-destructive' : 'text-muted-foreground'}
              />
            </button>
          </div>

          {(product.barcode || product.brand_name) && (
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              {product.barcode && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('barcode')}</span>
                  <span>{product.barcode}</span>
                </div>
              )}
              {product.brand_name && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('brand')}</span>
                  <Link href={`/products?brand_id=${product.brand_id}`} className="font-medium text-primary hover:underline">
                    {product.brand_name}
                  </Link>
                </div>
              )}
            </div>
          )}

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <ProductSection titleKey="other_products" products={related} linkTo={`/products?category_id=${product.category_id}`} />
        </div>
      )}
    </div>
  );
}
