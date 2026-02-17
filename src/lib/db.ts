import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.replace('?sslmode=require', ''),
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = (text: string, params?: any[]) => pool.query(text, params);
