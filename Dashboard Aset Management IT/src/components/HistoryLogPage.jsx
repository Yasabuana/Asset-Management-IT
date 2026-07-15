import React, { useState } from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function HistoryLogPage({ onNavigate, showToast }) {
  const { logs, store } = useAssetStore();
  const [logFilter, setLogFilter] = useState('ALL');

  const filteredLogs = logFilter === 'ALL'
    ? logs
    : logs.filter(l => l.actionType === logFilter);

  const handleClearLogs = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat log?')) {
      store.clearLogs();
      showToast('Seluruh riwayat log berhasil dibersihkan.', 'warning');
    }
  };

  const getDotClass = (type) => {
    if (type === 'CREATE') return 'create';
    if (type === 'UPDATE') return 'update';
    if (type === 'STATUS_CHANGE') return 'status-change';
    if (type === 'DELETE') return 'delete';
    if (type === 'CHECKOUT') return 'status-change';
    if (type === 'RETURN') return 'create';
    return 'system';
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <span className="page-breadcrumb-sep">/</span>
            History Log
          </div>
          <h1 className="page-title">Riwayat Aktivitas & Mutasi Stok (INVENTORY_HISTORY)</h1>
        </div>
        <div className="page-header-actions">
          {logs.length > 0 && (
            <button className="btn btn-secondary" onClick={handleClearLogs}>
              Hapus Semua Log
            </button>
          )}
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          {/* Filter Bar */}
          <div className="log-filters">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'CHECKOUT', label: 'Peminjaman/Out' },
              { id: 'RETURN', label: 'Pengembalian/In' },
              { id: 'CREATE', label: 'Tambah' },
              { id: 'UPDATE', label: 'Update' },
              { id: 'DELETE', label: 'Hapus' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`log-filter-btn ${logFilter === tab.id ? 'active' : ''}`}
                onClick={() => setLogFilter(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Log List */}
          <div className="log-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {filteredLogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">Belum ada riwayat aktivitas</div>
                <div className="empty-state-desc">Setiap operasi Tambah, Update, Peminjaman, atau Hapus aset akan tercatat di sini secara otomatis.</div>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div className="log-item" key={log.id}>
                  <div className={`log-type-dot ${getDotClass(log.actionType)}`}></div>
                  <div className="log-content">
                    <div className="log-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span>[{log.assetId || log.asset_id}]</span> {log.actionType}
                      </div>
                      {log.jumlah_perubahan !== undefined && log.jumlah_perubahan !== 0 && (
                        <span className="cell-mono" style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: log.jumlah_perubahan < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: log.jumlah_perubahan < 0 ? 'var(--color-danger)' : 'var(--color-success)',
                          fontWeight: 600
                        }}>
                          Mutasi: {log.jumlah_perubahan > 0 ? `+${log.jumlah_perubahan}` : log.jumlah_perubahan} unit
                        </span>
                      )}
                    </div>
                    <div className="log-description">{log.description || log.alasan}</div>
                    <div className="log-time">
                      {log.timestamp} {log.admin_id && `— oleh Admin ID: ${log.admin_id}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredLogs.length > 0 && (
            <div className="table-footer">
              <span>Menampilkan {filteredLogs.length} dari {logs.length} log</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
