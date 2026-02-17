import { hash, compare } from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-change-me');

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signToken(payload: any): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyToken(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}
