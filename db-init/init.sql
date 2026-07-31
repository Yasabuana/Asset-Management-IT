-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. Tabel Assets
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100),
    brand VARCHAR(100),
    kategori VARCHAR(100),
    kondisi VARCHAR(100),
    quantity INT DEFAULT 0,
    lokasi VARCHAR(255),
    keterangan TEXT,
    gambar_url TEXT
);

-- 3. Tabel Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    tipe_request VARCHAR(100),
    jumlah INT DEFAULT 1,
    status VARCHAR(50),
    tanggal_request TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_approval TIMESTAMP,
    keterangan TEXT
);

-- 4. Tabel Inventory History
CREATE TABLE IF NOT EXISTS inventory_history (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    tipe_transaksi VARCHAR(100),
    jumlah_perubahan INT,
    alasan TEXT,
    admin_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for users (only if empty)
INSERT INTO users (nama, role) 
SELECT 'Ahmad Fauzi', 'IT Support' WHERE NOT EXISTS (SELECT 1 FROM users);
INSERT INTO users (nama, role) 
SELECT 'Budi Santoso', 'Network Engineer' WHERE NOT EXISTS (SELECT 1 FROM users WHERE nama = 'Budi Santoso');
INSERT INTO users (nama, role) 
SELECT 'Citra Lestari', 'System Administrator' WHERE NOT EXISTS (SELECT 1 FROM users WHERE nama = 'Citra Lestari');
INSERT INTO users (nama, role) 
SELECT 'Dewi Sartika', 'Karyawan' WHERE NOT EXISTS (SELECT 1 FROM users WHERE nama = 'Dewi Sartika');

-- Seed data for assets (only if empty)
INSERT INTO assets (nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url)
SELECT 'ThinkPad L14 Gen 3', 'SN-THINK-10023', 'Lenovo', 'Laptop & PC', 'New', 15, 'Gudang IT - Lantai 3', 'Intel Core i5, RAM 16GB, SSD 512GB', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60' WHERE NOT EXISTS (SELECT 1 FROM assets);
INSERT INTO assets (nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url)
SELECT 'MacBook Pro M2 14"', 'SN-MAC-20045', 'Apple', 'Laptop & PC', 'New', 5, 'Gudang IT - Lantai 3', 'Apple M2 Pro, RAM 16GB, SSD 512GB Space Gray', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60' WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'SN-MAC-20045');
INSERT INTO assets (nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url)
SELECT 'Cisco Catalyst 2960', 'SN-CISCO-88902', 'Cisco', 'Networking', 'Used', 3, 'Rak Lab Jaringan - Lantai 2', '24 Port PoE Switch', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60' WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'SN-CISCO-88902');
INSERT INTO assets (nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url)
SELECT 'iPad Air 5th Gen', 'SN-IPAD-30988', 'Apple', 'Mobile Devices', 'New', 8, 'Gudang IT - Lantai 3', 'Apple M1, 64GB, Wi-Fi Blue', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60' WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'SN-IPAD-30988');

-- Seed data for transactions
INSERT INTO transactions (asset_id, user_id, tipe_request, jumlah, status, keterangan)
SELECT 1, 1, 'Peminjaman Sementara', 1, 'Approved (Dipinjam)', 'Dipinjam untuk kebutuhan onsite support' WHERE NOT EXISTS (SELECT 1 FROM transactions);
INSERT INTO transactions (asset_id, user_id, tipe_request, jumlah, status, keterangan)
SELECT 3, 2, 'Peminjaman Sementara', 1, 'Approved (Dipinjam)', 'Digunakan di Lab Jaringan Lantai 2' WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE asset_id = 3);

-- Seed data for inventory_history
INSERT INTO inventory_history (asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id)
SELECT 1, 'CREATE', 15, 'Inisialisasi stok awal ThinkPad L14 Gen 3', 1 WHERE NOT EXISTS (SELECT 1 FROM inventory_history);
INSERT INTO inventory_history (asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id)
SELECT 2, 'CREATE', 5, 'Inisialisasi stok awal MacBook Pro M2', 1 WHERE NOT EXISTS (SELECT 1 FROM inventory_history WHERE asset_id = 2);
INSERT INTO inventory_history (asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id)
SELECT 3, 'CREATE', 3, 'Inisialisasi switch Cisco bekas', 1 WHERE NOT EXISTS (SELECT 1 FROM inventory_history WHERE asset_id = 3);
INSERT INTO inventory_history (asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id)
SELECT 4, 'CREATE', 8, 'Inisialisasi iPad Air', 1 WHERE NOT EXISTS (SELECT 1 FROM inventory_history WHERE asset_id = 4);
