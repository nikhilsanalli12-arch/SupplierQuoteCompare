import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import SuppliersView from './views/SuppliersView';
import QuotationsView from './views/QuotationsView';
import CompareView from './views/CompareView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import QuotationFormModal from './components/quotations/QuotationFormModal';
import QuotationDetailsModal from './components/quotations/QuotationDetailsModal';
import SupplierFormModal from './components/suppliers/SupplierFormModal';
import { initialSuppliers, initialQuotations, initialComparisons } from './data/mockData';
import { supplierService, quotationService } from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Application Data States (Synced with MongoDB)
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

  // Sync data from backend API
  const syncData = async () => {
    try {
      const [sups, quotes] = await Promise.all([
        supplierService.getAll(),
        quotationService.getAll()
      ]);
      if (sups && sups.length > 0) setSuppliers(sups);
      if (quotes && quotes.length > 0) setQuotations(quotes);
    } catch {
      // Fallbacks are handled inside services
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  // Add new quotation handler
  const handleAddQuotation = async (newQuote) => {
    try {
      const created = await quotationService.create(newQuote);
      await syncData();
      showToast(`Quotation ${created.quotationNumber} saved to database!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Add new supplier handler
  const handleAddSupplier = async (newSupplier) => {
    try {
      const created = await supplierService.create(newSupplier);
      await syncData();
      showToast(`Supplier ${created.name} registered successfully!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Update quotation status handler
  const handleUpdateQuotationStatus = async (quoteId, newStatus) => {
    try {
      await quotationService.update(quoteId, { status: newStatus });
      await syncData();
      showToast(`Quotation status updated to "${newStatus}"!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
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

  const pendingCount = quotations.filter((q) => q.status === 'Submitted' || q.status === 'Pending').length;

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
                  onSelectSupplierQuotes={handleSelectSupplierQuotes}
                />
              } 
            />
            <Route 
              path="/quotations" 
              element={
                <QuotationsView
                  onCompareQuotes={handleCompareQuotes}
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
                  onSelectSupplier={handleSelectSupplierQuotes}
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

      {/* Global Quotation Creation Modal (Multi-Line Items) */}
      <QuotationFormModal
        isOpen={isNewQuotationOpen}
        onClose={() => setIsNewQuotationOpen(false)}
        onSubmit={handleAddQuotation}
        suppliers={suppliers}
      />

      {/* Global Supplier Creation Modal */}
      <SupplierFormModal
        isOpen={isNewSupplierOpen}
        onClose={() => setIsNewSupplierOpen(false)}
        onSubmit={handleAddSupplier}
      />

      {/* Global Quotation Details Modal */}
      <QuotationDetailsModal
        quote={viewingQuotation}
        isOpen={!!viewingQuotation}
        onClose={() => setViewingQuotation(null)}
        onStatusChange={handleUpdateQuotationStatus}
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
