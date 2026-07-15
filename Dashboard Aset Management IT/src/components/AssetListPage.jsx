import React from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

const SVG_EYE = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const SVG_EDIT = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SVG_TRASH = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export function AssetListPage({ onNavigate, onOpenDetail, onOpenDelete, showToast }) {
  const { filteredAssets, filters, store, formatIDR } = useAssetStore();

  const handleSearchChange = (e) => {
    store.setFilters({ searchQuery: e.target.value });
  };

  const handleStatusFilter = (e) => {
    store.setFilters({ status: e.target.value });
  };

  const handleCategoryFilter = (e) => {
    store.setFilters({ category: e.target.value });
  };

  const handleSortChange = (e) => {
    store.setFilters({ sortBy: e.target.value });
  };

  const handleResetFilters = () => {
    store.setFilters({ searchQuery: '', category: 'ALL', status: 'ALL', location: 'ALL', sortBy: 'id_asc' });
  };

  const handleQuickStatusToggle = (asset) => {
    const statuses = ['Active', 'Maintenance', 'In Storage', 'Retired'];
    const nextIdx = (statuses.indexOf(asset.status) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];
    store.toggleAssetStatus(asset.id, nextStatus);
    showToast(`Status diubah menjadi "${nextStatus}" untuk ${asset.id}`, 'success');
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-active';
    if (status === 'Maintenance') return 'status-maintenance';
    if (status === 'In Storage') return 'status-storage';
    if (status === 'Retired') return 'status-retired';
    return '';
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <span className="page-breadcrumb-sep">/</span>
            Lihat Aset
          </div>
          <h1 className="page-title">List Data Aset</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('add')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Aset
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          {/* Toolbar */}
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <input
                type="text"
                className="search-input"
                placeholder="Cari kode, nama, serial..."
                value={filters.searchQuery || ''}
                onChange={handleSearchChange}
              />
              <select className="filter-select" value={filters.status || 'ALL'} onChange={handleStatusFilter}>
                <option value="ALL">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="In Storage">In Storage</option>
                <option value="Retired">Retired</option>
              </select>
              <select className="filter-select" value={filters.category || 'ALL'} onChange={handleCategoryFilter}>
                <option value="ALL">Semua Kategori</option>
                <option value="Laptop & PC">Laptop & PC</option>
                <option value="Server & Cloud Physical">Server & Storage</option>
                <option value="Networking">Networking</option>
                <option value="Monitor & Peripherals">Monitor & Peripherals</option>
              </select>
            </div>
            <div className="table-toolbar-right">
              <select className="filter-select" value={filters.sortBy || 'id_asc'} onChange={handleSortChange}>
                <option value="id_asc">ID (A-Z)</option>
                <option value="id_desc">ID (Z-A)</option>
                <option value="name_asc">Nama (A-Z)</option>
                <option value="date_desc">Terbaru</option>
                <option value="price_desc">Nilai Tertinggi</option>
              </select>
              <button className="btn btn-sm btn-secondary" onClick={handleResetFilters}>Reset</button>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kode Aset</th>
                  <th>Nama Perangkat</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Pengguna</th>
                  <th>Lokasi</th>
                  <th>Valuasi (IDR)</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="empty-state">
                        <div className="empty-state-title">Tidak ada data ditemukan</div>
                        <div className="empty-state-desc">Coba ubah kata kunci pencarian atau reset filter.</div>
                        <button className="btn btn-sm btn-secondary" onClick={handleResetFilters}>Reset Filter</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td><span className="cell-code">{asset.id}</span></td>
                      <td>
                        <div className="cell-name-primary">{asset.name}</div>
                        <div className="cell-name-secondary">S/N: {asset.serialNumber}</div>
                      </td>
                      <td><span className="category-badge">{asset.category}</span></td>
                      <td>
                        <div className={`status-badge ${getStatusClass(asset.status)}`} onClick={() => handleQuickStatusToggle(asset)} title="Klik untuk ubah status">
                          <span className="status-dot"></span>
                          {asset.status}
                        </div>
                      </td>
                      <td>{asset.assignedTo}</td>
                      <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{asset.location}</td>
                      <td><span className="cell-mono">{formatIDR(asset.price)}</span></td>
                      <td>
                        <div className="row-actions" style={{ justifyContent: 'center' }}>
                          <button className="row-action-btn" title="Lihat Detail" onClick={() => onOpenDetail(asset)}>{SVG_EYE}</button>
                          <button className="row-action-btn edit" title="Edit" onClick={() => onNavigate('edit', asset)}>{SVG_EDIT}</button>
                          <button className="row-action-btn delete" title="Hapus" onClick={() => onOpenDelete(asset)}>{SVG_TRASH}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="table-footer">
            <span>Menampilkan {filteredAssets.length} dari {store.assetsState.length} aset</span>
          </div>
        </div>
      </div>
    </>
  );
}
