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
        if (!payload || !process.env.ADMIN_USERNAME || payload.username !== process.env.ADMIN_USERNAME) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all presets, including author details directly from users table using JOIN
        const { rows } = await query(`
            SELECT p.id, p.user_id, p.title, p.description, p.author_name, p.type, p.category, p.icon, p.time_estimate, p.target_url, p.downloads, p.created_at, p.updated_at, u.username as author_username
            FROM presets p
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Fetch all presets error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
