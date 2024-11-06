import pg from 'pg';
const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
});

async function createTable() {
    const client = await pool.connect();
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tickers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                last NUMERIC NOT NULL,
                buy NUMERIC NOT NULL,
                sell NUMERIC NOT NULL,
                volume NUMERIC NOT NULL,
                base_unit VARCHAR(10) NOT NULL
            );
        `;
        await client.query(createTableQuery);
        console.log("Table 'tickers' created successfully!");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        client.release();
    }
}

export { createTable }