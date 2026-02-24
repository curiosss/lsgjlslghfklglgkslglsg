'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
}

export function QuantitySelector({ quantity, onIncrement, onDecrement, compact = false }: QuantitySelectorProps) {
  return (
    <div className={cn(
      'inline-flex items-center rounded-xl border border-border',
      compact ? 'h-8 gap-1' : 'h-10 gap-2',
    )}>
      <button
        onClick={onDecrement}
        className={cn(
          'flex items-center justify-center rounded-l-xl transition-colors hover:bg-accent',
          compact ? 'h-8 w-8' : 'h-10 w-10',
        )}
      >
        <Minus size={compact ? 14 : 16} strokeWidth={1.5} />
      </button>
      <span className={cn('min-w-[24px] text-center font-semibold', compact ? 'text-xs' : 'text-sm')}>
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className={cn(
          'flex items-center justify-center rounded-r-xl transition-colors hover:bg-accent',
          compact ? 'h-8 w-8' : 'h-10 w-10',
        )}
      >
        <Plus size={compact ? 14 : 16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
