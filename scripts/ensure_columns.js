const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client({
    connectionString: process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=no-verify',
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database...');

        // Add configuration column
        await client.query(`
            ALTER TABLE presets 
            ADD COLUMN IF NOT EXISTS configuration JSONB;
        `);
        console.log('Added configuration column (if not exists)');

        // Add target_url column
        await client.query(`
            ALTER TABLE presets 
            ADD COLUMN IF NOT EXISTS target_url TEXT;
        `);
        console.log('Added target_url column (if not exists)');

        // Add category column
        await client.query(`
             ALTER TABLE presets 
             ADD COLUMN IF NOT EXISTS category TEXT;
         `);
        console.log('Added category column (if not exists)');

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await client.end();
    }
}

migrate();
