import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { DashboardPage } from './components/DashboardPage.jsx';
import { AssetListPage } from './components/AssetListPage.jsx';
import { AssetFormPage } from './components/AssetFormPage.jsx';
import { HistoryLogPage } from './components/HistoryLogPage.jsx';
import { AssetCheckoutPage } from './components/AssetCheckoutPage.jsx';
import { TransactionsPage } from './components/TransactionsPage.jsx';
import { UsersPage } from './components/UsersPage.jsx';
import { Modals } from './components/Modals.jsx';

export function App() {
  // Routing state
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editAsset, setEditAsset] = useState(null);
  const [borrowAsset, setBorrowAsset] = useState(null);

  // Modal state (only delete + detail)
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, 4000);
  }, []);

  // Navigation
  const handleNavigate = (page, asset) => {
    if (page === 'edit' && asset) {
      setEditAsset(asset);
      setBorrowAsset(null);
      setCurrentPage('edit');
    } else if (page === 'checkout' && asset) {
      setBorrowAsset(asset);
      setEditAsset(null);
      setCurrentPage('checkout');
    } else {
      setEditAsset(null);
      setBorrowAsset(null);
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  // Modal handlers
  const handleOpenDetail = (asset) => {
    setSelectedAsset(asset);
    setActiveModal('detail');
  };

  const handleOpenDelete = (asset) => {
    setSelectedAsset(asset);
    setActiveModal('delete');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedAsset(null);
  };

  const handleNavigateEdit = (asset) => {
    handleNavigate('edit', asset);
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'list':
        return (
          <AssetListPage
            onNavigate={handleNavigate}
            onOpenDetail={handleOpenDetail}
            onOpenDelete={handleOpenDelete}
            showToast={showToast}
          />
        );
      case 'add':
        return <AssetFormPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'edit':
        return <AssetFormPage onNavigate={handleNavigate} editAsset={editAsset} showToast={showToast} />;
      case 'checkout':
        return <AssetCheckoutPage onNavigate={handleNavigate} borrowAsset={borrowAsset} showToast={showToast} />;
      case 'transactions':
        return <TransactionsPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'history':
        return <HistoryLogPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'users':
        return <UsersPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} showToast={showToast} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="main-content">
        {renderPage()}
      </main>

      <Modals
        activeModal={activeModal}
        selectedAsset={selectedAsset}
        onClose={handleCloseModal}
        onNavigateEdit={handleNavigateEdit}
        showToast={showToast}
      />

      {/* Toast Container */}
      <div className="toast-container">
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
