import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local' });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL?.replace('?sslmode=require', ''),
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await pool.query(`
            ALTER TABLE presets ADD COLUMN IF NOT EXISTS expected_output TEXT;

            -- Performance: Add indexes for frequently sorted and filtered columns
            CREATE INDEX IF NOT EXISTS idx_presets_downloads ON presets(downloads DESC);
            CREATE INDEX IF NOT EXISTS idx_presets_created_at ON presets(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_presets_category ON presets(category);
        `);
        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await pool.end();
    }
}

migrate();
