# 📋 Task List & Panduan Migrasi Database PostgreSQL

Panduan dan daftar tugas (checklist) untuk melakukan migrasi database proyek **Asset Management IT** ke PostgreSQL Server di IP `10.8.140.69`.

---

## 🔑 Informasi Database Target

- **Host IP**: `10.8.140.69`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `Cilego2026.`
- **Database Name**: `db_manajemen_aset`
- **Connection String**: `postgresql://postgres:Cilego2026.@10.8.140.69:5432/db_manajemen_aset`

---

## 🎯 Progress Migration Checklist

### Tahap 1: Persiapan & Uji Konektivitas
- [ ] **1.1 Test Network Connectivity**  
  Pastikan server/aplikasi dapat menjangkau IP `10.8.140.69` pada port `5432`.
  ```bash
  nc -zv 10.8.140.69 5432
  # Atau di Windows PowerShell:
  Test-NetConnection -ComputerName 10.8.140.69 -Port 5432
  ```
- [ ] **1.2 Buat Database Target di PostgreSQL Server**  
  Jika database `db_manajemen_aset` belum dibuat di server target `10.8.140.69`, buat terlebih dahulu via `psql` atau pgAdmin:
  ```sql
  CREATE DATABASE db_manajemen_aset;
  ```

---

### Tahap 2: Migrasi Schema & Data
- [ ] **2.1 OPSI A: Export & Import dari Database Lama (jika ada data existing)**  
  - Dump dari postgres lama (lokal / container lama):
    ```bash
    pg_dump -h localhost -p 5433 -U postgres -d db_manajemen_aset > backup_aset_it.sql
    ```
  - Restore ke postgres target `10.8.140.69`:
    ```bash
    psql -h 10.8.140.69 -p 5432 -U postgres -d db_manajemen_aset -f backup_aset_it.sql
    ```

- [ ] **2.2 OPSI B: Inisialisasi Schema Baru (DDL Script)**  
  Jika membuat database baru dari awal di server target, jalankan query berikut:
  ```sql
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
  ```

---

### Tahap 3: Konfigurasi Environment & Refactoring Backend
- [ ] **3.1 Update File `.env`**  
  Perbarui atau sesuaikan variabel lingkungan di root folder:
  ```env
  DB_HOST=10.8.140.69
  DB_PORT=5432
  DB_USER=postgres
  DB_PASS=Cilego2026.
  DB_NAME=db_manajemen_aset
  DATABASE_URL=postgresql://postgres:Cilego2026.@10.8.140.69:5432/db_manajemen_aset
  ```

- [ ] **3.2 Refactor `backend/server.js`**  
  Ubah inisialisasi `Pool` pada `backend/server.js` agar menggunakan environment variables secara dinamis:
  ```javascript
  const pool = new Pool({
      connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });
  ```

---

### Tahap 4: Penyesuaian Docker & Deployment Setup
- [ ] **4.1 Update `docker-compose.yml`**  
  Teruskan environment variables ke service `backend`:
  ```yaml
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend_aset_it
    restart: always
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - DB_NAME=${DB_NAME}
      - DATABASE_URL=${DATABASE_URL}
  ```
- [ ] **4.2 Opsional: Matikan Service `db` Lokal di Docker Compose**  
  Jika postgres lokal di container tidak digunakan lagi, hapus/comment service `db` dan `depends_on: - db` di `docker-compose.yml`.

---

### Tahap 5: Pengujian & Verifikasi System
- [ ] **5.1 Test Backend Local / Container**  
  Jalankan backend dan pastikan tidak ada error log saat koneksi ke database.
- [ ] **5.2 Test API Endpoint CRUD**  
  - [ ] `GET /api/assets` & `POST /api/assets`
  - [ ] `GET /api/users` & `POST /api/users`
  - [ ] `GET /api/transactions` & `POST /api/transactions`
  - [ ] `GET /api/inventory_history` & `POST /api/inventory_history`

---

### Tahap 6: Production Rollout
- [ ] **6.1 Commit & Push Code**  
  ```bash
  git add .
  git commit -m "feat: migrate database configuration to remote PostgreSQL 10.8.140.69"
  git push origin main
  ```
- [ ] **6.2 Deploy di Server Production**  
  Jalankan perintah berikut di server produksi:
  ```bash
  cd /home/clgadmin01/apps/Asset-Management-IT
  git pull origin main
  docker compose up -d --build --force-recreate
  ```
- [ ] **6.3 Verifikasi Log Container Backend**  
  ```bash
  docker logs -f backend_aset_it
  ```
