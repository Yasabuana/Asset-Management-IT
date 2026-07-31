# LAPORAN PROYEK
# SISTEM INFORMASI MANAJEMEN ASET IT — PLTGU CILEGON

---

> **Proyek**: Dashboard Aset Management IT  
> **Lingkungan Operasional**: PT PLN Nusantara Power — Unit Pembangkitan PLTGU Cilegon  
> **Tanggal Dokumen**: Juli 2026  
> **Versi**: 1.0

---

## DAFTAR ISI

- [BAB I: PENDAHULUAN](#bab-i-pendahuluan)
  - [1.1 Latar Belakang](#11-latar-belakang)
  - [1.2 Tujuan Proyek](#12-tujuan-proyek)
  - [1.3 Batasan Masalah](#13-batasan-masalah)
  - [1.4 Metode Pengumpulan Data](#14-metode-pengumpulan-data)
- [BAB II: LANDASAN TEORI](#bab-ii-landasan-teori)
  - [2.1 Manajemen Aset IT pada Lingkungan Industri](#21-manajemen-aset-it-pada-lingkungan-industri)
  - [2.2 Teknologi Web Front-End (React.js)](#22-teknologi-web-front-end-reactjs)
  - [2.3 Teknologi Web Back-End (Node.js & Express.js)](#23-teknologi-web-back-end-nodejs--expressjs)
  - [2.4 Database Relasional (PostgreSQL)](#24-database-relasional-postgresql)
  - [2.5 Vite.js sebagai Build Tool Modern](#25-vitejs-sebagai-build-tool-modern)
  - [2.6 Kontainerisasi dengan Docker & Docker Compose](#26-kontainerisasi-dengan-docker--docker-compose)
- [BAB III: PERANCANGAN SISTEM](#bab-iii-perancangan-sistem)
  - [3.1 Analisis Kebutuhan Sistem](#31-analisis-kebutuhan-sistem)
  - [3.2 Arsitektur Sistem](#32-arsitektur-sistem)
  - [3.3 Perancangan Database](#33-perancangan-database)
  - [3.4 Perancangan REST API](#34-perancangan-rest-api)
  - [3.5 Perancangan Antarmuka (UI/UX)](#35-perancangan-antarmuka-uiux)
  - [3.6 Perancangan State Management](#36-perancangan-state-management)
- [BAB IV: IMPLEMENTASI DAN PEMBAHASAN](#bab-iv-implementasi-dan-pembahasan)
  - [4.1 Implementasi Backend API Server](#41-implementasi-backend-api-server)
  - [4.2 Implementasi Dashboard Front-End](#42-implementasi-dashboard-front-end)
  - [4.3 Implementasi Fitur CRUD Aset](#43-implementasi-fitur-crud-aset)
  - [4.4 Implementasi Fitur Transaksi Peminjaman & Pengambilan](#44-implementasi-fitur-transaksi-peminjaman--pengambilan)
  - [4.5 Implementasi History Log & Audit Trail](#45-implementasi-history-log--audit-trail)
  - [4.6 Kontainerisasi & Deployment dengan Docker](#46-kontainerisasi--deployment-dengan-docker)
  - [4.7 Pengujian Sistem](#47-pengujian-sistem)
- [BAB V: PENUTUP](#bab-v-penutup)
  - [5.1 Kesimpulan](#51-kesimpulan)
  - [5.2 Saran Pengembangan](#52-saran-pengembangan)

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang

Unit pembangkit PLTGU Cilegon yang berada di bawah naungan PT PLN Nusantara Power mengelola sejumlah besar perangkat Teknologi Informasi (IT) guna mendukung operasional harian, mulai dari laptop, PC, server fisik, perangkat jaringan (*networking*), hingga monitor dan periferal lainnya. Selama ini, pencatatan inventaris aset IT dilakukan secara manual menggunakan spreadsheet konvensional maupun catatan kertas, yang menimbulkan sejumlah permasalahan signifikan:

1. **Kesulitan pelacakan real-time** — Tidak adanya sistem terpusat membuat sulit mengetahui status terkini setiap perangkat, apakah masih tersedia, sedang dipinjam, atau sudah tidak berfungsi.
2. **Proses peminjaman dan pengembalian tidak terstruktur** — Karyawan yang membutuhkan perangkat IT harus melalui proses manual yang lambat, rawan kehilangan data, dan minim akuntabilitas.
3. **Tidak ada riwayat mutasi stok** — Perubahan kuantitas, perpindahan aset, maupun penghapusan perangkat tidak tercatat secara kronologis sehingga menyulitkan proses audit.
4. **Redundansi data dan human error** — Penginputan ganda, ketidakseragaman format penamaan, serta kehilangan data antar-shift menjadi masalah yang berulang.

Berdasarkan permasalahan di atas, diperlukan sebuah **Sistem Informasi Manajemen Aset IT** berbasis web yang modern, terintegrasi dengan database terpusat, serta mampu mengelola seluruh siklus hidup (*lifecycle*) aset IT secara digital — mulai dari pencatatan, peminjaman, pengembalian, hingga penghapusan.

### 1.2 Tujuan Proyek

Tujuan utama dari proyek ini adalah merancang dan mengimplementasikan sebuah **dashboard manajemen aset IT berbasis web** yang mampu:

1. **Mendigitalisasi pencatatan inventaris aset IT** — Mengubah proses manual menjadi sistem digital terstruktur yang menyimpan data perangkat secara terpusat di dalam database PostgreSQL.
2. **Menyediakan operasi CRUD lengkap** — Memungkinkan administrator untuk menambah (*Create*), melihat (*Read*), mengubah (*Update*), dan menghapus (*Delete*) data aset perangkat IT melalui antarmuka web yang intuitif.
3. **Mengelola transaksi peminjaman dan pengambilan** — Menyediakan alur kerja (*workflow*) digital bagi karyawan untuk mengajukan peminjaman sementara maupun pengambilan habis pakai, lengkap dengan pelacakan status dan fitur pengembalian barang.
4. **Menyediakan audit trail otomatis** — Merekam setiap operasi mutasi stok (penambahan, pengurangan, checkout, return, penghapusan) ke dalam tabel `inventory_history` sebagai riwayat aktivitas yang dapat difilter dan ditelusuri.
5. **Mendukung deployment yang portabel** — Seluruh sistem dikontainerisasi menggunakan Docker sehingga dapat di-deploy ke server produksi manapun dengan konsisten dan tanpa konflik dependensi.

### 1.3 Batasan Masalah

Agar pengembangan proyek tetap terarah dan terukur, berikut adalah batasan masalah yang ditetapkan:

1. **Cakupan aset** — Sistem hanya mengelola aset perangkat IT (Laptop & PC, Server & Cloud Physical, Networking, Monitor & Peripherals), dan tidak mencakup aset non-IT seperti furnitur, kendaraan, atau alat berat.
2. **Kategori perangkat** — Terdapat empat kategori baku yang digunakan: `Laptop & PC`, `Server & Cloud Physical`, `Networking`, dan `Monitor & Peripherals`.
3. **Kondisi aset** — Status kondisi hanya terdiri dari dua nilai: `New` (baru) dan `Used` (bekas/pernah dipakai).
4. **Tipe transaksi** — Sistem mendukung dua jenis pengajuan: `Peminjaman Sementara` (barang akan dikembalikan) dan `Pengambilan Habis Pakai` (alokasi tetap, stok berkurang permanen).
5. **Otentikasi pengguna** — Pada versi ini, sistem belum menerapkan mekanisme login/otentikasi berbasis sesi atau token. Akses dashboard bersifat terbuka di jaringan internal.
6. **Lingkungan operasional** — Sistem dirancang untuk beroperasi di dalam jaringan internal (intranet) PLTGU Cilegon dan diakses melalui browser modern.

### 1.4 Metode Pengumpulan Data

Proses perancangan dan pengembangan sistem ini menggunakan beberapa metode pengumpulan data sebagai berikut:

1. **Observasi langsung** — Mengamati alur kerja pencatatan aset IT yang berjalan di lingkungan kerja PLTGU Cilegon, termasuk proses peminjaman perangkat oleh karyawan lintas divisi.
2. **Wawancara** — Berdiskusi dengan staf IT dan pengguna akhir mengenai kebutuhan fungsional sistem, jenis perangkat yang dikelola, serta kendala yang dihadapi dengan sistem pencatatan lama.
3. **Studi literatur** — Mempelajari praktik terbaik (*best practices*) dalam manajemen aset IT, arsitektur aplikasi web modern (*SPA dengan REST API*), serta dokumentasi resmi teknologi yang digunakan (React, Express, PostgreSQL, Docker).
4. **Analisis dokumen** — Menelaah daftar inventaris aset IT yang sudah ada dalam bentuk spreadsheet untuk menentukan skema database yang optimal dan field-field data yang diperlukan.

---

## BAB II: LANDASAN TEORI

### 2.1 Manajemen Aset IT pada Lingkungan Industri

Manajemen Aset IT (*IT Asset Management / ITAM*) merupakan serangkaian praktik bisnis yang menggabungkan fungsi finansial, kontrak, dan inventaris untuk mendukung pengelolaan siklus hidup (*lifecycle*) serta pengambilan keputusan strategis terhadap aset-aset teknologi informasi dalam suatu organisasi.

Dalam konteks industri pembangkit listrik seperti PLTGU Cilegon, aset IT memiliki peran krusial dalam mendukung:
- Operasional sistem kontrol dan monitoring pembangkit.
- Komunikasi data internal antar unit.
- Kebutuhan komputasi dan administrasi karyawan.
- Infrastruktur jaringan (switch, router, access point) yang menghubungkan berbagai area operasional.

Sistem ITAM yang baik harus mampu menjawab pertanyaan-pertanyaan mendasar seperti: aset apa saja yang dimiliki, di mana lokasinya, siapa yang menggunakannya, bagaimana kondisinya, dan berapa jumlah stok yang tersedia.

### 2.2 Teknologi Web Front-End (React.js)

**React.js** (versi 19.2.7 yang digunakan dalam proyek ini) adalah pustaka (*library*) JavaScript yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (*User Interface*) berbasis komponen. Konsep-konsep utama React yang dimanfaatkan dalam proyek ini meliputi:

- **Komponen Fungsional** — Seluruh UI dibangun menggunakan fungsi JavaScript yang mengembalikan elemen JSX (*JavaScript XML*), memungkinkan dekomposisi antarmuka menjadi unit-unit kecil yang dapat digunakan kembali (*reusable*).
- **React Hooks** — Menggunakan `useState` untuk mengelola state lokal komponen, `useEffect` untuk efek samping (*side effects*) seperti sinkronisasi data, dan `useCallback` untuk memoization fungsi handler.
- **Komponen JSX** — Sintaks ekstensi JavaScript yang memungkinkan penulisan markup HTML di dalam kode JavaScript, menghasilkan kode yang lebih deklaratif dan mudah dipahami.

Teknologi pendamping pada sisi front-end meliputi:
- **Vanilla CSS3** — Seluruh styling dibangun menggunakan CSS murni tanpa framework CSS pihak ketiga, memanfaatkan teknik **CSS Custom Properties (Design Tokens)** untuk konsistensi visual dan kemudahan pemeliharaan tema.
- **SVG Icons** — Ikon-ikon antarmuka diimplementasikan secara inline menggunakan format Scalable Vector Graphics (SVG) untuk menjaga ketajaman visual pada berbagai resolusi layar.

### 2.3 Teknologi Web Back-End (Node.js & Express.js)

**Node.js** (versi 20 LTS) merupakan *runtime environment* JavaScript yang dibangun di atas mesin V8 milik Google Chrome, memungkinkan eksekusi kode JavaScript di sisi server. Node.js mengusung arsitektur *event-driven, non-blocking I/O* yang sangat efisien untuk menangani banyak koneksi secara bersamaan.

**Express.js** (versi 5.2.1) adalah kerangka kerja (*framework*) web minimalis untuk Node.js yang menyediakan mekanisme routing, middleware, serta penanganan request-response HTTP secara terstruktur. Dalam proyek ini, Express.js berfungsi sebagai fondasi REST API server yang melayani seluruh operasi CRUD dari dashboard front-end.

Pustaka tambahan yang digunakan pada backend:
- **pg (node-postgres)** versi 8.22.0 — Driver resmi untuk menghubungkan Node.js dengan database PostgreSQL melalui mekanisme *connection pooling*.
- **cors** versi 2.8.6 — Middleware untuk mengaktifkan *Cross-Origin Resource Sharing*, memungkinkan front-end yang berjalan di port berbeda (3005) mengakses API di port 5000.
- **dotenv** versi 17.4.2 — Modul untuk memuat variabel lingkungan (*environment variables*) dari file `.env` ke dalam `process.env`, menjaga keamanan kredensial database.

### 2.4 Database Relasional (PostgreSQL)

**PostgreSQL** (versi 15 Alpine) adalah sistem manajemen basis data relasional (*RDBMS*) bersifat *open-source* yang dikenal dengan keandalan, kekayaan fitur, dan kepatuhan terhadap standar SQL. PostgreSQL dipilih dalam proyek ini karena:

- **Integritas referensial** — Mendukung *foreign key constraints* dengan aksi `ON DELETE CASCADE` dan `ON DELETE SET NULL` untuk menjaga konsistensi antar-tabel.
- **Tipe data yang kaya** — Menyediakan tipe `SERIAL` untuk auto-increment primary key, `TIMESTAMP` untuk pencatatan waktu otomatis, dan `TEXT` untuk data teks tanpa batas panjang.
- **Performa tinggi** — Mampu menangani volume data inventaris dalam skala korporasi dengan respons query yang cepat.
- **Kompatibilitas Docker** — Tersedia *official image* (`postgres:15-alpine`) yang ringan dan mudah dikonfigurasi dalam orkestrasi Docker Compose.

### 2.5 Vite.js sebagai Build Tool Modern

**Vite.js** (versi 8.1.1) merupakan *build tool* generasi baru yang diciptakan oleh Evan You (pencipta Vue.js) dan dirancang untuk memberikan pengalaman pengembangan yang jauh lebih cepat dibandingkan pendahulunya seperti Webpack atau Parcel. Keunggulan utama Vite dalam proyek ini:

- **Hot Module Replacement (HMR)** — Perubahan kode sumber langsung direfleksikan ke browser tanpa perlu full page reload, secara drastis mempercepat siklus iterasi pengembangan.
- **ES Module Native** — Memanfaatkan dukungan *ES Modules* bawaan browser modern saat development, sehingga tidak perlu melakukan bundling penuh pada setiap perubahan.
- **Optimized Production Build** — Menggunakan Rollup di balik layar untuk menghasilkan bundle produksi yang ter-*minify* dan ter-*tree-shake* secara optimal.
- **Plugin React** — Integrasi dengan plugin `@vitejs/plugin-react` (versi 6.0.3) untuk dukungan JSX transform dan Fast Refresh pada komponen React.

### 2.6 Kontainerisasi dengan Docker & Docker Compose

**Docker** adalah platform kontainerisasi yang memungkinkan aplikasi beserta seluruh dependensinya dikemas ke dalam unit standar bernama *container*, yang dapat dijalankan secara konsisten di lingkungan manapun.

**Docker Compose** merupakan alat orkestrasi yang mendefinisikan dan menjalankan aplikasi multi-kontainer melalui satu file konfigurasi YAML (`docker-compose.yml`). Dalam proyek ini, Docker Compose mengorkestrasi tiga layanan (*services*):

| Service | Image / Build Context | Port Mapping | Fungsi |
|---------|----------------------|--------------|--------|
| `db` | `postgres:15-alpine` | `5433:5432` | Database PostgreSQL |
| `web` | Build dari `./Dashboard Aset Management IT` | `3005:3000` | Front-end (Nginx serving React build) |
| `backend` | Build dari `./backend` | `5000:5000` | REST API Server (Express.js) |

Strategi multi-stage build diterapkan pada front-end: stage pertama (`node:20-alpine`) melakukan `npm run build` untuk menghasilkan aset statis, dan stage kedua (`nginx:1.27-alpine`) menyajikan hasil build menggunakan web server Nginx yang ringan dan performan.

---

## BAB III: PERANCANGAN SISTEM

### 3.1 Analisis Kebutuhan Sistem

#### 3.1.1 Kebutuhan Fungsional

| No | Kebutuhan Fungsional | Deskripsi |
|----|---------------------|-----------|
| F-01 | Dashboard ringkasan | Menampilkan statistik total jenis aset, jumlah aset kondisi New, jumlah aset kondisi Used, dan total unit keseluruhan. |
| F-02 | CRUD data aset | Menambah, melihat daftar, mengedit, dan menghapus data perangkat IT beserta atribut lengkapnya (nama, serial number, brand, kategori, kondisi, kuantitas, lokasi, keterangan). |
| F-03 | Pencarian & filter | Memungkinkan pencarian berdasarkan kata kunci (ID, nama, serial number, lokasi, kategori) serta filter berdasarkan kondisi, kategori, dan pengurutan. |
| F-04 | Form peminjaman/pengambilan | Menyediakan formulir untuk mengajukan peminjaman sementara atau pengambilan habis pakai, termasuk validasi stok dan pencatatan data pengguna. |
| F-05 | Monitoring transaksi | Menampilkan daftar seluruh transaksi beserta status (Sedang Dipinjam / Selesai), dengan opsi pengembalian barang. |
| F-06 | History log / audit trail | Mencatat setiap operasi (CREATE, UPDATE, DELETE, CHECKOUT, RETURN, STATUS_CHANGE) secara otomatis ke tabel `inventory_history` dengan detail mutasi stok. |
| F-07 | Manajemen pengguna | Menampilkan daftar pengguna/karyawan yang terdaftar, dengan mekanisme auto-registrasi saat transaksi baru. |
| F-08 | Toggle kondisi cepat | Memungkinkan perubahan status kondisi aset (New ↔ Used) secara langsung dari tabel daftar aset melalui satu kali klik. |
| F-09 | Detail view modal | Menampilkan informasi lengkap aset dalam jendela modal (*pop-up*) tanpa berpindah halaman. |
| F-10 | Notifikasi toast | Menampilkan umpan balik operasi berhasil/gagal melalui notifikasi *toast* yang tampil sementara di layar. |

#### 3.1.2 Kebutuhan Non-Fungsional

| No | Kebutuhan Non-Fungsional | Deskripsi |
|----|--------------------------|-----------|
| NF-01 | Responsivitas | Dashboard harus dapat ditampilkan dengan baik pada berbagai ukuran layar (desktop dan tablet). |
| NF-02 | Performa | Waktu muat halaman awal (initial load) tidak lebih dari 3 detik pada jaringan internal. |
| NF-03 | Portabilitas | Seluruh sistem dapat di-deploy di server manapun yang mendukung Docker tanpa modifikasi kode. |
| NF-04 | Pemeliharaan | Kode sumber terstruktur secara modular (komponen terpisah, state management terpusat) untuk memudahkan pemeliharaan. |
| NF-05 | Keamanan data | Kredensial database disimpan di file `.env` yang tidak di-commit ke repository (melalui `.gitignore`). |
| NF-06 | Ketersediaan | Container dikonfigurasi dengan `restart: always` untuk memastikan layanan bangkit kembali secara otomatis setelah kegagalan. |

### 3.2 Arsitektur Sistem

Sistem dibangun mengikuti arsitektur **Three-Tier (Client-Server)** yang terdiri dari tiga lapisan utama:

```
┌──────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                             │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  React.js SPA (Single Page Application)                       │  │
│  │  ├── Sidebar Navigation                                       │  │
│  │  ├── Dashboard Page (Statistik & Quick Actions)                │  │
│  │  ├── Asset List Page (Tabel + Filter + Search)                │  │
│  │  ├── Asset Form Page (Tambah / Edit Aset)                    │  │
│  │  ├── Asset Checkout Page (Form Peminjaman)                    │  │
│  │  ├── Transactions Page (Monitoring Transaksi)                 │  │
│  │  ├── History Log Page (Audit Trail)                           │  │
│  │  ├── Users Page (Data Pengguna)                               │  │
│  │  └── Modals (Detail View + Delete Confirmation)               │  │
│  │  Served by: Nginx 1.27 (Container: web_aset_it, Port 3005)   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              │  HTTP / Fetch API                     │
│                              ▼                                       │
│                        APPLICATION TIER                               │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Express.js REST API Server                                   │  │
│  │  ├── GET  /api/assets, /api/users, /api/transactions,        │  │
│  │  │        /api/inventory_history                               │  │
│  │  ├── POST (Create) untuk setiap resource                      │  │
│  │  ├── PUT  (Update) untuk setiap resource                      │  │
│  │  └── DELETE untuk setiap resource                             │  │
│  │  Runtime: Node.js 20 (Container: backend_aset_it, Port 5000) │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              │  SQL Queries (pg driver)              │
│                              ▼                                       │
│                          DATA TIER                                    │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 15 Database (db_manajemen_aset)                   │  │
│  │  ├── Tabel: assets                                            │  │
│  │  ├── Tabel: users                                             │  │
│  │  ├── Tabel: transactions                                      │  │
│  │  └── Tabel: inventory_history                                 │  │
│  │  Container: postgres_aset_it, Port 5433:5432                  │  │
│  │  Volume: pgdata (persistent)                                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.3 Perancangan Database

Database `db_manajemen_aset` terdiri dari empat tabel utama yang saling berelasi melalui *foreign key*:

#### 3.3.1 Entity Relationship Diagram (ERD)

```
┌──────────────┐       ┌───────────────────┐       ┌──────────────┐
│    USERS     │       │   TRANSACTIONS    │       │    ASSETS    │
├──────────────┤       ├───────────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK)           │   ┌──►│ id (PK)      │
│ nama         │   └───│ user_id (FK)      │   │   │ nama         │
│ role         │       │ asset_id (FK) ────│───┘   │ serial_number│
└──────────────┘       │ tipe_request      │       │ brand        │
                       │ jumlah            │       │ kategori     │
                       │ status            │       │ kondisi      │
                       │ tanggal_request   │   ┌──►│ quantity     │
                       │ tanggal_approval  │   │   │ lokasi       │
                       │ keterangan        │   │   │ keterangan   │
                       └───────────────────┘   │   │ gambar_url   │
                                               │   └──────────────┘
┌────────────────────────┐                     │
│   INVENTORY_HISTORY    │                     │
├────────────────────────┤                     │
│ id (PK)                │                     │
│ asset_id (FK) ─────────│─────────────────────┘
│ tipe_transaksi         │
│ jumlah_perubahan       │       ┌──────────────┐
│ alasan                 │       │    USERS     │
│ admin_id (FK) ─────────│──────►│ id (PK)      │
│ created_at             │       └──────────────┘
└────────────────────────┘
```

#### 3.3.2 Struktur Tabel

**Tabel `users`** — Menyimpan data identitas karyawan/pengguna yang pernah melakukan transaksi.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PRIMARY KEY` | ID unik auto-increment |
| `nama` | `VARCHAR(255)` | `NOT NULL` | Nama lengkap pengguna |
| `role` | `VARCHAR(50)` | `NOT NULL` | Jabatan atau divisi |

**Tabel `assets`** — Menyimpan data inventaris perangkat IT.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PRIMARY KEY` | ID unik auto-increment |
| `nama` | `VARCHAR(255)` | `NOT NULL` | Nama perangkat dan model |
| `serial_number` | `VARCHAR(100)` | — | Nomor seri perangkat |
| `brand` | `VARCHAR(100)` | — | Merek/pabrikan |
| `kategori` | `VARCHAR(100)` | — | Kategori (Laptop & PC, Networking, dll.) |
| `kondisi` | `VARCHAR(100)` | — | Kondisi fisik (New / Used) |
| `quantity` | `INT` | `DEFAULT 0` | Jumlah stok tersedia |
| `lokasi` | `VARCHAR(255)` | — | Lokasi penempatan fisik |
| `keterangan` | `TEXT` | — | Spesifikasi teknis / catatan |
| `gambar_url` | `TEXT` | — | URL gambar perangkat |

**Tabel `transactions`** — Mencatat setiap transaksi peminjaman dan pengambilan aset.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PRIMARY KEY` | ID transaksi unik |
| `asset_id` | `INT` | `FK → assets(id) ON DELETE CASCADE` | Referensi ke aset |
| `user_id` | `INT` | `FK → users(id) ON DELETE SET NULL` | Referensi ke pengguna |
| `tipe_request` | `VARCHAR(100)` | — | Jenis pengajuan |
| `jumlah` | `INT` | `DEFAULT 1` | Jumlah unit yang diajukan |
| `status` | `VARCHAR(50)` | — | Status transaksi |
| `tanggal_request` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Waktu pengajuan |
| `tanggal_approval` | `TIMESTAMP` | — | Waktu persetujuan |
| `keterangan` | `TEXT` | — | Tujuan / catatan |

**Tabel `inventory_history`** — Mencatat seluruh riwayat mutasi dan aktivitas pada inventaris (audit trail).

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| `id` | `SERIAL` | `PRIMARY KEY` | ID log unik |
| `asset_id` | `INT` | `FK → assets(id) ON DELETE CASCADE` | Referensi ke aset |
| `tipe_transaksi` | `VARCHAR(100)` | — | Jenis operasi (CREATE, UPDATE, DELETE, CHECKOUT, RETURN, STATUS_CHANGE) |
| `jumlah_perubahan` | `INT` | — | Delta perubahan stok (positif = masuk, negatif = keluar) |
| `alasan` | `TEXT` | — | Deskripsi perubahan |
| `admin_id` | `INT` | `FK → users(id) ON DELETE SET NULL` | Referensi ke pelaku |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Waktu pencatatan |

### 3.4 Perancangan REST API

Seluruh komunikasi antara front-end dan back-end dilakukan melalui RESTful API dengan base URL `http://localhost:5000/api`. Berikut adalah spesifikasi endpoint:

| Metode | Endpoint | Deskripsi | Request Body |
|--------|----------|-----------|--------------|
| `GET` | `/api/assets` | Mengambil seluruh data aset | — |
| `POST` | `/api/assets` | Menambah aset baru | JSON: `{nama, serial_number, brand, kategori, kondisi, quantity, lokasi, keterangan, gambar_url}` |
| `PUT` | `/api/assets/:id` | Mengupdate data aset | JSON: field yang diubah |
| `DELETE` | `/api/assets/:id` | Menghapus aset | — |
| `GET` | `/api/users` | Mengambil seluruh data pengguna | — |
| `POST` | `/api/users` | Menambah pengguna baru | JSON: `{nama, role}` |
| `PUT` | `/api/users/:id` | Mengupdate data pengguna | JSON: field yang diubah |
| `DELETE` | `/api/users/:id` | Menghapus pengguna | — |
| `GET` | `/api/transactions` | Mengambil seluruh transaksi | — |
| `POST` | `/api/transactions` | Membuat transaksi baru | JSON: `{asset_id, user_id, tipe_request, jumlah, status, keterangan}` |
| `PUT` | `/api/transactions/:id` | Mengupdate transaksi | JSON: field yang diubah |
| `DELETE` | `/api/transactions/:id` | Menghapus transaksi | — |
| `GET` | `/api/inventory_history` | Mengambil seluruh history log | — |
| `POST` | `/api/inventory_history` | Menambah entri log baru | JSON: `{asset_id, tipe_transaksi, jumlah_perubahan, alasan, admin_id}` |
| `PUT` | `/api/inventory_history/:id` | Mengupdate entri log | JSON: field yang diubah |
| `DELETE` | `/api/inventory_history/:id` | Menghapus entri log | — |

### 3.5 Perancangan Antarmuka (UI/UX)

Antarmuka dashboard dirancang dengan prinsip **clean, professional, dan enterprise-grade** menggunakan design system yang terdefinisi dalam CSS Custom Properties (Design Tokens):

#### 3.5.1 Design System

- **Tipografi**: Font `Inter` untuk teks umum dan `JetBrains Mono` untuk data teknis (kode aset, serial number).
- **Skema Warna**: Palet warna berbasis biru korporat (`#1a56db` sebagai warna primer) dengan variasi semantik untuk status sukses (hijau), peringatan (kuning/oranye), dan bahaya (merah).
- **Spacing Scale**: Sistem jarak konsisten berbasis kelipatan 4px (`--space-1` hingga `--space-12`).
- **Radius & Shadow**: Sudut membulat bertingkat (`--radius-sm` hingga `--radius-full`) dan bayangan berlapis (`--shadow-xs` hingga `--shadow-xl`) untuk hierarki visual.

#### 3.5.2 Layout Utama

```
┌──────────┬────────────────────────────────────────────┐
│          │                                            │
│ SIDEBAR  │           MAIN CONTENT AREA                │
│ (240px)  │                                            │
│          │  ┌──────────────────────────────────────┐  │
│ ○ Logo   │  │  PAGE HEADER                         │  │
│ ○ Brand  │  │  Breadcrumb + Title + Actions        │  │
│          │  └──────────────────────────────────────┘  │
│ ─────── │  ┌──────────────────────────────────────┐  │
│ Menu:    │  │  PAGE BODY                           │  │
│ Dashboard│  │                                      │  │
│ Lihat    │  │  [Stat Cards / Table / Form /        │  │
│ Tambah   │  │   History Timeline / etc.]           │  │
│ Pinjam   │  │                                      │  │
│ Transaksi│  │                                      │  │
│ Pengguna │  └──────────────────────────────────────┘  │
│ History  │                                            │
│          │  ┌──────────────────────────────────────┐  │
│ ─────── │  │  TOAST NOTIFICATIONS                  │  │
│ Footer   │  └──────────────────────────────────────┘  │
└──────────┴────────────────────────────────────────────┘
```

#### 3.5.3 Navigasi & Halaman

Sistem menggunakan **client-side routing** berbasis state (tanpa library router eksternal) dengan tujuh halaman utama:

1. **Dashboard** — Halaman beranda dengan kartu statistik dan pintasan aksi.
2. **Lihat Aset (List)** — Tabel data lengkap dengan toolbar filter dan pencarian.
3. **Tambah Aset (Add)** — Formulir multi-section untuk registrasi perangkat baru.
4. **Form Peminjaman (Checkout)** — Formulir pengajuan peminjaman/pengambilan.
5. **Data Transaksi (Transactions)** — Tabel monitoring seluruh transaksi.
6. **Data Pengguna (Users)** — Tabel daftar pengguna terdaftar.
7. **History Log** — Timeline kronologis seluruh mutasi inventaris.

### 3.6 Perancangan State Management

State management diimplementasikan secara custom (tanpa library pihak ketiga seperti Redux atau Zustand) menggunakan pola **Observer/Pub-Sub** melalui class `Store`:

```
┌─────────────────────────────────────────────────────┐
│                    Store (Singleton)                  │
│                                                       │
│  State:                                               │
│  ├── assetsState[]        ← Data aset dari API       │
│  ├── logsState[]          ← Data history log         │
│  ├── usersState[]         ← Data pengguna            │
│  ├── transactionsState[]  ← Data transaksi           │
│  └── filterState{}        ← Kriteria filter/search   │
│                                                       │
│  Methods (Async):                                     │
│  ├── fetchDataFromAPI()       → Initial data load    │
│  ├── createOrUpdateAsset()    → CRUD aset            │
│  ├── deleteAssetById()        → Hapus aset           │
│  ├── toggleAssetStatus()      → Toggle kondisi       │
│  ├── submitTransaction()      → Buat transaksi       │
│  ├── processReturn()          → Pengembalian barang  │
│  ├── addHistoryLog()          → Catat audit trail    │
│  ├── setFilters()             → Update filter        │
│  ├── getFilteredAssets()      → Computed filter      │
│  └── clearLogs()              → Bersihkan log        │
│                                                       │
│  Observer Pattern:                                    │
│  ├── subscribe(listener)      → Daftar listener      │
│  └── notify()                 → Broadcast ke semua   │
└──────────────────────┬───────────────────────────────┘
                       │
              ┌────────┴────────┐
              │ useAssetStore() │  ← Custom React Hook
              │ (Bridge Layer)  │
              └────────┬────────┘
                       │
    ┌──────────────────┼──────────────────┐
    ▼                  ▼                  ▼
 DashboardPage   AssetListPage   TransactionsPage  ...
```

Custom hook `useAssetStore()` bertindak sebagai jembatan (*bridge*) yang mengkonversi pola subscriber class-based menjadi React hooks, menggunakan `useState` dan `useEffect` untuk re-render otomatis ketika state berubah.

---

## BAB IV: IMPLEMENTASI DAN PEMBAHASAN

### 4.1 Implementasi Backend API Server

Backend diimplementasikan dalam satu file `server.js` menggunakan Express.js yang menyediakan 16 endpoint RESTful untuk empat resource utama:

**Inisialisasi dan Konfigurasi:**

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
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
```

Setiap endpoint mengikuti pola yang konsisten:
- **GET** — Mengeksekusi `SELECT * FROM <tabel>` dan mengembalikan array JSON.
- **POST** — Menerima body JSON, melakukan `INSERT ... RETURNING *`, dan mengembalikan record yang baru dibuat.
- **PUT** — Menerima parameter `:id` dan body JSON, melakukan `UPDATE ... WHERE id = $n RETURNING *`, dengan validasi apakah record ditemukan.
- **DELETE** — Menerima parameter `:id`, melakukan `DELETE ... WHERE id = $1 RETURNING *`, dengan validasi keberadaan record.

Semua endpoint dilengkapi dengan *error handling* melalui blok `try-catch` yang menangkap exception database dan mengembalikan status HTTP 500 beserta pesan error.

### 4.2 Implementasi Dashboard Front-End

Halaman Dashboard (`DashboardPage.jsx`) merupakan titik masuk utama pengguna yang menyajikan tiga elemen informasi:

1. **Kartu Statistik (Stats Grid)** — Menampilkan empat metrik utama yang dihitung secara real-time dari state:
   - *Total Jenis Aset* — Jumlah record di tabel `assets` (`assets.length`).
   - *Kondisi Baru (New)* — Filter aset dengan `kondisi === 'New'`.
   - *Bekas (Used)* — Filter aset dengan `kondisi === 'Used'`.
   - *Total Unit Aset* — Akumulasi seluruh `quantity` menggunakan `reduce()`.

2. **Kartu Aksi Cepat (Quick Actions)** — Tiga kartu navigasi bergambar ikon SVG yang mengarahkan ke halaman Lihat Aset, Tambah Aset, dan Update/Delete.

3. **Aktivitas Terbaru (Recent Activity)** — Menampilkan lima entri log terbaru dari `inventory_history`, dilengkapi indikator warna berdasarkan tipe operasi (hijau untuk CREATE/RETURN, oranye untuk UPDATE/CHECKOUT, merah untuk DELETE).

### 4.3 Implementasi Fitur CRUD Aset

#### 4.3.1 Daftar Aset (AssetListPage)

Halaman daftar aset menampilkan tabel data responsif dengan fitur-fitur berikut:
- **Search bar** — Pencarian multi-kolom (ID, nama, serial number, lokasi, kategori) secara real-time.
- **Filter kondisi** — Dropdown untuk memfilter berdasarkan status New/Used.
- **Filter kategori** — Dropdown untuk memfilter berdasarkan empat kategori perangkat.
- **Sorting** — Opsi pengurutan berdasarkan ID (A-Z / Z-A) dan Nama (A-Z / Z-A).
- **Tombol aksi per-baris** — Empat tombol ikon: Pinjam (checkout), Lihat Detail (eye), Edit (pencil), dan Hapus (trash).
- **Quick status toggle** — Klik pada badge kondisi untuk mengubah status secara langsung.

#### 4.3.2 Form Aset (AssetFormPage)

Form input data aset dibagi menjadi tiga section logis:
1. **Identitas Perangkat** — Kategori, nama & model, brand, stok awal, serial number, kondisi.
2. **Penempatan & Pengguna** — Lokasi penempatan fisik.
3. **Pengadaan & Spesifikasi Teknis** — Keterangan/spesifikasi dalam format textarea.

Form bersifat *dual-purpose*: mode Tambah (Create) dan mode Edit (Update) dikontrol oleh prop `editAsset`. Pada mode Edit, field ID ditampilkan tetapi tidak dapat diubah (*disabled*).

#### 4.3.3 Detail & Hapus (Modals)

Dua jendela modal diimplementasikan dalam komponen `Modals.jsx`:
- **Modal Detail** — Menampilkan informasi lengkap aset (kondisi dengan badge berwarna, stok, serial number, brand, lokasi, spesifikasi) dengan tombol navigasi ke halaman edit.
- **Modal Konfirmasi Hapus** — Menampilkan peringatan (*warning*) bahwa penghapusan bersifat permanen, preview data aset yang akan dihapus, serta tombol konfirmasi berwarna merah.

### 4.4 Implementasi Fitur Transaksi Peminjaman & Pengambilan

#### 4.4.1 Form Checkout (AssetCheckoutPage)

Alur transaksi peminjaman/pengambilan aset:

```
Pilih Aset → Tentukan Tipe Request → Isi Jumlah → Isi Data Pengguna → Submit
     │                │                    │              │              │
     │     ┌──────────┴───────────┐       │              │              │
     │     │ Peminjaman Sementara │       │   ┌──────────┴──────────┐  │
     │     │ Pengambilan Habis    │       │   │ Nama Pengguna       │  │
     │     └──────────────────────┘       │   │ Divisi / Jabatan    │  │
     │                                    │   │ Tujuan Penggunaan   │  │
     ▼                                    │   └─────────────────────┘  │
Filter: Stok > 0                    Max = Stok                        │
Kondisi ≠ Non-aktif                  Saat Ini                         ▼
                                                              ┌───────────────┐
                                                              │ Store Logic:  │
                                                              │ 1. Cek stok   │
                                                              │ 2. Auto-reg   │
                                                              │    user       │
                                                              │ 3. POST trx   │
                                                              │ 4. Update qty │
                                                              │ 5. Log history│
                                                              └───────────────┘
```

Fitur penting pada form checkout:
- **Auto-filter** — Hanya menampilkan aset yang memiliki stok tersedia (`quantity > 0`).
- **Validasi stok real-time** — Field jumlah dibatasi oleh `max` yang sesuai stok tersedia.
- **Auto-registrasi pengguna** — Jika nama pengguna belum terdaftar di tabel `users`, sistem otomatis melakukan `POST /api/users` untuk mendaftarkannya.
- **Pre-fill aset** — Jika form diakses melalui tombol "Pinjam" di halaman list, aset yang dipilih otomatis ter-*select*.

#### 4.4.2 Monitoring Transaksi (TransactionsPage)

Halaman transaksi menampilkan tabel dengan kolom-kolom: ID Transaksi, Perangkat IT, Pengguna, Tipe Request, Jumlah, Status, Tanggal, Keterangan, dan Aksi.

Fitur utama:
- **Filter tipe** — Tabs untuk filter: Semua, Peminjaman Sementara, Pengambilan Habis Pakai.
- **Status badge** — `Sedang Dipinjam` (hijau/aktif) dan `Selesai` (abu-abu).
- **Tombol Kembalikan** — Hanya muncul pada transaksi dengan status "Dipinjam", yang ketika diklik akan:
  1. Mengubah status transaksi menjadi "Returned (Selesai)".
  2. Menambah kembali kuantitas stok aset.
  3. Mengubah kondisi aset menjadi "Used" secara otomatis.
  4. Mencatat log RETURN di `inventory_history`.

### 4.5 Implementasi History Log & Audit Trail

Halaman History Log (`HistoryLogPage.jsx`) menyajikan timeline kronologis seluruh operasi mutasi inventaris dengan fitur:

- **Filter berdasarkan tipe operasi** — Tabs: Semua, Peminjaman/Out, Pengembalian/In, Tambah, Update, Hapus.
- **Indikator visual** — Dot berwarna sesuai tipe: hijau (CREATE, RETURN), oranye (UPDATE, STATUS_CHANGE, CHECKOUT), merah (DELETE).
- **Informasi mutasi stok** — Badge yang menampilkan delta perubahan kuantitas (contoh: `Mutasi: -3 unit` atau `Mutasi: +2 unit`) dengan warna merah/hijau.
- **Timestamp & admin** — Waktu pencatatan dan ID admin pelaku operasi.
- **Fungsi pembersihan** — Tombol "Hapus Semua Log" dengan konfirmasi dialog.

### 4.6 Kontainerisasi & Deployment dengan Docker

#### 4.6.1 Konfigurasi Docker Compose

File `docker-compose.yml` mendefinisikan tiga layanan yang saling terhubung:

```yaml
services:
  db:                                    # PostgreSQL Database
    image: postgres:15-alpine
    container_name: postgres_aset_it
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASS}      # Dari file .env
      POSTGRES_DB: db_manajemen_aset
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data  # Data persisten

  web:                                   # Frontend (Nginx + React Build)
    build: ./Dashboard Aset Management IT
    container_name: web_aset_it
    restart: always
    ports:
      - "3005:3000"
    depends_on:
      - db

  backend:                               # API Server (Express.js)
    build: ./backend
    container_name: backend_aset_it
    restart: always
    ports:
      - "5000:5000"
    environment:
      - DB_PASS=${DB_PASS}
    depends_on:
      - db
```

#### 4.6.2 Multi-Stage Build (Frontend)

Dockerfile frontend menggunakan strategi *multi-stage build* untuk mengoptimalkan ukuran image:

| Stage | Base Image | Fungsi | Output |
|-------|-----------|--------|--------|
| Builder | `node:20-alpine` | Install dependencies, compile React → aset statis | Folder `dist/` |
| Production | `nginx:1.27-alpine` | Serve file statis melalui Nginx | Image final (~30MB) |

Konfigurasi Nginx (`nginx.conf`) dikonfigurasi untuk:
- Mendengarkan port 3000.
- Melayani file statis dari `/usr/share/nginx/html`.
- Menerapkan *fallback* `try_files $uri $uri/ /index.html` untuk mendukung client-side routing SPA.

#### 4.6.3 Prosedur Deployment Produksi

Deployment ke server produksi (`10.8.140.69` atau server target) dilakukan melalui langkah-langkah:

```bash
# 1. Masuk ke direktori proyek di server
cd /home/clgadmin01/apps/Asset-Management-IT

# 2. Tarik update terbaru dari Git
git pull origin main

# 3. Rebuild dan restart container
docker compose up -d --build --force-recreate
```

### 4.7 Pengujian Sistem

#### 4.7.1 Pengujian API Endpoint (Backend)

| Endpoint | Metode | Test Case | Hasil yang Diharapkan |
|----------|--------|-----------|----------------------|
| `/api/assets` | GET | Ambil semua aset | Status 200, array JSON |
| `/api/assets` | POST | Tambah aset baru (body lengkap) | Status 200, object aset baru dengan ID |
| `/api/assets/:id` | PUT | Update aset existing | Status 200, object aset terupdate |
| `/api/assets/:id` | PUT | Update ID yang tidak ada | Status 404, pesan error |
| `/api/assets/:id` | DELETE | Hapus aset existing | Status 200, pesan sukses |
| `/api/users` | GET | Ambil semua pengguna | Status 200, array JSON |
| `/api/users` | POST | Tambah pengguna baru | Status 200, object user baru |
| `/api/transactions` | POST | Buat transaksi peminjaman | Status 200, object transaksi |
| `/api/inventory_history` | GET | Ambil semua log | Status 200, array JSON |

#### 4.7.2 Pengujian Fungsional (Frontend)

| No | Fitur yang Diuji | Skenario | Hasil |
|----|-------------------|----------|-------|
| 1 | Dashboard statistik | Buka halaman dashboard setelah ada data aset | Kartu statistik menampilkan angka yang sesuai ✅ |
| 2 | Tambah aset | Isi form dan submit | Data tersimpan, toast sukses muncul, redirect ke list ✅ |
| 3 | Edit aset | Klik edit, ubah data, submit | Data terupdate, toast sukses muncul ✅ |
| 4 | Hapus aset | Klik hapus, konfirmasi dialog | Data terhapus dari list, log tercatat ✅ |
| 5 | Search & filter | Ketik kata kunci di search bar | Tabel terfilter secara real-time ✅ |
| 6 | Checkout aset | Isi form peminjaman, submit | Stok berkurang, transaksi tercatat ✅ |
| 7 | Pengembalian barang | Klik "Kembalikan Barang" | Stok bertambah, status berubah "Selesai" ✅ |
| 8 | History log | Lakukan operasi CRUD | Log tercatat otomatis dengan detail mutasi ✅ |
| 9 | Toggle kondisi | Klik badge kondisi di tabel list | Status berubah New ↔ Used, log tercatat ✅ |
| 10 | Modal detail | Klik ikon mata pada baris aset | Modal terbuka dengan informasi lengkap ✅ |

#### 4.7.3 Pengujian Deployment (Docker)

| Test Case | Perintah | Hasil |
|-----------|----------|-------|
| Build & start semua container | `docker compose up -d --build` | Tiga container berjalan tanpa error ✅ |
| Akses frontend via browser | `http://<server>:3005` | Dashboard ditampilkan dengan benar ✅ |
| Akses API backend | `http://<server>:5000/api/assets` | Response JSON valid ✅ |
| Restart otomatis setelah crash | `docker restart backend_aset_it` | Container kembali online ✅ |
| Persistensi data setelah restart | Restart container `db`, cek data | Data tetap ada (volume `pgdata`) ✅ |

---

## BAB V: PENUTUP

### 5.1 Kesimpulan

Berdasarkan keseluruhan proses perancangan, implementasi, dan pengujian yang telah dilakukan, berikut adalah kesimpulan dari proyek **Sistem Informasi Manajemen Aset IT — PLTGU Cilegon**:

1. **Digitalisasi berhasil dicapai** — Sistem inventaris aset IT yang sebelumnya dikelola secara manual menggunakan spreadsheet kini telah sepenuhnya terdigitalisasi menjadi aplikasi web modern berbasis React.js, Express.js, dan PostgreSQL, dengan antarmuka dashboard yang intuitif dan profesional.

2. **Fitur CRUD lengkap berfungsi dengan baik** — Seluruh operasi manajemen data (Create, Read, Update, Delete) untuk empat entitas utama (Assets, Users, Transactions, Inventory History) telah berhasil diimplementasikan dan diuji melalui 16 endpoint RESTful API yang saling terintegrasi.

3. **Alur transaksi terotomatisasi** — Fitur peminjaman dan pengambilan aset telah berhasil mengautomasi proses: validasi ketersediaan stok, auto-registrasi pengguna baru, pengurangan kuantitas stok secara real-time, serta pencatatan audit trail ke tabel `inventory_history` — semuanya terjadi dalam satu alur transaksi yang seamless.

4. **Audit trail komprehensif** — Setiap perubahan yang terjadi pada inventaris tercatat secara kronologis dalam History Log, lengkap dengan informasi tipe operasi, detail mutasi stok (positif/negatif), waktu kejadian, dan pelaku — memenuhi kebutuhan akuntabilitas dan penelusuran (*traceability*).

5. **Deployment portabel dan mandiri** — Melalui kontainerisasi Docker Compose, seluruh stack aplikasi (database, backend API, frontend web) dapat di-deploy, di-*rebuild*, dan di-*replicate* ke server manapun dengan satu perintah tunggal (`docker compose up -d --build`), tanpa kekhawatiran konflik dependensi atau perbedaan konfigurasi lingkungan.

### 5.2 Saran Pengembangan

Untuk meningkatkan fungsionalitas dan keamanan sistem di masa mendatang, berikut beberapa saran pengembangan:

1. **Implementasi autentikasi dan otorisasi** — Menambahkan sistem login berbasis JWT (JSON Web Token) dengan pembagian peran (*role-based access control*), misalnya Admin IT (full access) dan Karyawan (hanya bisa mengajukan peminjaman).

2. **Migrasi database ke server terpusat** — Memindahkan database PostgreSQL dari container lokal ke server database terdedikasi (contoh: IP `10.8.140.69`) untuk mendukung skalabilitas dan redundansi data (sesuai rencana migrasi yang telah didokumentasikan).

3. **Fitur ekspor laporan** — Menambahkan kemampuan mengekspor data aset dan transaksi ke format PDF atau Excel untuk kebutuhan pelaporan manajemen dan audit berkala.

4. **Notifikasi dan pengingat** — Mengintegrasikan sistem notifikasi (email atau WhatsApp API) untuk mengingatkan peminjam agar mengembalikan perangkat sesuai tenggat waktu.

5. **Barcode/QR Code scanning** — Mengimplementasikan fitur pemindaian kode batang atau QR code pada perangkat fisik untuk mempercepat proses pencarian dan identifikasi aset.

6. **Dashboard analitik lanjutan** — Menambahkan visualisasi grafik (chart) untuk tren peminjaman, distribusi aset per kategori, dan laporan utilisasi perangkat dari waktu ke waktu.

7. **Responsive mobile layout** — Mengoptimalkan antarmuka untuk perangkat mobile sehingga staf lapangan dapat melakukan pengecekan inventaris langsung dari smartphone.

---

## DAFTAR PUSTAKA

1. React Documentation — https://react.dev/
2. Express.js Documentation — https://expressjs.com/
3. PostgreSQL Documentation — https://www.postgresql.org/docs/15/
4. Vite.js Documentation — https://vite.dev/
5. Docker Documentation — https://docs.docker.com/
6. Node.js Documentation — https://nodejs.org/docs/
7. MDN Web Docs — https://developer.mozilla.org/
8. Nginx Documentation — https://nginx.org/en/docs/

---

## LAMPIRAN

### Lampiran A: Struktur Direktori Proyek

```
Asset-Management-IT/
├── .env                          # Environment variables (DB credentials)
├── .gitignore                    # Git ignore rules
├── docker-compose.yml            # Orkestrasi Docker (3 services)
├── README.md                     # Dokumentasi singkat
├── task.md                       # Panduan migrasi database
├── tracker.md                    # Panduan deployment server
│
├── backend/                      # APPLICATION TIER
│   ├── Dockerfile                # Container config (node:20-alpine)
│   ├── package.json              # Dependencies (express, pg, cors, dotenv)
│   └── server.js                 # REST API server (16 endpoints)
│
└── Dashboard Aset Management IT/ # PRESENTATION TIER
    ├── Dockerfile                # Multi-stage build (node → nginx)
    ├── nginx.conf                # Nginx reverse proxy config
    ├── package.json              # Dependencies (react, vite)
    ├── vite.config.js            # Vite build configuration
    ├── index.html                # SPA entry point
    │
    └── src/
        ├── main.jsx              # React DOM render entry
        ├── App.jsx               # Root component (routing + modal + toast)
        ├── style.css             # Global imports
        │
        ├── components/
        │   ├── Sidebar.jsx       # Navigation sidebar (7 menu items)
        │   ├── DashboardPage.jsx # Stats + Quick Actions + Recent Activity
        │   ├── AssetListPage.jsx # Data table + Search + Filter + Sort
        │   ├── AssetFormPage.jsx # Create/Edit form (3 sections)
        │   ├── AssetCheckoutPage.jsx # Loan/Checkout form
        │   ├── TransactionsPage.jsx  # Transaction monitoring table
        │   ├── HistoryLogPage.jsx    # Audit trail timeline
        │   ├── UsersPage.jsx         # User management table
        │   └── Modals.jsx            # Detail view + Delete confirmation
        │
        ├── state/
        │   ├── store.js          # Central state manager (Observer pattern)
        │   └── useAssetStore.js  # Custom React hook (bridge layer)
        │
        └── styles/
            ├── design-tokens.css # CSS custom properties / variables
            └── components.css    # Component-level styles
```

### Lampiran B: Teknologi dan Versi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Node.js | 20 LTS (Alpine) | JavaScript runtime |
| React.js | 19.2.7 | UI library (front-end) |
| React DOM | 19.2.7 | DOM rendering |
| Vite.js | 8.1.1 | Build tool & dev server |
| @vitejs/plugin-react | 6.0.3 | React integration for Vite |
| Express.js | 5.2.1 | Web framework (back-end) |
| PostgreSQL | 15 (Alpine) | Relational database |
| pg (node-postgres) | 8.22.0 | PostgreSQL client for Node.js |
| cors | 2.8.6 | CORS middleware |
| dotenv | 17.4.2 | Environment variable loader |
| Nginx | 1.27 (Alpine) | Web server / reverse proxy |
| Docker | Latest | Containerization platform |
| Docker Compose | Latest | Multi-container orchestration |

---

> *Dokumen ini disusun sebagai laporan resmi pengembangan proyek Sistem Informasi Manajemen Aset IT untuk lingkungan operasional PT PLN Nusantara Power — Unit Pembangkitan PLTGU Cilegon.*
