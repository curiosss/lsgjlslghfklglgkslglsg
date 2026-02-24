'use client';

import { AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <EmptyState
      icon={<AlertTriangle size={64} strokeWidth={1} />}
      title="Something went wrong"
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
