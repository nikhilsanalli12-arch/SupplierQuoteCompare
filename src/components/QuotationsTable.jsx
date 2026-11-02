import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  ArrowLeftRight,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function QuotationsTable({ 
  quotations = [], 
  onViewQuotation, 
  onCompareQuotes,
  searchQuery = '',
  setSearchQuery,
  limit
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter logic
  const filteredQuotes = quotations.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.id.toLowerCase().includes(query) ||
      item.supplierName.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Sort logic
  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'totalAmount') {
      aVal = Number(a.totalAmount);
      bVal = Number(b.totalAmount);
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const displayQuotes = limit ? sortedQuotes.slice(0, limit) : sortedQuotes;

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === displayQuotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayQuotes.map((q) => q.id));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending Review
          </span>
        );
      case 'Under Negotiation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
            Under Negotiation
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">Recent Quotations</h3>
            <p className="text-xs text-slate-600">Track and review pricing submitted by registered vendors</p>
          </div>

          {/* Quick Selection Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl animate-in fade-in">
              <span className="text-xs font-semibold text-blue-800">
                {selectedIds.length} quotes selected
              </span>
              <button
                onClick={() => onCompareQuotes && onCompareQuotes(selectedIds)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                <ArrowLeftRight className="w-3 h-3" />
                Compare Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-600 hover:text-slate-800 underline px-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Filters and search row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Pending', 'Approved', 'Under Negotiation', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Table search field (if setSearchQuery provided) */}
          {setSearchQuery && (
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === displayQuotes.length}
                  onChange={handleSelectAll}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                  aria-label="Select all quotes"
                />
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-600"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  <span>Quotation ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-600"
                onClick={() => handleSort('supplierName')}
              >
                <div className="flex items-center gap-1">
                  <span>Supplier Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Product / Item</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-600 text-right"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-600"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayQuotes.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-600">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-700">No quotations found</p>
                    <p className="text-xs text-slate-600">Try adjusting your status filter or search keywords.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayQuotes.map((quote) => {
                const isSelected = selectedIds.includes(quote.id);
                return (
                  <tr 
                    key={quote.id} 
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isSelected ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectToggle(quote.id)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                        aria-label={`Select quotation ${quote.id}`}
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {quote.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                          {quote.supplierName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {quote.supplierName}
                          </p>
                          <span className="text-[10px] text-slate-600">
                            {quote.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 line-clamp-1 max-w-xs" title={quote.product}>
                        {quote.product}
                      </p>
                      <span className="text-[10px] text-slate-600">
                        Qty: {quote.quantity.toLocaleString()} • Lead: {quote.leadTimeDays}d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-bold text-slate-900 text-sm">
                        ${quote.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] text-slate-600">
                        ${quote.unitPrice.toFixed(2)} / unit
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {quote.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewQuotation(quote)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onCompareQuotes && onCompareQuotes([quote.id])}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Compare this quote"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 gap-2">
        <span>
          Showing <strong className="text-slate-800 font-semibold">{displayQuotes.length}</strong> of <strong className="text-slate-800 font-semibold">{quotations.length}</strong> quotations
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Currency: USD ($) • Updated today</span>
        </div>
      </div>
    </div>
  );
}
