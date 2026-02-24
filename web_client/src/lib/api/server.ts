import { headers } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function serverFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const headersList = await headers();
  const lang = headersList.get('x-locale') || 'ru';

  const url = new URL(`${BACKEND_URL}/api/v1${path}`);
  url.searchParams.set('lang', lang);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
