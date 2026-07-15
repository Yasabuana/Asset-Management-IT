/**
 * ============================================================================
 * Enterprise IT Asset Management - State Management & Orchestrator (`store.js`)
 * ============================================================================
 * Implements the core state objects, localStorage persistence, and the integrated
 * flowchart loop: ("Simpan ke" -> "Catat History Log" -> "Update Table Inventaris")
 */

const ASSETS_STORAGE_KEY = 'it_assets_db_v1';
const LOGS_STORAGE_KEY = 'it_logs_db_v1';
const USERS_STORAGE_KEY = 'it_users_db_v1';
const TRANSACTIONS_STORAGE_KEY = 'it_transactions_db_v1';

// 1. Initial Assets (ASSETS table in ERD)
const INITIAL_ASSETS = [
  {
    id: 'AST-LPT-001',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 Laptop',
    brand: 'Lenovo',
    category: 'Laptop & PC',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 8,
    serialNumber: '5CD3082X9M',
    assignedTo: 'Budi Santoso - Lead DevOps',
    location: 'HQ Level 4 - Tech Bay 12',
    purchaseDate: '2025-01-15',
    price: 24500000,
    specs: 'Intel Core i7-1360P, 32GB DDR5, 1TB NVMe SSD, 14" WUXGA IPS',
    gambar_url: ''
  },
  {
    id: 'AST-LPT-002',
    name: 'Apple MacBook Pro M3 Pro 16"',
    brand: 'Apple',
    category: 'Laptop & PC',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 5,
    serialNumber: 'FVFG92K0Q6L4',
    assignedTo: 'Sarah Jenkins - Senior UX Designer',
    location: 'HQ Level 3 - Creative Studio',
    purchaseDate: '2025-03-10',
    price: 42000000,
    specs: 'Apple M3 Pro 12-Core, 36GB Unified RAM, 1TB SSD, Liquid Retina XDR',
    gambar_url: ''
  },
  {
    id: 'AST-SRV-001',
    name: 'Supermicro SuperServer 2029U Rack Server',
    brand: 'Supermicro',
    category: 'Server & Cloud Physical',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 2,
    serialNumber: 'MXQ21508RJ',
    assignedTo: 'IT Infrastructure Team',
    location: 'Data Center HQ - Rack Bay 04',
    purchaseDate: '2024-06-20',
    price: 185000000,
    specs: 'Dual Intel Xeon Gold 6330, 256GB ECC RAM, 8x 3.84TB SAS SSD, Dual Redundant PSU',
    gambar_url: ''
  },
  {
    id: 'AST-SRV-002',
    name: 'Dell PowerEdge R750xs Enterprise Server',
    brand: 'Dell',
    category: 'Server & Cloud Physical',
    status: 'Maintenance',
    kondisi: 'Perbaikan Rutin',
    quantity: 3,
    serialNumber: '8H7T9M3',
    assignedTo: 'Cloud Operations & SRE',
    location: 'Data Center HQ - Rack Bay 05',
    purchaseDate: '2024-08-14',
    price: 160000000,
    specs: 'Intel Xeon Silver 4314, 128GB RAM, 4x 2TB NVMe Enterprise, iDRAC9 Enterprise',
    gambar_url: ''
  },
  {
    id: 'AST-NET-001',
    name: 'Cisco Catalyst 9300 48-Port PoE+ Switch',
    brand: 'Cisco',
    category: 'Networking',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 6,
    serialNumber: 'FCW2345L09P',
    assignedTo: 'Network Engineering Team',
    location: 'Server Room HQ Level 2 - Rack A',
    purchaseDate: '2024-11-05',
    price: 68000000,
    specs: '48 Ports 10/100/1000 PoE+, 4x 10G SFP+ Uplink Module, Network Advantage License',
    gambar_url: ''
  },
  {
    id: 'AST-NET-002',
    name: 'Fortinet FortiGate 100F Next-Gen Firewall',
    brand: 'Fortinet',
    category: 'Networking',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 4,
    serialNumber: 'FG100F3G21008452',
    assignedTo: 'Cyber Security Operations',
    location: 'Server Room HQ Level 1 - Perimeter Gateway',
    purchaseDate: '2025-02-01',
    price: 95000000,
    specs: '22x GE RJ45 ports, 4x SFP slots, Dual Power Supplies, 3-Year UTP Security Bundle',
    gambar_url: ''
  },
  {
    id: 'AST-LPT-003',
    name: 'Asus ProArt StudioBook 16 Mobile Workstation',
    brand: 'Asus',
    category: 'Laptop & PC',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 4,
    serialNumber: '5CG3410PLK',
    assignedTo: 'Andi Pratama - Lead Data Scientist',
    location: 'Branch Office Bandung - Floor 2',
    purchaseDate: '2025-04-12',
    price: 38000000,
    specs: 'Intel Core i9-13950HX, NVIDIA RTX 3500 Ada 12GB, 64GB DDR5, 2TB SSD',
    gambar_url: ''
  },
  {
    id: 'AST-MON-001',
    name: 'LG UltraFine Ergo 27" QHD Monitor',
    brand: 'LG',
    category: 'Monitor & Peripherals',
    status: 'Active',
    kondisi: 'Baik',
    quantity: 15,
    serialNumber: '6CM2091J7Y',
    assignedTo: 'Sarah Jenkins - Senior UX Designer',
    location: 'HQ Level 3 - Creative Studio Desk 04',
    purchaseDate: '2025-03-10',
    price: 6800000,
    specs: '2560 x 1440 QHD, 99% sRGB/DCI-P3, USB-C 100W Power Delivery, Ergonomic Stand',
    gambar_url: ''
  },
  {
    id: 'AST-NET-003',
    name: 'Aruba AP-515 Dual-Radio Wi-Fi 6 Access Point',
    brand: 'Aruba',
    category: 'Networking',
    status: 'In Storage',
    kondisi: 'Baik (Siap Pakai)',
    quantity: 12,
    serialNumber: 'CNK2K9Z3P1',
    assignedTo: 'IT Logistics & Spare Pool',
    location: 'IT Warehouse HQ - Bin C-12',
    purchaseDate: '2025-05-18',
    price: 12500000,
    specs: '802.11ax 4x4:4 MU-MIMO, Integrated Bluetooth 5 and Zigbee radio, 2.5GbE Smart Rate Port',
    gambar_url: ''
  },
  {
    id: 'AST-SRV-003',
    name: 'NetApp AFF A250 SAN Storage System',
    brand: 'NetApp',
    category: 'Server & Cloud Physical',
    status: 'Retired',
    kondisi: 'Non-aktif',
    quantity: 1,
    serialNumber: '2S6144089H',
    assignedTo: 'IT Infrastructure Team (Decommissioned)',
    location: 'Data Center HQ - Decommission Bay 01',
    purchaseDate: '2021-10-15',
    price: 145000000,
    specs: 'Dual Controller 16Gb Fibre Channel, 12x 4TB LFF SAS HDD (Array End-of-Support)',
    gambar_url: ''
  }
];

