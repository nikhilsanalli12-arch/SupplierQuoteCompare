import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Layers,
  ArrowLeftRight
} from 'lucide-react';
import QuotationTable from '../components/quotations/QuotationTable';
import QuotationFormModal from '../components/quotations/QuotationFormModal';
import QuotationDetailsModal from '../components/quotations/QuotationDetailsModal';
import DeleteQuoteModal from '../components/quotations/DeleteQuoteModal';
import EmptyState from '../components/common/EmptyState';
import { quotationService, supplierService } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function QuotationsView({ onCompareQuotes }) {
  // State
  const [quotations, setQuotations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSupplierId, setSelectedSupplierId] = useState('All');

  // Sorting
  const [sortField, setSortField] = useState('quotationDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [deletingQuote, setDeletingQuote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Quotations & Suppliers from Backend MongoDB API
  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [quotesData, supsData] = await Promise.all([
        quotationService.getAll({
          search: searchQuery,
          status: selectedStatus,
          supplierId: selectedSupplierId
        }),
        supplierService.getAll()
      ]);
      setQuotations(quotesData);
      setSuppliers(supsData);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load quotations from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedStatus, selectedSupplierId]);

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedQuotations = [...quotations].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'grandTotal') {
      aVal = Number(a.summary?.grandTotal || a.grandTotal || a.totalAmount || 0);
      bVal = Number(b.summary?.grandTotal || b.grandTotal || b.totalAmount || 0);
    } else if (sortField === 'quotationDate') {
      aVal = new Date(a.quotationDate || a.date || 0).getTime();
      bVal = new Date(b.quotationDate || b.date || 0).getTime();
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // KPI calculations
  const totalPipelineValue = quotations.reduce((acc, q) => {
    return acc + Number(q.summary?.grandTotal || q.grandTotal || q.totalAmount || 0);
  }, 0);

  const submittedQuotes = quotations.filter((q) => q.status === 'Submitted' || q.status === 'Pending');
  const acceptedQuotes = quotations.filter((q) => q.status === 'Accepted' || q.status === 'Approved');
  const draftQuotes = quotations.filter((q) => q.status === 'Draft');

  // CRUD Handlers
  const handleCreateQuote = async (formData) => {
    const created = await quotationService.create(formData);
    showToast(`Quotation ${created.quotationNumber} saved to database!`);
    await fetchData();
  };

  const handleUpdateQuote = async (formData) => {
    const id = editingQuote._id || editingQuote.id;
    const updated = await quotationService.update(id, formData);
    showToast(`Quotation ${updated.quotationNumber} updated successfully!`);
    setEditingQuote(null);
    await fetchData();
  };

  const handleDeleteQuote = async (quote) => {
    setIsDeleting(true);
    try {
      const id = quote._id || quote.id;
      await quotationService.delete(id);
      showToast(`Quotation ${quote.quotationNumber || quote.id} permanently removed.`);
      setDeletingQuote(null);
      await fetchData();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      await quotationService.update(quoteId, { status: newStatus });
      showToast(`Quotation status updated to "${newStatus}"!`);
      if (viewingQuote) {
        setViewingQuote((prev) => ({ ...prev, status: newStatus }));
      }
      await fetchData();
    } catch (err) {
      alert(`Status update error: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['QuotationNumber,Supplier,ItemsCount,TotalAmount,Currency,LeadTimeDays,WarrantyMonths,PaymentTerms,Status,QuotationDate,ValidUntil'];
    const rows = quotations.map((q) => {
      const total = q.summary?.grandTotal || q.grandTotal || q.totalAmount || 0;
      const leadTime = q.commercialTerms?.leadTimeDays || q.leadTimeDays || 7;
      const warranty = q.commercialTerms?.warrantyMonths || q.warrantyMonths || 12;
      const paymentTerms = q.commercialTerms?.paymentTerms || q.paymentTerms || 'Net 30';
      const itemsCount = q.items?.length || 1;
      return `"${q.quotationNumber || q.id}","${q.supplierName}",${itemsCount},${total},"INR",${leadTime},${warranty},"${paymentTerms}","${q.status}","${q.quotationDate || q.date}","${q.validUntil}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quotations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quotations Management</h2>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
              {quotations.length} Bids Total
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Create, audit, review and compare multi-product rate bids with dynamic line items
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={fetchData}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition border border-slate-200"
            title="Refresh Quotations"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingQuote(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quotation</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Strip (INR ₹) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(totalPipelineValue)}
          </p>
          <span className="text-[10px] text-slate-500">{quotations.length} total quotations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Submitted / Pending</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-blue-600 mt-1">
            {submittedQuotes.length}
          </p>
          <span className="text-[10px] text-slate-500">Awaiting commercial review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Accepted Bids</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600 mt-1">
            {acceptedQuotes.length}
          </p>
          <span className="text-[10px] text-slate-500">Approved for PO issuance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Draft Quotations</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 mt-1">
            {draftQuotes.length}
          </p>
          <span className="text-[10px] text-slate-500">Incomplete or pending data</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by quote #, vendor, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          {/* Supplier Dropdown Filter */}
          <div>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="All">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs / Dropdown Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(selectedStatus !== 'All' || selectedSupplierId !== 'All' || searchQuery) && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-600 font-semibold">Active Filters:</span>
            {selectedStatus !== 'All' && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Status: {selectedStatus}
              </span>
            )}
            {selectedSupplierId !== 'All' && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Supplier: {suppliers.find(s => (s._id || s.id) === selectedSupplierId)?.name || selectedSupplierId}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                Search: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedStatus('All');
                setSelectedSupplierId('All');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-bold text-xs ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={fetchData}
            className="font-bold underline text-rose-700 hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content: Loading Skeleton vs Empty vs Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="font-semibold text-slate-700">Connecting to database & loading quotations...</p>
        </div>
      ) : sortedQuotations.length === 0 ? (
        <EmptyState
          title="No quotations found"
          description="Create a new multi-line item quotation linked to a registered vendor, or adjust your search filters."
          actionLabel="Create Quotation"
          onAction={() => {
            setEditingQuote(null);
            setIsFormOpen(true);
          }}
          icon={FileSpreadsheet}
        />
      ) : (
        <QuotationTable
          quotations={sortedQuotations}
          onViewDetails={(quote) => setViewingQuote(quote)}
          onEditQuote={(quote) => {
            setEditingQuote(quote);
            setIsFormOpen(true);
          }}
          onDeleteQuote={(quote) => setDeletingQuote(quote)}
          onCompareQuotes={onCompareQuotes}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {/* Modals */}
      <QuotationFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingQuote(null);
        }}
        onSubmit={editingQuote ? handleUpdateQuote : handleCreateQuote}
        suppliers={suppliers}
        initialData={editingQuote}
        isEdit={!!editingQuote}
      />

      <QuotationDetailsModal
        isOpen={!!viewingQuote}
        quote={viewingQuote}
        onClose={() => setViewingQuote(null)}
        onEdit={(quote) => {
          setViewingQuote(null);
          setEditingQuote(quote);
          setIsFormOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      <DeleteQuoteModal
        isOpen={!!deletingQuote}
        quote={deletingQuote}
        onClose={() => setDeletingQuote(null)}
        onConfirm={handleDeleteQuote}
        isDeleting={isDeleting}
      />

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
