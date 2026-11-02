import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  X, 
  Search, 
  FileText, 
  Building2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function QuotationSelectorBar({
  availableQuotations = [],
  selectedIds = [],
  onToggleQuote,
  onResetSelection
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter available quotes for the modal
  const filteredQuotes = availableQuotations.filter((q) => {
    const qNum = (q.quotationNumber || q.id || '').toLowerCase();
    const sName = (q.supplierName || '').toLowerCase();
    const desc = (q.description || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return qNum.includes(term) || sName.includes(term) || desc.includes(term);
  });

  const selectedQuotes = availableQuotations.filter((q) =>
    selectedIds.includes(q._id || q.id)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header and counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Selected Quotations</h2>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              selectedIds.length >= 2 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {selectedIds.length} of 4 Selected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select between 2 to 4 quotations for side-by-side normalisation and commercial trade-off analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={onResetSelection}
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition"
              title="Reset comparison selection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedIds.length >= 4}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-xs ${
              selectedIds.length >= 4
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Quotation</span>
          </button>
        </div>
      </div>

      {/* Selected Pills Container */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {selectedQuotes.map((q) => {
          const qId = q._id || q.id;
          const grandTotal = q.summary?.grandTotal || q.totalAmount || 0;
          return (
            <div
              key={qId}
              className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl px-3 py-2 flex items-center gap-2.5 transition shadow-2xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {q.quotationNumber || q.id}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                    {q.supplierName}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-blue-600">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
              <button
                onClick={() => onToggleQuote(qId)}
                className="w-5 h-5 rounded-md hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center transition ml-1"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {selectedQuotes.length === 0 && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2 flex items-center gap-2 w-full">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>No quotations currently selected. Click <strong>Add Quotation</strong> above to pick 2 to 4 quotations to compare.</span>
          </div>
        )}

        {selectedQuotes.length === 1 && (
          <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200/80 rounded-xl px-3.5 py-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Please select at least 1 more quotation to enable side-by-side comparison.</span>
          </div>
        )}
      </div>

      {/* Modal to pick quotations */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Select Quotations to Compare</h3>
                <p className="text-xs text-slate-500">Pick up to 4 quotations from your saved database records</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by quote #, supplier, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* List of Quotes */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredQuotes.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No quotations found matching your search.
                </div>
              ) : (
                filteredQuotes.map((q) => {
                  const qId = q._id || q.id;
                  const isSelected = selectedIds.includes(qId);
                  const isMaxReached = selectedIds.length >= 4 && !isSelected;
                  const grandTotal = q.summary?.grandTotal || q.totalAmount || 0;
                  const itemCount = q.items?.length || 1;

                  return (
                    <div
                      key={qId}
                      onClick={() => {
                        if (!isMaxReached) {
                          onToggleQuote(qId);
                        }
                      }}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500/20'
                          : isMaxReached
                          ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {q.quotationNumber || q.id}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-700">
                              {q.supplierName}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              q.status === 'Accepted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : q.status === 'Submitted'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {q.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                            <span>•</span>
                            <span>Lead time: {q.commercialTerms?.leadTimeDays || 7} days</span>
                            <span>•</span>
                            <span>Warranty: {q.commercialTerms?.warrantyMonths || 12} mo</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatCurrency(grandTotal)}
                        </div>
                        <div className="text-[10px] text-slate-400">Total Value</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {selectedIds.length} of 4 quotations selected
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
