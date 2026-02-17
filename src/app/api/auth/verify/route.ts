import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    try {
        const result = await query(
            `UPDATE users 
       SET email_verified = NOW(), verification_token = NULL 
       WHERE verification_token = $1 
       RETURNING id, email`,
            [token]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Redirect to login page with success message
        return NextResponse.redirect(new URL('/auth/signin?verified=true', req.url));
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
