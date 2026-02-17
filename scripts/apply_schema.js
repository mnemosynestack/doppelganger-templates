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

async function applySchema() {
    try {
        const client = await pool.connect();
        console.log("Connected to database.");

        const schemaPath = path.resolve(__dirname, '../db/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Applying schema...");
        await client.query(schemaSql);
        console.log("Schema applied successfully.");

        client.release();
    } catch (err) {
        console.error("Error applying schema:", err);
    } finally {
        await pool.end();
    }
}

applySchema();
