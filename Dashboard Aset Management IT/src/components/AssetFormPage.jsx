import React, { useState, useEffect } from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function AssetFormPage({ onNavigate, editAsset, showToast }) {
  const { store } = useAssetStore();
  const isEditing = !!editAsset;

  const [formData, setFormData] = useState({
    id: '',
    category: 'Laptop & PC',
    name: '',
    serialNumber: '',
    status: 'Active',
    assignedTo: '',
    location: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    price: '',
    specs: ''
  });

  useEffect(() => {
    if (isEditing && editAsset) {
      setFormData({
        id: editAsset.id || '',
        category: editAsset.category || 'Laptop & PC',
        name: editAsset.name || '',
        serialNumber: editAsset.serialNumber || '',
        status: editAsset.status || 'Active',
        assignedTo: editAsset.assignedTo || '',
        location: editAsset.location || '',
        purchaseDate: editAsset.purchaseDate || new Date().toISOString().split('T')[0],
        price: editAsset.price || '',
        specs: editAsset.specs || ''
      });
    }
  }, [editAsset, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.serialNumber.trim() || !formData.assignedTo.trim() || !formData.location.trim() || !formData.specs.trim()) {
      showToast('Mohon lengkapi seluruh kolom yang wajib diisi.', 'warning');
      return;
    }

    const assetData = {
      ...formData,
      id: formData.id.trim(),
      name: formData.name.trim(),
      serialNumber: formData.serialNumber.trim(),
      assignedTo: formData.assignedTo.trim(),
      location: formData.location.trim(),
      specs: formData.specs.trim(),
      price: Number(formData.price) || 0
    };

    const result = store.createOrUpdateAsset(assetData, isEditing);
    if (result.success) {
      if (result.action === 'CREATE') {
        showToast(`Aset baru "${result.asset.name}" (${result.asset.id}) berhasil disimpan.`, 'success');
      } else {
        showToast(`Perubahan pada "${result.asset.name}" (${result.asset.id}) berhasil disimpan.`, 'success');
      }
      onNavigate('list');
    } else {
      showToast(result.message || 'Terjadi kesalahan saat menyimpan.', 'danger');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <span className="page-breadcrumb-sep">/</span>
            {isEditing ? (
              <>
                <button onClick={() => onNavigate('list')}>Lihat Aset</button>
                <span className="page-breadcrumb-sep">/</span>
                Edit Aset
              </>
            ) : (
              'Tambah Aset Baru'
            )}
          </div>
          <h1 className="page-title">{isEditing ? 'Edit Data Aset' : 'Tambah Aset Baru'}</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Section: Identitas */}
            <div className="form-section">
              <div className="form-section-title">Identitas Perangkat</div>
              <div className="form-section-desc">Informasi dasar untuk identifikasi aset di dalam inventaris.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="form-id">
                      Kode Aset / ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-id"
                      name="id"
                      className="form-input"
                      placeholder="Contoh: AST-LPT-105"
                      value={formData.id}
                      onChange={handleInputChange}
                      disabled={isEditing}
                    />
                    <span className="form-hint">
                      {isEditing ? 'Kode aset tidak dapat diubah.' : 'Kosongkan untuk ID otomatis.'}
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-category">
                      Kategori <span className="required">*</span>
                    </label>
                    <select
                      id="form-category"
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Laptop & PC">Laptop & PC</option>
                      <option value="Server & Cloud Physical">Server & Cloud Physical</option>
                      <option value="Networking">Networking</option>
                      <option value="Monitor & Peripherals">Monitor & Peripherals</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-name">
                      Nama Perangkat & Model <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      name="name"
                      className="form-input"
                      placeholder="Contoh: Lenovo ThinkPad X1 Carbon Gen 11"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-serial">
                      Serial Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-serial"
                      name="serialNumber"
                      className="form-input"
                      placeholder="Contoh: 5CD41088KL"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-status">
                      Status <span className="required">*</span>
                    </label>
                    <select
                      id="form-status"
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="In Storage">In Storage</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Penempatan */}
            <div className="form-section">
              <div className="form-section-title">Penempatan & Pengguna</div>
              <div className="form-section-desc">Informasi siapa yang menggunakan dan di mana aset ditempatkan.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="form-assigned">
                      Pengguna / Assigned To <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-assigned"
                      name="assignedTo"
                      className="form-input"
                      placeholder="Contoh: Budi Santoso - Lead DevOps"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-location">
                      Lokasi Penempatan <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-location"
                      name="location"
                      className="form-input"
                      placeholder="Contoh: HQ Level 4 - Tech Bay 12"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Finansial & Teknis */}
            <div className="form-section">
              <div className="form-section-title">Finansial & Spesifikasi</div>
              <div className="form-section-desc">Data pengadaan dan spesifikasi teknis perangkat.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="form-date">
                      Tanggal Pengadaan <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="form-date"
                      name="purchaseDate"
                      className="form-input"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-price">
                      Valuasi Pengadaan (IDR) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="form-price"
                      name="price"
                      className="form-input"
                      placeholder="25000000"
                      min="0"
                      step="50000"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-specs">
                      Spesifikasi Teknis <span className="required">*</span>
                    </label>
                    <textarea
                      id="form-specs"
                      name="specs"
                      className="form-textarea"
                      rows="3"
                      placeholder="Contoh: Intel Core i7-1360P, 32GB DDR5, 1TB NVMe SSD"
                      value={formData.specs}
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
                {isEditing ? 'Simpan Perubahan' : 'Simpan Aset Baru'}
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => onNavigate(isEditing ? 'list' : 'dashboard')}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
