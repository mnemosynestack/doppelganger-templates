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

        const { rows } = await query(
            'SELECT id, user_id, title, description, author_name, type, category, icon, time_estimate, target_url, downloads, created_at, updated_at FROM presets WHERE user_id = $1 ORDER BY created_at DESC',
            [payload.sub]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Fetch my presets error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
