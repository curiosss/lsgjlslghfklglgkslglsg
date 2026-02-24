'use client';

import { useTr } from '@/i18n';

export function Footer() {
  const t = useTr();

  return (
    <footer className="hidden border-t border-border md:block">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 text-sm text-muted-foreground">
        <span>{t('footer_hours')}</span>
        <span>Commerce &copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
