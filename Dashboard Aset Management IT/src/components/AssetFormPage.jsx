import React, { useState, useEffect } from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function AssetFormPage({ onNavigate, editAsset, showToast }) {
  const { store } = useAssetStore();
  const isEditing = !!editAsset;

  const [formData, setFormData] = useState({
    id: '',
    kategori: 'Laptop & PC',
    kategoriLainnya: '',
    brand: '',
    nama: '',
    serial_number: '',
    kondisi: 'New',
    healthness: 'green',
    quantity: 1,
    lokasi: '',
    keterangan: '',
    gambar_url: ''
  });

  useEffect(() => {
    if (isEditing && editAsset) {
      setFormData({
        id: editAsset.id || '',
        kategori: editAsset.kategori || 'Laptop & PC',
        kategoriLainnya: '',
        brand: editAsset.brand || '',
        nama: editAsset.nama || '',
        serial_number: editAsset.serial_number || '',
        kondisi: editAsset.kondisi || 'New',
        healthness: editAsset.healthness || 'green',
        quantity: editAsset.quantity !== undefined ? editAsset.quantity : 1,
        lokasi: editAsset.lokasi || '',
        keterangan: editAsset.keterangan || '',
        gambar_url: editAsset.gambar_url || ''
      });
    }
  }, [editAsset, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.serial_number.trim() || !formData.lokasi.trim()) {
      showToast('Mohon lengkapi seluruh kolom yang wajib diisi.', 'warning');
      return;
    }

    // Resolve kategori: jika "Lainnya" maka gunakan nilai kategoriLainnya
    const resolvedCategory = formData.kategori === 'Lainnya' 
      ? formData.kategoriLainnya.trim() 
      : formData.kategori;
    
    if (formData.kategori === 'Lainnya' && !resolvedCategory) {
      showToast('Mohon isi nama kategori lainnya.', 'warning');
      return;
    }

    const assetData = {
      ...formData,
      kategori: resolvedCategory,
      brand: formData.brand.trim() || 'Enterprise',
      nama: formData.nama.trim(),
      serial_number: formData.serial_number.trim(),
      quantity: Number(formData.quantity) || 1,
      lokasi: formData.lokasi.trim(),
      keterangan: formData.keterangan.trim(),
      gambar_url: formData.gambar_url.trim(),
      healthness: formData.healthness || 'green'
    };
    // Remove kategoriLainnya from payload
    delete assetData.kategoriLainnya;

    const result = await store.createOrUpdateAsset(assetData, isEditing);
    if (result.success) {
      if (result.action === 'CREATE') {
        showToast(`Aset baru "${result.asset.nama}" (${result.asset.id}) berhasil disimpan.`, 'success');
      } else {
        showToast(`Perubahan pada "${result.asset.nama}" (${result.asset.id}) berhasil disimpan.`, 'success');
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
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Section: Identitas */}
            <div className="form-section">
              <div className="form-section-title">Identitas Perangkat</div>
              <div className="form-section-desc">Informasi dasar untuk identifikasi aset di dalam inventaris.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  {isEditing && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="form-id">
                        Kode Aset / ID
                      </label>
                      <input
                        type="text"
                        id="form-id"
                        name="id"
                        className="form-input"
                        value={formData.id}
                        disabled={true}
                      />
                      <span className="form-hint">
                        Kode aset otomatis dari sistem (tidak dapat diubah).
                      </span>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-category">
                      Kategori <span className="required">*</span>
                    </label>
                    <select
                      id="form-category"
                      name="kategori"
                      className="form-select"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Laptop & PC">Laptop & PC</option>
                      <option value="Server & Cloud Physical">Server & Cloud Physical</option>
                      <option value="Networking">Networking</option>
                      <option value="Monitor & Peripherals">Monitor & Peripherals</option>
                      <option value="Lainnya">Lainnya (Input Manual)</option>
                    </select>
                    {formData.kategori === 'Lainnya' && (
                      <input
                        type="text"
                        id="form-category-other"
                        name="kategoriLainnya"
                        className="form-input"
                        placeholder="Tulis kategori lainnya..."
                        value={formData.kategoriLainnya}
                        onChange={handleInputChange}
                        required
                        style={{ marginTop: '8px' }}
                      />
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-name">
                      Nama Perangkat & Model <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      name="nama"
                      className="form-input"
                      placeholder="Contoh: Lenovo ThinkPad X1 Carbon Gen 11"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-brand">
                      Brand / Merek
                    </label>
                    <input
                      type="text"
                      id="form-brand"
                      name="brand"
                      className="form-input"
                      placeholder="Contoh: Lenovo, Cisco, Apple"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-quantity">
                      Stok Awal (Unit) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="form-quantity"
                      name="quantity"
                      className="form-input"
                      min="1"
                      placeholder="Contoh: 5"
                      value={formData.quantity}
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
                      name="serial_number"
                      className="form-input"
                      placeholder="Contoh: 5CD41088KL"
                      value={formData.serial_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="form-status">
                      Kondisi <span className="required">*</span>
                    </label>
                    <select
                      id="form-status"
                      name="kondisi"
                      className="form-select"
                      value={formData.kondisi}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
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

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-location">
                      Lokasi Penempatan <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-location"
                      name="lokasi"
                      className="form-input"
                      placeholder="Contoh: HQ Level 4 - Tech Bay 12"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Kesehatan Aset (Healthness) */}
            <div className="form-section">
              <div className="form-section-title">Kesehatan Aset (Healthness)</div>
              <div className="form-section-desc">Tentukan status kesehatan aset saat ini.</div>
              <div className="card card-padded">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Status Kesehatan</label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <label style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '12px 20px', borderRadius: '8px', border: formData.healthness === 'green' ? '3px solid #059669' : '2px solid #d1d5db',
                        backgroundColor: formData.healthness === 'green' ? '#d1fae5' : '#f9fafb',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="radio"
                          name="healthness"
                          value="green"
                          checked={formData.healthness === 'green'}
                          onChange={handleInputChange}
                          style={{ accentColor: '#059669', width: '18px', height: '18px' }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                          Baik (Hijau)
                        </span>
                      </label>

                      <label style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '12px 20px', borderRadius: '8px', border: formData.healthness === 'yellow' ? '3px solid #d97706' : '2px solid #d1d5db',
                        backgroundColor: formData.healthness === 'yellow' ? '#fef9c3' : '#f9fafb',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="radio"
                          name="healthness"
                          value="yellow"
                          checked={formData.healthness === 'yellow'}
                          onChange={handleInputChange}
                          style={{ accentColor: '#ca8a04', width: '18px', height: '18px' }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block' }}></span>
                          Perlu Perhatian (Kuning)
                        </span>
                      </label>

                      <label style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        padding: '12px 20px', borderRadius: '8px', border: formData.healthness === 'red' ? '3px solid #dc2626' : '2px solid #d1d5db',
                        backgroundColor: formData.healthness === 'red' ? '#fee2e2' : '#f9fafb',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="radio"
                          name="healthness"
                          value="red"
                          checked={formData.healthness === 'red'}
                          onChange={handleInputChange}
                          style={{ accentColor: '#dc2626', width: '18px', height: '18px' }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                          Rusak (Merah)
                        </span>
                      </label>
                    </div>
                    <span className="form-hint" style={{ marginTop: '6px', display: 'block' }}>
                      Pilih status kesehatan aset: Hijau = Baik, Kuning = Beroperasi dengan catatan, Merah = Rusak
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Finansial & Teknis */}
            <div className="form-section">
              <div className="form-section-title">Pengadaan & Spesifikasi Teknis</div>
              <div className="form-section-desc">Data pengadaan dan spesifikasi detail perangkat.</div>
              <div className="card card-padded">
                <div className="form-grid">

                  <div className="form-group full-width">
                    <label className="form-label" htmlFor="form-specs">
                      Keterangan / Spesifikasi <span className="required">*</span>
                    </label>
                    <textarea
                      id="form-specs"
                      name="keterangan"
                      className="form-textarea"
                      rows="3"
                      placeholder="Contoh: Intel Core i7-1360P, 32GB DDR5, 1TB NVMe SSD"
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
