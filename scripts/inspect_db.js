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

async function inspect() {
    const output = {};
    try {
        const client = await pool.connect();
        console.log("Connected to database.");

        // List all databases
        const dbs = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
        output.databases = dbs.rows.map(r => r.datname);
        console.log("Databases:", output.databases);

        // List ALL tables to be sure
        const res = await client.query(`
      SELECT schemaname, tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
    `);

        output.tables = [];
        if (res.rows.length === 0) {
            console.log("No tables found via pg_tables.");

            // Try to create the table if it doesn't exist? 
            // No, user said "available from". 
            // Let's try to query 'presets' blindly just in case metadata is hidden (unlikely but possible with weird perms)
            try {
                const blind = await client.query('SELECT count(*) FROM presets');
                console.log("Blind query on 'presets' succeeded!", blind.rows);
                output.tables.push({ name: 'presets', schema: 'public (inferred)' });
            } catch (e) {
                console.log("Blind query on 'presets' failed.");
            }

        } else {
            console.log("Tables found:", res.rows);
            for (const row of res.rows) {
                const tableName = row.tablename;
                const schemaName = row.schemaname;
                const tableInfo = { name: tableName, schema: schemaName };

                // Columns
                const columns = await client.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = $1 AND table_schema = $2
            `, [tableName, schemaName]);
                tableInfo.columns = columns.rows;

                // Sample data
                try {
                    const sample = await client.query(`SELECT * FROM "${schemaName}"."${tableName}" LIMIT 3`);
                    tableInfo.sample = sample.rows;
                } catch (e) {
                    console.log(`Could not sample ${tableName}: ${e.message}`);
                }

                output.tables.push(tableInfo);
            }
        }

        fs.writeFileSync('inspection.json', JSON.stringify(output, null, 2));
        console.log("Inspection complete. Results written to inspection.json");

        client.release();
    } catch (err) {
        console.error("Error inspecting database:", err);
    } finally {
        await pool.end();
    }
}

inspect();
