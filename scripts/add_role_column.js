const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('?sslmode=require', '') : '';

if (!connectionString) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        const client = await pool.connect();
        console.log("Connected to database.");

        console.log("Adding role column to users table...");
        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
    `);

        // Optionally set the first user as admin for convenience?
        // Let's just log that user needs to set it manually or we can set specific email.

        console.log("Migration complete.");
        client.release();
    } catch (err) {
        console.error("Error running migration:", err);
    } finally {
        await pool.end();
    }
}

migrate();
