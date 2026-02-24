import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <EmptyState
      icon={<FileQuestion size={64} strokeWidth={1} />}
      title="404"
      subtitle="Page not found"
      action={
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      }
    />
  );
}
