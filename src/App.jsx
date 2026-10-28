import React, { useState, useCallback } from 'react';
import Header from './components/functional/Header';
import Sidebar from './components/functional/Sidebar';
import InventoryMetrics from './components/functional/InventoryMetrics';
import ProductList from './components/functional/ProductList';
import ProductForm from './components/functional/ProductForm';
import Toast from './components/functional/Toast';
import AuditLogger from './components/class/AuditLogger';
import { useInventory } from './hooks/useInventory';

/**
 * Task 1: Root App Component Architecture
 * Coordinates functional components, custom hooks, and the legacy Class Component (AuditLogger).
 * Encapsulates global notifications, modal dialogs, and clean SaaS presentation.
 */
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const [latestAuditAction, setLatestAuditAction] = useState(null);

  // Requirement: useCallback for toast triggers
  const handleTriggerToast = useCallback((toastData) => {
    setActiveToast(toastData);
  }, []);

  // Pass action callback to inventory hook to drive AuditLogger class component
  const handleAuditAction = useCallback((action) => {
    setLatestAuditAction(action);
  }, []);

  // Custom hook managing inventory state & localStorage synchronization
  const { products, metrics, addProduct, updateStock, deleteProduct } =
    useInventory(handleAuditAction);

  const handleOpenAddProduct = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleCloseAddProduct = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleOpenAuditLog = useCallback(() => {
    setIsAuditOpen(true);
  }, []);

  const handleCloseAuditLog = useCallback(() => {
    setIsAuditOpen(false);
  }, []);

  const handleDismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuditLog={handleOpenAuditLog}
        metrics={metrics}
      />

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Sticky Header */}
        <Header
          onOpenAddProduct={handleOpenAddProduct}
          onOpenAuditLog={handleOpenAuditLog}
          metrics={metrics}
        />

        {/* Content Area */}
        <main className="content-area animate-fade-in">
          {/* Key Metric Overview Cards */}
          <InventoryMetrics metrics={metrics} />

          {/* Core Product Catalog & Filtering Controls */}
          <ProductList
            products={products}
            onUpdateStock={updateStock}
            onDeleteProduct={deleteProduct}
            onOpenAddProduct={handleOpenAddProduct}
          />
        </main>

        {/* Footer Branded strictly as requested */}
        <footer className="app-footer">
          Powered by <span>Mafa</span>
        </footer>
      </div>

      {/* Product Registration Modal (Functional Component with useRef) */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseAddProduct}
        onAddProduct={addProduct}
      />

      {/* Audit Logger Drawer (Task 3: Legacy Class Component with Lifecycle Methods) */}
      <AuditLogger
        isOpen={isAuditOpen}
        onClose={handleCloseAuditLog}
        incomingAction={latestAuditAction}
        onTriggerToast={handleTriggerToast}
      />

      {/* Dynamic Toast Notifications */}
      <Toast toast={activeToast} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
