import React from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

const SVG_CLOSE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Modals({ activeModal, selectedAsset, onClose, onNavigateEdit, showToast }) {
  const { store, formatIDR } = useAssetStore();

  const handleConfirmDelete = () => {
    if (selectedAsset) {
      const deletedName = selectedAsset.name;
      const success = store.deleteAssetById(selectedAsset.id);
      if (success) {
        onClose();
        showToast(`Aset "${deletedName}" berhasil dihapus dari inventaris.`, 'success');
      } else {
        showToast('Gagal menghapus aset.', 'danger');
      }
    }
  };

  if (!activeModal) return null;

  return (
    <div id="modals-container">
      {/* DELETE CONFIRMATION */}
      <div
        className={`modal-overlay ${activeModal === 'delete' ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}
      >
        <div className="modal-card" style={{ maxWidth: '480px' }}>
          <div className="modal-header">
            <div>
              <div className="modal-title">Konfirmasi Hapus Aset</div>
              <div className="modal-subtitle">Tindakan ini tidak dapat dibatalkan</div>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>{SVG_CLOSE}</button>
          </div>

          <div className="modal-body">
            <div className="delete-warning">
              Peringatan: Data aset akan dihapus permanen dari inventaris dan perubahan akan dicatat ke History Log.
            </div>

            {selectedAsset && (
              <div className="delete-asset-preview">
                <div className="delete-asset-name">{selectedAsset.name}</div>
                <div className="delete-asset-meta">
                  <span className="delete-asset-tag">ID: {selectedAsset.id}</span>
                  <span className="delete-asset-tag">S/N: {selectedAsset.serialNumber}</span>
                  <span className="delete-asset-tag">Stok: {selectedAsset.quantity || 1} unit</span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
              Ya, Hapus Aset
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL VIEW */}
      <div
        className={`modal-overlay ${activeModal === 'detail' ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}
      >
        <div className="modal-card" style={{ maxWidth: '560px' }}>
          <div className="modal-header">
            <div>
              <div className="modal-title">{selectedAsset?.name || 'Detail Aset'}</div>
              <div className="modal-subtitle">{selectedAsset?.id} — {selectedAsset?.category}</div>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>{SVG_CLOSE}</button>
          </div>

          <div className="modal-body">
            {selectedAsset && (() => {
              const statusClass =
                selectedAsset.status === 'Active' ? 'status-active' :
                selectedAsset.status === 'Maintenance' ? 'status-maintenance' :
                selectedAsset.status === 'In Storage' ? 'status-storage' :
                'status-retired';

              return (
                <>
                  <div className="detail-grid">
                    <div className="detail-cell">
                      <div className="detail-cell-label">Status</div>
                      <div className="detail-cell-value">
                        <span className={`status-badge ${statusClass}`} style={{ cursor: 'default' }}>
                          <span className="status-dot"></span>
                          {selectedAsset.status}
                        </span>
                      </div>
                    </div>
                    <div className="detail-cell">
                      <div className="detail-cell-label">Stok Tersedia</div>
                      <div className="detail-cell-value" style={{ fontFamily: 'var(--font-mono)' }}>
                        {selectedAsset.quantity !== undefined ? `${selectedAsset.quantity} unit` : '1 unit'}
                      </div>
                    </div>
                  </div>

                  <div className="detail-rows">
                    <div className="detail-row">
                      <span className="detail-row-label">Serial Number</span>
                      <span className="detail-row-value" style={{ fontFamily: 'var(--font-mono)' }}>{selectedAsset.serialNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-row-label">Pengguna</span>
                      <span className="detail-row-value">{selectedAsset.assignedTo}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-row-label">Lokasi</span>
                      <span className="detail-row-value">{selectedAsset.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-row-label">Tanggal Pengadaan</span>
                      <span className="detail-row-value">{selectedAsset.purchaseDate}</span>
                    </div>
                  </div>

                  <div className="detail-specs">
                    <span className="detail-specs-label">Spesifikasi Teknis</span>
                    {selectedAsset.specs}
                  </div>
                </>
              );
            })()}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Tutup</button>
            <button type="button" className="btn btn-primary" onClick={() => { onClose(); onNavigateEdit(selectedAsset); }}>
              Edit Aset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
