import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  supplier,
  isDeleting = false
}) {
  if (!isOpen || !supplier) return null;

  const hasQuotes = (supplier.activeQuotes || 0) > 0;

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
              Delete Supplier?
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Are you sure you want to permanently remove <strong className="text-slate-900 font-semibold">{supplier.name}</strong> from the database?
            </p>
          </div>

          {hasQuotes && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Active Quotations Linked</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  This supplier has {supplier.activeQuotes} active quotation(s) associated with them. Deleting this vendor will permanently remove these links.
                </p>
              </div>
            </div>
          )}

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
              onClick={() => onConfirm(supplier, hasQuotes)}
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
