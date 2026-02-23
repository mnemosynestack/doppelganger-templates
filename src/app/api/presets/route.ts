import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sanitizeUrl } from '@/lib/utils';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

const createPresetSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    type: z.enum(['AGENT', 'SCRAPE']),
    category: z.enum(['QA Testing', 'Lead Gen', 'Social Media', 'Shopping', 'Monitoring', 'AI', 'Jobs', 'News', 'Videos', 'Reviews', 'Developer Tools', 'SEO', 'Real Estate', 'Travel', 'Other']),
    icon: z.string(),
    time_estimate: z.string(),
    configuration: z.string().refine((val) => {
        try {
            const json = JSON.parse(val);
            return json.mode === 'agent' || json.mode === 'scrape';
        } catch {
            return false;
        }
    }, "Invalid JSON configuration"),
    expected_output: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const { rows } = await query('SELECT * FROM presets ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Fetch presets error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const result = createPresetSchema.safeParse(body);

        if (!result.success) {
            console.error('Validation error:', result.error);
            const errorMessage = result.error.issues?.[0]?.message || "Invalid request data";
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        const { title, description, type, category, icon, time_estimate, configuration, expected_output } = result.data;

        // Extract URL from configuration
        let targetUrl = "";
        try {
            const config = JSON.parse(configuration);
            targetUrl = sanitizeUrl(config.url) || "";
        } catch {
            // Should be caught by Zod refine, but safe fallback
        }

        await query(
            `INSERT INTO presets (user_id, title, description, author_name, type, category, icon, time_estimate, configuration, target_url, expected_output)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [payload.sub, title, description, payload.username, type, category, icon, time_estimate, configuration, targetUrl, expected_output]
        );

        revalidateTag('preset-counts', { expire: 0 });

        return NextResponse.json({ message: 'Preset created' });
    } catch (error: unknown) {
        console.error('Create preset error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