// 2. Initial Users (USERS table in ERD)
const INITIAL_USERS = [
  { id: 1, nama: 'Budi Santoso - Lead DevOps', role: 'DevOps & Cloud' },
  { id: 2, nama: 'Sarah Jenkins - Senior UX Designer', role: 'Product Design' },
  { id: 3, nama: 'Andi Pratama - Lead Data Scientist', role: 'Data Analytics' },
  { id: 4, nama: 'Rina Wijaya - HR Manager', role: 'Human Resources' },
  { id: 5, nama: 'Hendra Gunawan - Network Specialist', role: 'Infrastructure' },
  { id: 99, nama: 'Admin Central IT', role: 'System Administrator' }
];

// 3. Initial Transactions (TRANSACTIONS table in ERD)
const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-20260715-01',
    asset_id: 'AST-LPT-001',
    user_id: 1,
    tipe_request: 'Peminjaman Sementara',
    jumlah: 1,
    status: 'Approved (Dipinjam)',
    tanggal_request: '2026-07-15 08:30:00',
    tanggal_approval: '2026-07-15 08:35:00',
    keterangan: 'Peminjaman laptop untuk keperluan deployment server client di site luar kota.'
  },
  {
    id: 'TRX-20260715-02',
    asset_id: 'AST-NET-001',
    user_id: 5,
    tipe_request: 'Pengambilan Habis Pakai',
    jumlah: 2,
    status: 'Completed',
    tanggal_request: '2026-07-14 14:10:00',
    tanggal_approval: '2026-07-14 14:20:00',
    keterangan: 'Pengambilan switch tambahan untuk ekspansi jaringan lantai 3.'
  }
];

