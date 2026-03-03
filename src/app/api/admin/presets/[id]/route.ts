import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || !process.env.ADMIN_USERNAME || payload.username !== process.env.ADMIN_USERNAME) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const result = await query('DELETE FROM presets WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Preset deleted successfully' });
    } catch (error) {
        console.error('Delete preset error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
