/**
 * ============================================================================
 * Enterprise IT Asset Management - State Management & Orchestrator (`store.js`)
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:5000/api';

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

    this.fetchDataFromAPI();
  }

  async fetchDataFromAPI() {
    try {
      const assetRes = await fetch(`${API_BASE_URL}/assets`);
      if (assetRes.ok) this.assetsState = await assetRes.json();

      const userRes = await fetch(`${API_BASE_URL}/users`);
      if (userRes.ok) this.usersState = await userRes.json();

      const trxRes = await fetch(`${API_BASE_URL}/transactions`);
      if (trxRes.ok) this.transactionsState = await trxRes.json();

      const logsRes = await fetch(`${API_BASE_URL}/inventory_history`);
      if (logsRes.ok) this.logsState = await logsRes.json();

      this.notify();
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.assetsState, this.logsState, this.filterState, this.usersState, this.transactionsState));
  }

  async addHistoryLog(actionType, assetDetails) {
    try {
      const newLog = {
        asset_id: actionType === 'DELETE' ? null : assetDetails.id,
        tipe_transaksi: actionType,
        jumlah_perubahan: assetDetails.jumlah_perubahan || 0,
        alasan: actionType === 'DELETE' ? `Penghapusan aset: ${assetDetails.nama || assetDetails.id}` : (assetDetails.alasan || actionType),
        admin_id: assetDetails.admin_id || null
      };

      const res = await fetch(`${API_BASE_URL}/inventory_history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      if (res.ok) {
        const savedLog = await res.json();
        this.logsState.unshift(savedLog);
        this.notify();
      }
    } catch (e) {
      console.error("Error adding history log", e);
    }
  }

  async submitTransaction(txData) {
    const asset = this.assetsState.find(a => String(a.id) === String(txData.asset_id));
    if (!asset) return { success: false, message: 'Aset tidak ditemukan dalam database.' };

    const jumlah = Number(txData.jumlah) || 1;
    if (asset.quantity !== undefined && asset.quantity < jumlah) {
      return { success: false, message: `Stok aset tidak mencukupi! Sisa stok saat ini hanya ${asset.quantity} unit.` };
    }

    // Check or register user
    let userId = Number(txData.user_id) || 1;
    let borrowerName = txData.user_nama || '';
    let borrowerRole = txData.user_role || '';

    if (borrowerName) {
      const existingUser = this.usersState.find(u => u.nama.toLowerCase() === borrowerName.toLowerCase());
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const newUser = { nama: borrowerName, role: borrowerRole || 'Karyawan' };
        const userRes = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        if (userRes.ok) {
           const savedUser = await userRes.json();
           userId = savedUser.id;
           this.usersState.push(savedUser);
        } else {
           userId = 99; // Fallback
        }
      }
    }

    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const newTx = {
      asset_id: txData.asset_id,
      user_id: userId,
      tipe_request: txData.tipe_request || 'Peminjaman Sementara',
      jumlah,
      status: txData.tipe_request === 'Peminjaman Sementara' ? 'Approved (Dipinjam)' : 'Completed',
      keterangan: txData.keterangan || '-'
    };

    try {
      const txRes = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      });
      if (!txRes.ok) throw new Error("Gagal membuat transaksi");
      
      const savedTx = await txRes.json();
      this.transactionsState.unshift(savedTx);

      asset.quantity = Math.max(0, (asset.quantity || 1) - jumlah);
      // Kondisi tidak diubah otomatis saat barang dipinjam

      const updateRes = await fetch(`${API_BASE_URL}/assets/${asset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset)
      });
      
      if(updateRes.ok) {
        const updatedAsset = await updateRes.json();
        const index = this.assetsState.findIndex(a => String(a.id) === String(asset.id));
        this.assetsState[index] = updatedAsset;
      }

      await this.addHistoryLog('CHECKOUT', {
        ...asset,
        jumlah_perubahan: -jumlah,
        alasan: newTx.keterangan,
        admin_id: userId
      });

      this.notify();
      return { success: true, transaction: savedTx };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Gagal menghubungi server' };
    }
  }

  async processReturn(transactionId, returnNotes) {
    const tx = this.transactionsState.find(t => String(t.id) === String(transactionId));
    if (!tx) return { success: false, message: 'Transaksi tidak ditemukan.' };
    if (tx.status === 'Returned (Selesai)') return { success: false, message: 'Transaksi ini sudah selesai/dikembalikan.' };

    tx.status = 'Returned (Selesai)';
    
    try {
      await fetch(`${API_BASE_URL}/transactions/${tx.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });

      const asset = this.assetsState.find(a => String(a.id) === String(tx.asset_id));
      if (asset) {
        asset.quantity = (asset.quantity || 0) + tx.jumlah;
        // Setelah dikembalikan, barang otomatis menjadi Used (Bekas)
        asset.kondisi = 'Used';
        await fetch(`${API_BASE_URL}/assets/${asset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(asset)
        });
        
        await this.addHistoryLog('RETURN', {
          id: asset.id,
          jumlah_perubahan: tx.jumlah,
          alasan: returnNotes || 'Barang pinjaman telah dikembalikan ke gudang IT.',
          admin_id: 99
        });
      }
      this.notify();
      return { success: true };
    } catch(e) {
       console.error(e);
       return { success: false, message: 'Gagal menghubungi server' };
    }
  }

  async createOrUpdateAsset(assetData, isEditing) {
    try {
      if (isEditing) {
        const res = await fetch(`${API_BASE_URL}/assets/${assetData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assetData)
        });
        if (!res.ok) throw new Error('Aset tidak ditemukan atau gagal update.');
        const updatedAsset = await res.json();
        
        const index = this.assetsState.findIndex(a => String(a.id) === String(assetData.id));
        if (index !== -1) {
          this.assetsState[index] = updatedAsset;
          await this.addHistoryLog('UPDATE', updatedAsset);
          this.notify();
          return { success: true, action: 'UPDATE', asset: updatedAsset };
        }
      } else {
        const newAsset = { ...assetData };
        delete newAsset.id; // Let database auto-increment generating ID
        delete newAsset.created_at; 
        const res = await fetch(`${API_BASE_URL}/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAsset)
        });
        if (!res.ok) throw new Error('Gagal menambah aset.');
        const savedAsset = await res.json();

        this.assetsState.unshift(savedAsset);
        await this.addHistoryLog('CREATE', savedAsset);
        this.notify();
        return { success: true, action: 'CREATE', asset: savedAsset };
      }
    } catch (e) {
       console.error(e);
       return { success: false, message: e.message };
    }
  }

  async deleteAssetById(id) {
    try {
      const assetToDelete = this.assetsState.find(a => String(a.id) === String(id));
      if (!assetToDelete) return false;

      const res = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) return false;

      this.assetsState = this.assetsState.filter(a => a.id !== id);
      await this.addHistoryLog('DELETE', assetToDelete);
      this.notify();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async toggleAssetStatus(id, newStatus) {
    const asset = this.assetsState.find(a => String(a.id) === String(id));
    if (asset && asset.kondisi !== newStatus) {
      asset.kondisi = newStatus;
      try {
        await fetch(`${API_BASE_URL}/assets/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(asset)
        });
        await this.addHistoryLog('STATUS_CHANGE', asset);
        this.notify();
        return true;
      } catch(e) {
        console.error(e);
      }
    }
    return false;
  }

  setFilters(newFilters) {
    this.filterState = { ...this.filterState, ...newFilters };
    this.notify();
  }

  getFilteredAssets() {
    let result = [...this.assetsState];

    if (this.filterState.searchQuery.trim() !== '') {
      const q = this.filterState.searchQuery.toLowerCase().trim();
      result = result.filter(a => 
        (a.id || '').toLowerCase().includes(q) ||
        (a.nama || '').toLowerCase().includes(q) ||
        (a.serial_number || '').toLowerCase().includes(q) ||
        (a.lokasi || '').toLowerCase().includes(q) ||
        (a.kategori || '').toLowerCase().includes(q)
      );
    }

    if (this.filterState.category !== 'ALL') {
      result = result.filter(a => a.kategori === this.filterState.category);
    }

    if (this.filterState.status !== 'ALL') {
      result = result.filter(a => a.kondisi === this.filterState.status);
    }

    if (this.filterState.location !== 'ALL') {
      result = result.filter(a => (a.lokasi || '').toLowerCase().includes(this.filterState.location.toLowerCase()));
    }

    result.sort((a, b) => {
      switch (this.filterState.sortBy) {
        case 'id_asc': return (a.id || 0) - (b.id || 0);
        case 'id_desc': return (b.id || 0) - (a.id || 0);
        case 'name_asc': return (a.nama || '').localeCompare(b.nama || '');
        case 'name_desc': return (b.nama || '').localeCompare(a.nama || '');
        default: return 0;
      }
    });

    return result;
  }

  async clearLogs() {
    this.logsState = [];
    this.notify();
  }
}

export const store = new Store();

export function formatIDR(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}
