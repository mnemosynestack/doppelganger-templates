import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await query('UPDATE presets SET downloads = COALESCE(downloads, 0) + 1 WHERE id = $1', [id]);
        return NextResponse.json({ message: 'Download counted' });
    } catch (error) {
        console.error('Download count error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
