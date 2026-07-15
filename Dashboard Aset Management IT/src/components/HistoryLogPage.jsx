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
          <h1 className="page-title">Riwayat Aktivitas</h1>
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
            {['ALL', 'CREATE', 'UPDATE', 'DELETE'].map((type) => (
              <button
                key={type}
                className={`log-filter-btn ${logFilter === type ? 'active' : ''}`}
                onClick={() => setLogFilter(type)}
                type="button"
              >
                {type === 'ALL' ? 'Semua' : type === 'CREATE' ? 'Tambah' : type === 'UPDATE' ? 'Update' : 'Hapus'}
              </button>
            ))}
          </div>

          {/* Log List */}
          <div className="log-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {filteredLogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">Belum ada riwayat aktivitas</div>
                <div className="empty-state-desc">Setiap operasi Tambah, Update, atau Hapus aset akan tercatat di sini secara otomatis.</div>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div className="log-item" key={log.id}>
                  <div className={`log-type-dot ${getDotClass(log.actionType)}`}></div>
                  <div className="log-content">
                    <div className="log-header">
                      <span>[{log.assetId}]</span> {log.actionType}
                    </div>
                    <div className="log-description">{log.description}</div>
                    <div className="log-time">{log.timestamp}</div>
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
