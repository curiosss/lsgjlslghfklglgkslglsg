import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  loading: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        callback();
      }
    },
    [callback, hasMore, loading],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '200px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver]);

  return sentinelRef;
}
