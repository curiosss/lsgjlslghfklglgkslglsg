'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'ru' | 'tm';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

function syncCookie(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
  }
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'ru',
      setLocale: (locale) => {
        syncCookie(locale);
        set({ locale });
      },
      toggleLocale: () => {
        const next = get().locale === 'ru' ? 'tm' : 'ru';
        get().setLocale(next);
      },
    }),
    {
      name: 'locale-storage',
      onRehydrateStorage: () => (state) => {
        if (state) syncCookie(state.locale);
      },
    }
  )
);
