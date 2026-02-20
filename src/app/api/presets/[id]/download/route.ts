import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded || !decoded.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = decoded.sub;

        // Try to insert a new download record
        const insertResult = await query(
            `INSERT INTO preset_downloads (preset_id, user_id) 
             VALUES ($1, $2) 
             ON CONFLICT DO NOTHING RETURNING *`,
            [id, userId]
        );

        // If a row was inserted, it's a new unique download, increment the count
        if (insertResult.rows.length > 0) {
            await query('UPDATE presets SET downloads = COALESCE(downloads, 0) + 1 WHERE id = $1', [id]);
        }

        return NextResponse.json({ message: 'Download tracked' });
    } catch (error) {
        console.error('Download count error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
