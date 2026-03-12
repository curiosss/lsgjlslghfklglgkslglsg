import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'ru' | 'tm' | 'en';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ru',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'admin-locale' },
  ),
);
