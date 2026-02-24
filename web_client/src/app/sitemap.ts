import type { MetadataRoute } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/products?limit=1000&lang=ru`),
      fetch(`${BACKEND_URL}/api/v1/categories?lang=ru`),
    ]);

    if (productsRes.ok) {
      const { data: products } = await productsRes.json();
      for (const p of products || []) {
        entries.push({
          url: `${SITE_URL}/product/${p.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    if (categoriesRes.ok) {
      const { data: categories } = await categoriesRes.json();
      for (const c of categories || []) {
        entries.push({
          url: `${SITE_URL}/products?category_id=${c.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch { /* silent - return static entries only */ }

  return entries;
}
