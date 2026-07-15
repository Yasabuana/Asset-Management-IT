import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { DashboardPage } from './components/DashboardPage.jsx';
import { AssetListPage } from './components/AssetListPage.jsx';
import { AssetFormPage } from './components/AssetFormPage.jsx';
import { HistoryLogPage } from './components/HistoryLogPage.jsx';
import { Modals } from './components/Modals.jsx';

export function App() {
  // Routing state
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editAsset, setEditAsset] = useState(null);

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
      setCurrentPage('edit');
    } else {
      setEditAsset(null);
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
      case 'history':
        return <HistoryLogPage onNavigate={handleNavigate} showToast={showToast} />;
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
