import React, { useState, useEffect } from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function AssetCheckoutPage({ onNavigate, borrowAsset, showToast }) {
  const { assets, users, store } = useAssetStore();

  const [formData, setFormData] = useState({
    asset_id: '',
    user_id: '',
    user_nama: '',
    user_role: '',
    tipe_request: 'Peminjaman Sementara',
    jumlah: 1,
    keterangan: ''
  });

  // Available assets for checkout (must not be Non-aktif)
  const availableAssets = assets.filter(a => a.kondisi !== 'Non-aktif' && (a.quantity === undefined || a.quantity > 0));

  useEffect(() => {
    if (borrowAsset) {
      setFormData(prev => ({
        ...prev,
        asset_id: borrowAsset.id
      }));
    } else if (availableAssets.length > 0 && !formData.asset_id) {
      setFormData(prev => ({
        ...prev,
        asset_id: availableAssets[0].id
      }));
    }
  }, [borrowAsset, availableAssets]);

  const selectedAssetObj = assets.find(a => a.id === formData.asset_id);
  const maxStock = selectedAssetObj ? (selectedAssetObj.quantity || 1) : 1;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'asset_id') {
        const targetAsset = assets.find(a => a.id === value);
        const newMax = targetAsset ? (targetAsset.quantity || 1) : 1;
        return {
          ...prev,
          asset_id: value,
          jumlah: Math.min(prev.jumlah, newMax) || 1
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset_id) {
      showToast('Mohon pilih aset yang akan dipinjam/diambil.', 'warning');
      return;
    }
    if (!formData.user_nama.trim()) {
      showToast('Mohon isi nama lengkap pengguna/peminjam.', 'warning');
      return;
    }
    if (!formData.keterangan.trim()) {
      showToast('Mohon isi keterangan atau tujuan penggunaan.', 'warning');
      return;
    }

    const result = await store.submitTransaction(formData);
    if (result.success) {
      showToast(`Transaksi ${formData.tipe_request} berhasil diajukan dan diproses (ID: ${result.transaction.id}).`, 'success');
      onNavigate('transactions');
    } else {
      showToast(result.message || 'Gagal mengajukan transaksi.', 'danger');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <span className="page-breadcrumb-sep">/</span>
            Form Peminjaman
          </div>
          <h1 className="page-title">Form Peminjaman & Pengambilan Aset</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Pemilihan Perangkat */}
            <div className="form-section">
              <div className="form-section-title">Barang yang Diajukan</div>
              <div className="form-section-desc">Pilih perangkat IT dari inventaris dan tentukan jumlah yang dibutuhkan.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-asset">
                      Pilih Aset Inventaris <span className="required">*</span>
                    </label>
                    <select
                      id="form-asset"
                      name="asset_id"
                      className="form-select"
                      value={formData.asset_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Pilih Perangkat IT --</option>
                      {availableAssets.map(a => (
                        <option key={a.id} value={a.id}>
                          [{a.id}] {a.nama} — (Sisa Stok: {a.quantity || 1} unit)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-tipe">
                      Tipe Pengajuan / Request <span className="required">*</span>
                    </label>
                    <select
                      id="form-tipe"
                      name="tipe_request"
                      className="form-select"
                      value={formData.tipe_request}
                      onChange={handleInputChange}
                    >
                      <option value="Peminjaman Sementara">Peminjaman Sementara (Akan Dikembalikan)</option>
                      <option value="Pengambilan Habis Pakai">Pengambilan Habis Pakai / Alokasi Tetap</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-jumlah">
                      Jumlah Unit <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="form-jumlah"
                      name="jumlah"
                      className="form-input"
                      min="1"
                      max={maxStock}
                      value={formData.jumlah}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="form-hint">Maksimal stok tersedia saat ini: {maxStock} unit.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Data Pengguna */}
            <div className="form-section">
              <div className="form-section-title">Data Pengguna & Keperluan</div>
              <div className="form-section-desc">Isi form identitas pengguna serta tujuan pengajuan barang ini.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="form-usernama">
                      Nama Pengguna / Pemohon <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-usernama"
                      name="user_nama"
                      className="form-input"
                      placeholder="Contoh: Budi Santoso"
                      value={formData.user_nama}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-userrole">
                      Divisi / Jabatan <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-userrole"
                      name="user_role"
                      className="form-input"
                      placeholder="Contoh: Tim IT Support / Level 3"
                      value={formData.user_role}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-keterangan">
                      Tujuan Penggunaan / Keterangan <span className="required">*</span>
                    </label>
                    <textarea
                      id="form-keterangan"
                      name="keterangan"
                      className="form-textarea"
                      rows="3"
                      placeholder="Contoh: Peminjaman untuk setup ruang rapat lantai 2 selama 3 hari, atau alokasi PC untuk karyawan baru Divisi Finance."
                      value={formData.keterangan}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg">
                Ajukan & Simpan Transaksi
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => onNavigate('transactions')}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
