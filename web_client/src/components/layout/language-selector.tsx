'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLocaleStore } from '@/store/locale';
import { cn } from '@/lib/utils';

type Locale = 'ru' | 'tm' | 'en';

const LANGUAGES: { value: Locale; label: string; short: string }[] = [
  { value: 'tm', label: 'Türkmen', short: 'TM' },
  { value: 'ru', label: 'Русский', short: 'RU' },
  { value: 'en', label: 'English', short: 'EN' },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLocaleStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLang = LANGUAGES.find(l => l.value === locale as any) || LANGUAGES[1];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition-colors hover:bg-accent",
          isOpen && "bg-accent"
        )}
      >
        <Globe size={18} strokeWidth={1.5} />
        <span className="hidden leading-none md:block">{selectedLang.short}</span>
        <ChevronDown size={14} className={cn("hidden transition-transform md:block", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 origin-top-right rounded-xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur-md ring-1 ring-black/5 animate-in fade-in zoom-in-95">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                setLocale(lang.value as any);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                locale === lang.value ? "bg-accent/50 font-semibold" : ""
              )}
            >
              {lang.label}
              {locale === lang.value && <Check strokeWidth={2} size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
