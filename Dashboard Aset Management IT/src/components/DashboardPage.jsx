import React from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function DashboardPage({ onNavigate, showToast }) {
  const { assets, logs, formatIDR } = useAssetStore();

  const totalAssets = assets.length;
  const activeCount = assets.filter(a => a.kondisi === 'Baik').length;
  const maintenanceCount = assets.filter(a => a.kondisi === 'Perbaikan Rutin').length;
  const totalUnits = assets.reduce((sum, a) => sum + (a.quantity !== undefined ? a.quantity : 1), 0);

  const recentLogs = logs.slice(0, 5);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">Dashboard</div>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('add')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Aset
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="stat-card">
            <div className="stat-card-label">Total Jenis Aset</div>
            <div className="stat-card-value">{totalAssets}</div>
            <div className="stat-card-sub">Perangkat IT terdaftar</div>
            <div className="stat-card-accent" style={{ backgroundColor: 'var(--color-primary)' }}></div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Active</div>
            <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>{activeCount}</div>
            <div className="stat-card-sub">Sedang beroperasi</div>
            <div className="stat-card-accent" style={{ backgroundColor: 'var(--color-success)' }}></div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Maintenance</div>
            <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>{maintenanceCount}</div>
            <div className="stat-card-sub">Dalam perawatan</div>
            <div className="stat-card-accent" style={{ backgroundColor: 'var(--color-warning)' }}></div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Total Unit Aset</div>
            <div className="stat-card-value">{totalUnits}</div>
            <div className="stat-card-sub">Keseluruhan stok fisik</div>
            <div className="stat-card-accent" style={{ backgroundColor: 'var(--color-text-primary)' }}></div>
          </div>
        </div>

        {/* Quick Actions - Flowchart Branches */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Pilih Aksi</h2>
          <div className="actions-grid">
            {/* Lihat Aset */}
            <div className="action-card" onClick={() => onNavigate('list')}>
              <div className="action-card-icon" style={{ backgroundColor: 'var(--color-primary-softer)', color: 'var(--color-primary)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </div>
              <div className="action-card-title">Lihat Aset</div>
              <div className="action-card-desc">Tampilkan seluruh data inventaris aset IT dalam tabel dengan fitur filter dan pencarian.</div>
              <div className="action-card-link">
                Buka List Data
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>

            {/* Tambah Aset */}
            <div className="action-card" onClick={() => onNavigate('add')}>
              <div className="action-card-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <div className="action-card-title">Tambah Aset Baru</div>
              <div className="action-card-desc">Input data aset IT baru ke dalam inventaris melalui form pengisian lengkap.</div>
              <div className="action-card-link">
                Buka Form Input
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>

            {/* Update/Delete */}
            <div className="action-card" onClick={() => onNavigate('list')}>
              <div className="action-card-icon" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div className="action-card-title">Update / Delete</div>
              <div className="action-card-desc">Edit informasi atau hapus data aset yang sudah terdaftar di inventaris.</div>
              <div className="action-card-link">
                Kelola Data Aset
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="recent-header">
            <h2 className="recent-title">Aktivitas Terbaru</h2>
            <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('history')}>
              Lihat Semua
            </button>
          </div>
          <div className="recent-list">
            {recentLogs.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-6)' }}>
                <div className="empty-state-title">Belum ada aktivitas</div>
                <div className="empty-state-desc">Setiap operasi pada aset akan tercatat di sini.</div>
              </div>
            ) : (
              recentLogs.map((log) => {
                let dotClass = 'system';
                if (log.tipe_transaksi === 'CREATE') dotClass = 'create';
                else if (log.tipe_transaksi === 'UPDATE' || log.tipe_transaksi === 'STATUS_CHANGE' || log.tipe_transaksi === 'CHECKOUT') dotClass = 'update';
                else if (log.tipe_transaksi === 'DELETE') dotClass = 'delete';
                else if (log.tipe_transaksi === 'RETURN') dotClass = 'create';

                return (
                  <div className="recent-item" key={log.id}>
                    <div className={`log-type-dot ${dotClass}`}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>[{log.asset_id}]</span>{' '}
                        {log.tipe_transaksi}
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        {log.alasan}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
