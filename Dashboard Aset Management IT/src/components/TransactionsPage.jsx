import React, { useState } from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function TransactionsPage({ onNavigate, showToast }) {
  const { transactions, assets, users, store } = useAssetStore();
  const [filterType, setFilterType] = useState('ALL');

  const filteredTransactions = filterType === 'ALL'
    ? transactions
    : transactions.filter(t => t.tipe_request === filterType);

  const handleReturnItem = async (tx) => {
    if (window.confirm(`Apakah Anda yakin ingin mengembalikan ${tx.jumlah} unit [${tx.asset_id}] ke stok gudang?`)) {
      const result = await store.processReturn(tx.id);
      if (result.success) {
        showToast(`Transaksi ${tx.id} selesai. Stok barang telah dikembalikan.`, 'success');
      } else {
        showToast(result.message || 'Gagal mengembalikan barang.', 'danger');
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status && status.includes('Dipinjam')) {
      return (
        <span className="status-badge status-active" style={{ cursor: 'default' }}>
          <span className="status-dot"></span>
          Sedang Dipinjam
        </span>
      );
    }
    return (
      <span className="status-badge status-storage" style={{ cursor: 'default' }}>
        <span className="status-dot"></span>
        Selesai
      </span>
    );
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <span className="page-breadcrumb-sep">/</span>
            Data Transaksi
          </div>
          <h1 className="page-title">Monitoring Transaksi Peminjaman & Pengambilan</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('checkout')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Buat Transaksi Baru
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          {/* Filter Bar */}
          <div className="log-filters">
            {[
              { id: 'ALL', label: 'Semua Transaksi' },
              { id: 'Peminjaman Sementara', label: 'Peminjaman Sementara' },
              { id: 'Pengambilan Habis Pakai', label: 'Pengambilan Habis Pakai' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`log-filter-btn ${filterType === tab.id ? 'active' : ''}`}
                onClick={() => setFilterType(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Perangkat IT (Aset)</th>
                  <th>Pengguna / Karyawan</th>
                  <th>Tipe Request</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="empty-state">
                        <div className="empty-state-title">Tidak ada transaksi ditemukan</div>
                        <div className="empty-state-desc">Belum ada riwayat peminjaman atau pengambilan barang untuk kategori ini.</div>
                        <button className="btn btn-sm btn-primary" onClick={() => onNavigate('checkout')}>Buat Transaksi</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const assetObj = assets.find(a => a.id === tx.asset_id);
                    const userObj = users.find(u => u.id === tx.user_id);
                    const borrowerName = tx.user_nama || (userObj ? userObj.nama : `User ID ${tx.user_id}`);
                    const borrowerRole = tx.user_role || (userObj ? userObj.role : '-');

                    return (
                      <tr key={tx.id}>
                        <td><span className="cell-code">{tx.id}</span></td>
                        <td>
                          <div className="cell-name-primary">{assetObj ? assetObj.nama : `Aset [${tx.asset_id}]`}</div>
                          <div className="cell-name-secondary">ID: {tx.asset_id}</div>
                        </td>
                        <td>
                          <div className="cell-name-primary">{borrowerName}</div>
                          <div className="cell-name-secondary">{borrowerRole}</div>
                        </td>
                        <td><span className="category-badge">{tx.tipe_request}</span></td>
                        <td><span className="cell-mono" style={{ fontSize: '13px' }}>{tx.jumlah} unit</span></td>
                        <td>{getStatusBadge(tx.status)}</td>
                        <td style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{tx.tanggal_request}</td>
                        <td style={{ maxWidth: '200px', fontSize: '13px' }}>{tx.keterangan}</td>
                        <td style={{ textAlign: 'center' }}>
                          {tx.status && tx.status.includes('Dipinjam') ? (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleReturnItem(tx)}
                              title="Kembalikan Aset ke Stok"
                            >
                              Kembalikan Barang
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Selesai</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="table-footer">
            <span>Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi</span>
          </div>
        </div>
      </div>
    </>
  );
}
