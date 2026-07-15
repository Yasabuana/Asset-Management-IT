const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path'); 

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: 'localhost',
    port: 5433, 
    database: 'db_manajemen_aset',
    user: 'postgres',
    password: process.env.DB_PASS
});

// Endpoint
app.get('/api/assets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assets'); 
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend API sudah menyala di http://localhost:${PORT}`);
});