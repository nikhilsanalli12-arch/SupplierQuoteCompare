import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function DeleteQuoteModal({
  isOpen,
  onClose,
  onConfirm,
  quote,
  isDeleting = false
}) {
  if (!isOpen || !quote) return null;

  const quoteNo = quote.quotationNumber || quote.id;
  const totalAmount = quote.summary?.grandTotal || quote.grandTotal || quote.totalAmount || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              Delete Quotation?
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Are you sure you want to permanently delete quotation <strong className="font-mono text-slate-900">{quoteNo}</strong> from <strong className="text-slate-900 font-semibold">{quote.supplierName}</strong>?
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Items Count:</span>
              <span className="font-bold text-slate-800">{quote.items?.length || 1} line item(s)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Value:</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 text-xs">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(quote)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-xl shadow-xs transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
