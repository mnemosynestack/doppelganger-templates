import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
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

        // Optimization: explicitly select metadata columns to avoid fetching massive 'configuration' and 'expected_output' JSON blobs (up to 100kb+ each) for list views.
        // This dramatically reduces database memory overhead and network payload size.
        const { rows } = await query(
            'SELECT id, title, description, type, icon, downloads, time_estimate, category, target_url, created_at, updated_at FROM presets WHERE user_id = $1 ORDER BY created_at DESC',
            [payload.sub]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Fetch my presets error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
