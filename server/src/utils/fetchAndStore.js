import axios from "axios";
import pg from 'pg';
const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
});


async function fetchAndStoreData() {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const data = Object.values(response.data).slice(0, 10);

        const client = await pool.connect();
        try {
            await client.query('DELETE FROM tickers');

            const query = `
                INSERT INTO tickers (name, last, buy, sell, volume, base_unit)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            for (const item of data) {
                const { name, last, buy, sell, volume, base_unit } = item;
                await client.query(query, [name, parseFloat(last), parseFloat(buy), parseFloat(sell), parseFloat(volume), base_unit]);
            }
            console.log("Data stored successfully!");
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error fetching or storing data:", error);
    }
}

export {fetchAndStoreData}