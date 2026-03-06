import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

const signupSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
    email: z.string().email(),
    password: z.string().min(8),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = signupSchema.safeParse(body);

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NextResponse.json({ error: (result.error as any).errors[0].message }, { status: 400 });
        }

        const { username, email, password } = result.data;

        // Check if user exists
        const existingUser = await query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if ((existingUser.rows.length || 0) > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);
        const verificationToken = randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        // Create user with auto-verification
        const userResult = await query(
            `INSERT INTO users (username, email, password_hash, email_verified) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING id`,
            [username, email, hashedPassword]
        );

        // Email sending disabled for now
        /*
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}`;

        await transport.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Verify your Figranium account',
            html: `
        <h1>Welcome to Figranium!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
        });
        */

        return NextResponse.json({ message: 'User created successfully.' });
    } catch (error: unknown) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
