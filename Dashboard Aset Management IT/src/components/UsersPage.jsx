import React from 'react';
import { useAssetStore } from '../state/useAssetStore.js';

export function UsersPage({ onNavigate }) {
  const { users } = useAssetStore();

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <span className="page-breadcrumb-sep">/</span>
            Data Pengguna
          </div>
          <h1 className="page-title">Manajemen Data Pengguna</h1>
        </div>
      </div>

      <div className="page-body">
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Pengguna</th>
                  <th>Nama Lengkap</th>
                  <th>Role / Jabatan</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="empty-state">
                        <div className="empty-state-title">Belum ada pengguna terdaftar</div>
                        <div className="empty-state-desc">Data pengguna akan ditambahkan otomatis saat transaksi peminjaman baru dibuat.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td><span className="cell-code">{user.id}</span></td>
                      <td><div className="cell-name-primary">{user.nama}</div></td>
                      <td><span className="category-badge">{user.role || 'Karyawan'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
