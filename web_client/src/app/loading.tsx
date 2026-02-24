import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <LoadingSkeleton variant="line" count={5} className="h-9 w-24 rounded-full" />
      </div>
      <LoadingSkeleton variant="banner" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <LoadingSkeleton variant="card" count={8} />
      </div>
    </div>
  );
}
