import { hash, compare } from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';

let SECRET_KEY: Uint8Array | undefined;

function getSecretKey() {
    if (!SECRET_KEY) {
        const secret = process.env.JWT_SECRET || 'dev-secret-key-change-me';
        if (process.env.NODE_ENV === 'production' && secret === 'dev-secret-key-change-me') {
            throw new Error('FATAL: JWT_SECRET environment variable is not set in production. Security risk prevented.');
        }
        SECRET_KEY = new TextEncoder().encode(secret);
    }
    return SECRET_KEY;
}

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
        .sign(getSecretKey());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyToken(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload;
    } catch {
        return null;
    }
}
