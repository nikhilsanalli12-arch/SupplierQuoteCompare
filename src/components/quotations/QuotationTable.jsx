import React, { useState } from 'react';
import { 
  Building2, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowLeftRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function QuotationTable({
  quotations = [],
  onViewDetails,
  onEditQuote,
  onDeleteQuote,
  onCompareQuotes,
  sortField,
  sortDirection,
  onSort
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === quotations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(quotations.map((q) => q._id || q.id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Accepted
          </span>
        );
      case 'Submitted':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Submitted
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Draft
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Multi-Select Bar if quotes are checked */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-blue-50/80 border-b border-blue-200 flex items-center justify-between text-xs px-4 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-900">{selectedIds.length} quotation(s) selected</span>
            <span className="text-slate-500 text-[11px]">• ready for side-by-side comparison</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCompareQuotes && onCompareQuotes(selectedIds)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-600 hover:text-slate-900 underline px-1 font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={quotations.length > 0 && selectedIds.length === quotations.length}
                  onChange={handleSelectAll}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                  aria-label="Select all quotations"
                />
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition"
                onClick={() => onSort('quotationNumber')}
              >
                <div className="flex items-center gap-1">
                  <span>Quote Ref #</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition"
                onClick={() => onSort('supplierName')}
              >
                <div className="flex items-center gap-1">
                  <span>Supplier Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Line Items</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition text-right"
                onClick={() => onSort('grandTotal')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Lead Time</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition"
                onClick={() => onSort('quotationDate')}
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotations.map((quote) => {
              const id = quote._id || quote.id;
              const isSelected = selectedIds.includes(id);
              const items = quote.items || [];
              const firstItem = items[0]?.name || quote.product || 'Commercial Quote';
              const remainingCount = items.length > 1 ? items.length - 1 : 0;
              const totalAmount = quote.summary?.grandTotal || quote.grandTotal || quote.totalAmount || 0;
              const leadTime = quote.commercialTerms?.leadTimeDays || quote.leadTimeDays || 7;

              return (
                <tr 
                  key={id} 
                  className={`hover:bg-blue-50/40 transition-colors ${
                    isSelected ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectToggle(id)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                      aria-label={`Select quotation ${quote.quotationNumber || id}`}
                    />
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    <span 
                      onClick={() => onViewDetails(quote)}
                      className="cursor-pointer hover:underline"
                    >
                      {quote.quotationNumber || quote.id}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                        {(quote.supplierName || 'SU').substring(0, 2).toUpperCase()}
                      </div>
                      <p className="font-semibold text-slate-900 leading-tight">
                        {quote.supplierName}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 max-w-xs">
                      <span className="font-medium text-slate-800 truncate" title={firstItem}>
                        {firstItem}
                      </span>
                      {remainingCount > 0 && (
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                          +{remainingCount}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <p className="font-extrabold text-slate-900 text-sm">
                      {formatCurrency(totalAmount)}
                    </p>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {items.length} item(s)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                    {leadTime}d
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(quote.status)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {formatDate(quote.quotationDate || quote.date)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(quote)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Complete Quotation"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditQuote(quote)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Edit Quotation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onCompareQuotes && onCompareQuotes([id])}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Compare Quotation"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteQuote(quote)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Quotation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
