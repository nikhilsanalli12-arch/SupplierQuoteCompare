import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import SuppliersView from './views/SuppliersView';
import QuotationsView from './views/QuotationsView';
import CompareView from './views/CompareView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import NewQuotationModal from './components/NewQuotationModal';
import NewSupplierModal from './components/NewSupplierModal';
import QuotationDetailModal from './components/QuotationDetailModal';
import { initialSuppliers, initialQuotations, initialComparisons } from './data/mockData';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Application Data States
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [quotations, setQuotations] = useState(initialQuotations);
  const [comparisons, setComparisons] = useState(initialComparisons);
  
  // Search & Navigation Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [preselectedCompareIds, setPreselectedCompareIds] = useState([]);

  // Modal Control States
  const [isNewQuotationOpen, setIsNewQuotationOpen] = useState(false);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [viewingQuotation, setViewingQuotation] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add new quotation handler
  const handleAddQuotation = (newQuote) => {
    setQuotations((prev) => [newQuote, ...prev]);
    // increment supplier active quote count
    setSuppliers((prev) =>
      prev.map((s) => (s.id === newQuote.supplierId ? { ...s, activeQuotes: s.activeQuotes + 1 } : s))
    );
    showToast(`Quotation ${newQuote.id} added successfully for ${newQuote.supplierName}!`);
  };

  // Add new supplier handler
  const handleAddSupplier = (newSupplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
    showToast(`Supplier ${newSupplier.name} registered successfully!`);
  };

  // Update quotation status handler (e.g. Approved, Rejected, Under Negotiation)
  const handleUpdateQuotationStatus = (quoteId, newStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );
    showToast(`Quotation ${quoteId} status updated to "${newStatus}"!`);
  };

  // Trigger compare from any view with specific quote IDs
  const handleCompareQuotes = (quoteIds) => {
    setPreselectedCompareIds(quoteIds);
    navigate('/compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter quotes from supplier click
  const handleSelectSupplierQuotes = (supplierName) => {
    setSearchQuery(supplierName);
    navigate('/quotations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = quotations.filter((q) => q.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onNewQuotationClick={() => setIsNewQuotationOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={pendingCount}
        />

        {/* Dynamic Main View via React Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route 
              path="/" 
              element={
                <DashboardView
                  suppliers={suppliers}
                  quotations={quotations}
                  comparisons={comparisons}
                  onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
                  onNewQuotation={() => setIsNewQuotationOpen(true)}
                  onNewSupplier={() => setIsNewSupplierOpen(true)}
                  onViewQuotation={(quote) => setViewingQuotation(quote)}
                  onCompareQuotes={handleCompareQuotes}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              } 
            />
            <Route 
              path="/suppliers" 
              element={
                <SuppliersView
                  suppliers={suppliers}
                  onNewSupplier={() => setIsNewSupplierOpen(true)}
                  onSelectSupplierQuotes={handleSelectSupplierQuotes}
                />
              } 
            />
            <Route 
              path="/quotations" 
              element={
                <QuotationsView
                  quotations={quotations}
                  onNewQuotation={() => setIsNewQuotationOpen(true)}
                  onViewQuotation={(quote) => setViewingQuotation(quote)}
                  onCompareQuotes={handleCompareQuotes}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              } 
            />
            <Route 
              path="/compare" 
              element={
                <CompareView
                  quotations={quotations}
                  preselectedQuoteIds={preselectedCompareIds}
                />
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ReportsView
                  quotations={quotations}
                  suppliers={suppliers}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <SettingsView />
              } 
            />
          </Routes>
        </main>
      </div>

      {/* Interactive Modals */}
      <NewQuotationModal
        isOpen={isNewQuotationOpen}
        onClose={() => setIsNewQuotationOpen(false)}
        suppliers={suppliers}
        onAddQuotation={handleAddQuotation}
      />

      <NewSupplierModal
        isOpen={isNewSupplierOpen}
        onClose={() => setIsNewSupplierOpen(false)}
        onAddSupplier={handleAddSupplier}
      />

      <QuotationDetailModal
        quote={viewingQuotation}
        isOpen={!!viewingQuotation}
        onClose={() => setViewingQuotation(null)}
        onUpdateStatus={handleUpdateQuotationStatus}
        onCompare={(id) => handleCompareQuotes([id])}
      />

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
