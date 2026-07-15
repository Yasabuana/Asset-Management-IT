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

// Endpoint GET assets
app.get('/api/assets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assets'); 
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint GET users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users'); 
        res.json(result.rows); 
    } catch (err) {
        console.error("Error GET users:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint GET transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions'); 
        res.json(result.rows); 
    } catch (err) {
        console.error("Error GET transactions:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint GET inventory_history 
app.get('/api/inventory_history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory_history'); 
        res.json(result.rows); 
    } catch (err) {
        console.error("Error GET history:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint POST assets
app.post('/api/assets', async (req, res) => {
    try {
        const { id, nama, serial_number, brand, kategori, kondisi, quantity, lokasi,
            keterangan, gambar_url, created_at
         } = req.body;

        const newAsset = await pool.query(
            'INSERT INTO assets ( id, nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url, created_at ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [ id, nama, serial_number, brand, kategori, kondisi, quantity, lokasi,
            keterangan, gambar_url, created_at]
        );

        res.json(newAsset.rows[0]);
    } catch (err) {
        console.error("Error POST assets",err.message);
        res.status(500).send('Server Error');
    }
});
// Endpoint POST users
app.post('/api/users', async (req, res) => {
    try {
        const { id, nama, role
         } = req.body;

        const newUser = await pool.query(
            'INSERT INTO users ( id, nama, role ) VALUES ($1, $2, $3) RETURNING *',
            [ id, nama, role]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error("Error POST users",err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint POST transactions
app.post('/api/transactions', async (req, res) => {
    try {
        const { id, asset_id, tipe_request, jumlah, status, 
            tanggal_request, tanggal_approval, keterangan
         } = req.body;

        const newTransaction = await pool.query(
            'INSERT INTO transactions (id, asset_id, tipe_request, jumlah, status,tanggal_request, tanggal_approval, keterangan) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [ id, asset_id, tipe_request, jumlah, status, 
            tanggal_request, tanggal_approval, keterangan]
        );

        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error("Error POST transactions",err.message);
        res.status(500).send('Server Error');
    }
});
// Endpoint POST inventory_history
app.post('/api/inventory_history', async (req, res) => {
    try {
        const { id, asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id, created_at
         } = req.body;

        const newInventory_history = await pool.query(
            'INSERT INTO assets (id, asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id, created_at} = req.body;) VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING *',
            [ id, asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id, created_at]
        );

        res.json(newInventory_history.rows[0]);
    } catch (err) {
        console.error("Error POST inventory_history",err.message);
        res.status(500).send('Server Error');
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend API sudah menyala di http://localhost:${PORT}`);
});