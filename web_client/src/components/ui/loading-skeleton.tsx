import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'line' | 'circle' | 'banner';
  count?: number;
  className?: string;
}

const variantClasses = {
  card: 'aspect-square w-full rounded-xl',
  line: 'h-4 w-full rounded-md',
  circle: 'h-10 w-10 rounded-full',
  banner: 'h-[200px] w-full rounded-xl md:h-[400px]',
};

export function LoadingSkeleton({ variant = 'line', count = 1, className }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn(variantClasses[variant], className)} />
      ))}
    </>
  );
}
