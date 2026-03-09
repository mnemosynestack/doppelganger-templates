import { NextResponse } from 'next/server';
import { verifyPassword, signToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { email, password } = result.data;

        const userResult = await query('SELECT id, username, password_hash, email_verified FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.email_verified) {
            return NextResponse.json({ error: 'Please verify your email first' }, { status: 403 });
        }

        const token = await signToken({ sub: user.id, username: user.username });

        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
