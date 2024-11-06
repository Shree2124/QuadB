import dotenv from "dotenv"
import express from "express"
import { createTable } from "./src/utils/createTable.js";
import { fetchAndStoreData } from "./src/utils/fetchAndStore.js";
import cors from "cors"

dotenv.config({
    path: './.env'
})


import pg from 'pg';
const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
});


console.log(pool);


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: ["http://127.0.0.1:5500","https://shree2124.github.io/QuadB/"],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}))

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://quad-b-pi.vercel.app/");
    next();
});

app.get('/api/tickers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tickers');
        res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/",(req, res)=>{
    res.send("hello")
})

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await createTable()
    await fetchAndStoreData();
});