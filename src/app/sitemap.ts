import { query } from '@/lib/db';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://templates.doppelgangerdev.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/auth/signin`,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/auth/signup`,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Dynamic preset pages
    try {
        const { rows } = await query('SELECT id, updated_at FROM presets ORDER BY updated_at DESC');
        const presetPages: MetadataRoute.Sitemap = rows.map((row: any) => ({
            url: `${BASE_URL}/presets/${row.id}`,
            lastModified: row.updated_at || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...staticPages, ...presetPages];
    } catch {
        return staticPages;
    }
}
