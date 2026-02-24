'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageViewerProps {
  mainImage?: string;
  images?: string[];
}

export function ProductImageViewer({ mainImage, images }: ProductImageViewerProps) {
  const allImages = [...(mainImage ? [mainImage] : []), ...(images || [])].filter(Boolean);
  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
        <span className="text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={allImages[selected]}
          alt="Product"
          fill
          className="object-contain p-4"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                idx === selected ? 'border-primary' : 'border-transparent hover:border-border',
              )}
            >
              <Image src={img} alt="" fill className="object-contain p-1" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