// 2. Initial 3 Activity Logs
const INITIAL_LOGS = [
  {
    id: 'LOG-1001',
    timestamp: '2026-07-15 08:00:12',
    actionType: 'SYSTEM',
    assetId: 'SYSTEM',
    assetName: 'Core IT Asset Database',
    description: 'Sistem Manajemen Aset IT berhasil dimuat dengan 10 aset inventaris awal dan siap dijalankan oleh Admin.'
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-07-15 08:05:45',
    actionType: 'UPDATE',
    assetId: 'AST-SRV-002',
    assetName: 'Dell PowerEdge R750xs Enterprise Server',
    description: 'Status aset diubah dari "Active" menjadi "Maintenance" oleh Admin untuk pemeliharaan rutin firmware & pembaruan iDRAC.'
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-07-15 08:12:30',
    actionType: 'CREATE',
    assetId: 'AST-LPT-002',
    assetName: 'Apple MacBook Pro M3 Pro 16"',
    description: 'Aset baru berhasil ditambahkan ke inventaris dan ditugaskan kepada Sarah Jenkins (Senior UX Designer).'
  }
];

// State Store Singleton
class Store {
  constructor() {
    this.assetsState = [];
    this.logsState = [];
    this.usersState = [];
    this.transactionsState = [];
    this.listeners = [];
    
    // Filtering and search criteria state
    this.filterState = {
      searchQuery: '',
      category: 'ALL',
      status: 'ALL',
      location: 'ALL',
      sortBy: 'id_asc'
    };

    this.loadFromStorage();
  }

  // Load from localStorage or initialize with defaults
  loadFromStorage() {
    try {
      const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

      if (storedAssets && storedLogs && storedUsers && storedTransactions) {
        this.assetsState = JSON.parse(storedAssets);
        this.logsState = JSON.parse(storedLogs);
        this.usersState = JSON.parse(storedUsers);
        this.transactionsState = JSON.parse(storedTransactions);
      } else {
        this.resetToInitialData();
      }
    } catch (err) {
      console.error('Error reading localStorage, initializing fallback defaults:', err);
      this.resetToInitialData();
    }
  }

