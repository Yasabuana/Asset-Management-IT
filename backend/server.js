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
            'INSERT INTO inventory_history (id, asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [ id, asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id, created_at ]
        );

        res.json(newInventory_history.rows[0]);
    } catch (err) {
        console.error("Error POST inventory_history",err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint PUT assets
app.put('/api/assets/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        
        const { nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url } = req.body;

        const updateAsset = await pool.query(
            `UPDATE assets 
             SET nama = $1, serial_number = $2, brand = $3, kategori = $4, kondisi = $5, quantity = $6, lokasi = $7, keterangan = $8, gambar_url = $9 
             WHERE id = $10 
             RETURNING *`,
            [nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url, id]
        );

        if (updateAsset.rows.length === 0) {
            return res.status(404).json({ message: "Aset tidak ditemukan!" });
        }

        res.json(updateAsset.rows[0]);
    } catch (err) {
        console.error("Error PUT assets:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint PUT users
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { nama, role } = req.body;

        const updateUser = await pool.query(
            `UPDATE users 
             SET nama = $1, role = $2
             WHERE id = $3
             RETURNING *`,
            [nama, role, id]
        );

        if (updateUser.rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        res.json(updateUser.rows[0]);
    } catch (err) {
        console.error("Error PUT users:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint PUT transactions
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { asset_id, tipe_request, jumlah, status, 
            tanggal_request, tanggal_approval, keterangan } = req.body;

        const updateTransaction = await pool.query(
            `UPDATE transactions 
             SET asset_id = $1, tipe_request = $2, jumlah = $3, status = $4, tanggal_request = $5,
             tanggal_approval = $6, keterangan = $7
             WHERE id = $8
             RETURNING *`,
            [ asset_id, tipe_request, jumlah, status, 
            tanggal_request, tanggal_approval, keterangan, id]
        );

        if (updateTransaction.rows.length === 0) {
            return res.status(404).json({ message: "Transaction tidak ditemukan!" });
        }

        res.json(updateTransaction.rows[0]);
    } catch (err) {
        console.error("Error PUT Transactions:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint PUT inventory_history
app.put('/api/inventory_history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { asset_id, tipe_transaksi, jumlah_perubahan, alasan, 
            admin_id, created_at } = req.body;

        const updateInventoryHistory = await pool.query(
            `UPDATE inventory_history
             SET asset_id = $1, tipe_transaksi = $2, jumlah_perubahan = $3, alasan = $4, 
             admin_id = $5, created_at = $6
             WHERE id = $7
             RETURNING *`,
            [asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id, created_at, id]
        );

        if (updateInventoryHistory.rows.length === 0) {
            return res.status(404).json({ message: "Inventory History tidak ditemukan!" });
        }

        res.json(updateInventoryHistory.rows[0]);
    } catch (err) {
        console.error("Error PUT Inventory History:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint DELETE assets
app.delete('/api/assets/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteAsset = await pool.query(
            'DELETE FROM assets WHERE id = $1 RETURNING *', 
            [id]
        );

        if (deleteAsset.rows.length === 0) {
            return res.status(404).json({ message: "Aset tidak ditemukan!" });
        }

        res.json({ message: "Aset berhasil dihapus dari database!" });
    } catch (err) {
        console.error("Error DELETE assets:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint DELETE users
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        const deleteUser = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *', 
            [id]
        );

        if (deleteUser.rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        res.json({ message: "User berhasil dihapus dari database!" });
    } catch (err) {
        console.error("Error DELETE users:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint DELETE transactions
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTransaction = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *', 
            [id]
        );

        if (deleteTransaction.rows.length === 0) {
            return res.status(404).json({ message: "Transaction tidak ditemukan!" });
        }

        res.json({ message: "Transaction berhasil dihapus dari database!" });
    } catch (err) {
        console.error("Error DELETE transactions:", err.message);
        res.status(500).send('Server Error');
    }
});

// Endpoint DELETE inventory_history
app.delete('/api/inventory_history/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        const deleteInventoryHistory = await pool.query(
            'DELETE FROM inventory_history WHERE id = $1 RETURNING *', 
            [id]
        );

        if (deleteInventoryHistory.rows.length === 0) {
            return res.status(404).json({ message: "Inventory History tidak ditemukan!" });
        }

        res.json({ message: "Inventory History berhasil dihapus dari database!" });
    } catch (err) {
        console.error("Error DELETE Inventory History:", err.message);
        res.status(500).send('Server Error');
    }
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend API sudah menyala di http://localhost:${PORT}`);
});