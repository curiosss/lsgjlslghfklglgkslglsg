import { ru } from './ru';
import { tm } from './tm';
import { useLocaleStore } from '@/store/locale';

const translations: Record<string, Record<string, string>> = { ru, tm };

export function tr(key: string): string {
  const locale = useLocaleStore.getState().locale;
  return translations[locale]?.[key] ?? key;
}

export function useTr() {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string) => translations[locale]?.[key] ?? key;
}
