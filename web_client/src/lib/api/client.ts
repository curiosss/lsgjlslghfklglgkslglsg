import { useLocaleStore } from '@/store/locale';

export async function clientFetch<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string | number | boolean | undefined> },
): Promise<T> {
  const lang = useLocaleStore.getState().locale;
  const url = new URL(`/api/v1${path}`, window.location.origin);
  url.searchParams.set('lang', lang);

  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }

  const { params, ...fetchOptions } = options || {};
  void params;

  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