  // Save all 4 states to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(this.assetsState));
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logsState));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.usersState));
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(this.transactionsState));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }

  // Subscribe UI components to automatic state updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all subscribed components (`renderAssetTable()`, stats cards, logs feed, transactions)
  notify() {
    this.listeners.forEach(listener => listener(this.assetsState, this.logsState, this.filterState, this.usersState, this.transactionsState));
  }

  /**
   * ============================================================================
   * INTEGRATED LOGIC CYCLE ORCHESTRATOR: `saveAndRefresh()`
   * Flow: ("Simpan ke" -> "Catat History Log" -> "Update Table Inventaris")
   * ============================================================================
   */
  saveAndRefresh(actionType, assetDetails) {
    // 1) Update assetsState inside localStorage
    this.saveToStorage();

    // 2) "Catat History Log": Automatically call addHistoryLog to append timestamped log
    if (actionType && assetDetails) {
      this.addHistoryLog(actionType, assetDetails);
    }

    // 3) "Update Table Inventaris & Dashboard Stats": Re-run notify which triggers `renderAssetTable()`
    this.notify();
  }

  /**
   * "Catat History Log" Function
   */
  addHistoryLog(actionType, assetDetails) {
    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    let description = '';
    if (actionType === 'CREATE') {
      description = `Aset baru [${assetDetails.id}] "${assetDetails.name}" (${assetDetails.category}) ditambahkan oleh Admin. Lokasi: ${assetDetails.location}. Stok awal: ${assetDetails.quantity || 1} unit.`;
    } else if (actionType === 'UPDATE') {
      description = `Aset [${assetDetails.id}] "${assetDetails.name}" berhasil diperbarui. Status saat ini: ${assetDetails.status}, Stok: ${assetDetails.quantity || 1} unit.`;
    } else if (actionType === 'DELETE') {
      description = `Aset [${assetDetails.id}] "${assetDetails.name}" telah dihapus permanen dari inventaris oleh Admin.`;
    } else if (actionType === 'STATUS_CHANGE') {
      description = `Status aset [${assetDetails.id}] "${assetDetails.name}" diubah cepat menjadi "${assetDetails.status}".`;
    } else if (actionType === 'CHECKOUT') {
      description = `Transaksi ${assetDetails.tipe_request || 'Peminjaman/Pengambilan'}: ${assetDetails.jumlah} unit [${assetDetails.id}] "${assetDetails.name}" oleh ${assetDetails.borrowerName || 'Pengguna'}. Keterangan: ${assetDetails.alasan || '-'}`;
    } else if (actionType === 'RETURN') {
      description = `Pengembalian barang pinjaman: +${assetDetails.jumlah} unit [${assetDetails.id}] "${assetDetails.name}". Keterangan: ${assetDetails.alasan || 'Selesai'}`;
    }

    const newLog = {
      id: 'LOG-' + Date.now(),
      timestamp,
      actionType,
      tipe_transaksi: actionType,
      assetId: assetDetails.id || 'N/A',
      asset_id: assetDetails.id || 'N/A',
      assetName: assetDetails.name || 'Unknown Asset',
      jumlah_perubahan: assetDetails.jumlah_perubahan || 0,
      alasan: assetDetails.alasan || description,
      admin_id: assetDetails.admin_id || 99,
      description
    };

    // Prepend to logsState so newest is at the top
    this.logsState.unshift(newLog);
    this.saveToStorage();
  }

  // TRANSACTIONS ERD: Submit Borrow/Checkout request
  submitTransaction(txData) {
    const asset = this.assetsState.find(a => a.id === txData.asset_id);
    if (!asset) {
      return { success: false, message: 'Aset tidak ditemukan dalam database.' };
    }

    const jumlah = Number(txData.jumlah) || 1;
    if (asset.quantity !== undefined && asset.quantity < jumlah) {
      return { success: false, message: `Stok aset tidak mencukupi! Sisa stok saat ini hanya ${asset.quantity} unit.` };
    }

    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    // Check or register user from direct form filling
    let userId = Number(txData.user_id) || 1;
    let borrowerName = txData.user_nama || '';
    let borrowerRole = txData.user_role || '';

    if (borrowerName) {
      const existingUser = this.usersState.find(u => u.nama.toLowerCase() === borrowerName.toLowerCase());
      if (existingUser) {
        userId = existingUser.id;
        borrowerRole = borrowerRole || existingUser.role;
      } else {
        userId = Date.now();
        borrowerRole = borrowerRole || 'Karyawan / Divisi Umum';
        this.usersState.push({
          id: userId,
          nama: borrowerName,
          role: borrowerRole
        });
      }
    } else {
      const userObj = this.usersState.find(u => u.id === userId);
      borrowerName = userObj ? userObj.nama : `User ID ${userId}`;
      borrowerRole = userObj ? userObj.role : '-';
    }

    const newTx = {
      id: 'TRX-' + Date.now(),
      asset_id: txData.asset_id,
      user_id: userId,
      user_nama: borrowerName,
      user_role: borrowerRole,
      tipe_request: txData.tipe_request || 'Peminjaman Sementara',
      jumlah,
      status: txData.tipe_request === 'Peminjaman Sementara' ? 'Approved (Dipinjam)' : 'Completed',
      tanggal_request: timestamp,
      tanggal_approval: timestamp,
      keterangan: txData.keterangan || '-'
    };

    // Update TRANSACTIONS table
    this.transactionsState.unshift(newTx);

    // Update ASSETS table (reduce quantity)
    asset.quantity = Math.max(0, (asset.quantity || 1) - jumlah);
    if (txData.tipe_request === 'Peminjaman Sementara' && asset.quantity === 0) {
      asset.status = 'In Storage';
    }

    // Update assignedTo if needed
    if (txData.tipe_request === 'Peminjaman Sementara') {
      asset.assignedTo = `${borrowerName} (${newTx.tipe_request})`;
    }

    // Save and log to INVENTORY_HISTORY
    this.saveAndRefresh('CHECKOUT', {
      ...asset,
      tipe_request: newTx.tipe_request,
      jumlah,
      borrowerName,
      jumlah_perubahan: -jumlah,
      alasan: newTx.keterangan,
      admin_id: userId
    });

    return { success: true, transaction: newTx };
  }

  // TRANSACTIONS ERD: Process Return (Check-in)
  processReturn(transactionId, returnNotes) {
    const tx = this.transactionsState.find(t => t.id === transactionId);
    if (!tx) return { success: false, message: 'Transaksi tidak ditemukan.' };
    if (tx.status === 'Returned (Selesai)') return { success: false, message: 'Transaksi ini sudah selesai/dikembalikan.' };

    tx.status = 'Returned (Selesai)';

    const asset = this.assetsState.find(a => a.id === tx.asset_id);
    if (asset) {
      asset.quantity = (asset.quantity || 0) + tx.jumlah;
      if (asset.status === 'In Storage' && asset.quantity > 0) {
        asset.status = 'Active';
      }
    }

    this.saveAndRefresh('RETURN', {
      ...(asset || { id: tx.asset_id, name: 'Aset Inventaris' }),
      jumlah: tx.jumlah,
      jumlah_perubahan: +tx.jumlah,
      alasan: returnNotes || 'Barang pinjaman telah dikembalikan ke gudang IT.',
      admin_id: 99
    });

    return { success: true };
  }

  // Add or Update Asset (`handleFormSubmit` calls this)
  createOrUpdateAsset(assetData, isEditing) {
    if (isEditing) {
      const index = this.assetsState.findIndex(a => a.id === assetData.id);
      if (index !== -1) {
        this.assetsState[index] = { ...this.assetsState[index], ...assetData };
        this.saveAndRefresh('UPDATE', this.assetsState[index]);
        return { success: true, action: 'UPDATE', asset: this.assetsState[index] };
      }
      return { success: false, message: 'Aset tidak ditemukan saat proses update.' };
    } else {
      // Create new
      const newId = assetData.id && assetData.id.trim() !== '' 
        ? assetData.id.trim() 
        : `AST-${assetData.category === 'Laptop & PC' ? 'LPT' : assetData.category === 'Server & Cloud Physical' ? 'SRV' : 'NET'}-${Math.floor(100 + Math.random() * 900)}`;
      
      // Check duplicate ID
      if (this.assetsState.some(a => a.id.toLowerCase() === newId.toLowerCase())) {
        return { success: false, message: `Kode Aset "${newId}" sudah ada dalam database!` };
      }

      const newAsset = {
        ...assetData,
        id: newId,
        price: Number(assetData.price) || 0
      };

      this.assetsState.unshift(newAsset);
      this.saveAndRefresh('CREATE', newAsset);
      return { success: true, action: 'CREATE', asset: newAsset };
    }
  }

  // Delete Asset
  deleteAssetById(id) {
    const assetToDelete = this.assetsState.find(a => a.id === id);
    if (!assetToDelete) return false;

    this.assetsState = this.assetsState.filter(a => a.id !== id);
    this.saveAndRefresh('DELETE', assetToDelete);
    return true;
  }

  // Quick status toggle directly from table row
  toggleAssetStatus(id, newStatus) {
    const asset = this.assetsState.find(a => a.id === id);
    if (asset && asset.status !== newStatus) {
      asset.status = newStatus;
      this.saveAndRefresh('STATUS_CHANGE', asset);
      return true;
    }
    return false;
  }

  // Filter & Search helper
  setFilters(newFilters) {
    this.filterState = { ...this.filterState, ...newFilters };
    this.notify();
  }

  // Get filtered and sorted assets for rendering
  getFilteredAssets() {
    let result = [...this.assetsState];

    // 1. Search filter
    if (this.filterState.searchQuery.trim() !== '') {
      const q = this.filterState.searchQuery.toLowerCase().trim();
      result = result.filter(a => 
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.serialNumber.toLowerCase().includes(q) ||
        a.assignedTo.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }

    // 2. Category tab/dropdown filter
    if (this.filterState.category !== 'ALL') {
      result = result.filter(a => a.category === this.filterState.category);
    }

    // 3. Status filter
    if (this.filterState.status !== 'ALL') {
      result = result.filter(a => a.status === this.filterState.status);
    }

    // 4. Location filter
    if (this.filterState.location !== 'ALL') {
      result = result.filter(a => a.location.toLowerCase().includes(this.filterState.location.toLowerCase()));
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (this.filterState.sortBy) {
        case 'id_asc': return a.id.localeCompare(b.id);
        case 'id_desc': return b.id.localeCompare(a.id);
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'price_desc': return b.price - a.price;
        case 'price_asc': return a.price - b.price;
        case 'date_desc': return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        case 'date_asc': return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        default: return 0;
      }
    });

    return result;
  }

  // Reset data to initial 4 tables ERD
  resetToInitialData() {
    this.assetsState = JSON.parse(JSON.stringify(INITIAL_ASSETS));
    this.logsState = JSON.parse(JSON.stringify(INITIAL_LOGS));
    this.usersState = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.transactionsState = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.saveToStorage();
    this.notify();
  }

  // Clear all logs or filter logs
  clearLogs() {
    this.logsState = [];
    this.saveToStorage();
    this.notify();
  }
}

// Export single instance of store
export const store = new Store();

// Helper to format IDR currency
export function formatIDR(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}
