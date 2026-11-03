import React from 'react';
import { 
  X, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  DollarSign, 
  Truck,
  ArrowLeftRight
} from 'lucide-react';

export default function QuotationDetailModal({ 
  quote, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onCompare 
}) {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-blue-400 font-bold">{quote.id}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  quote.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                  quote.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                  quote.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {quote.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mt-0.5">{quote.product}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Supplier Info Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{quote.supplierName}</p>
                <p className="text-slate-600 text-xs">Supplier ID: {quote.supplierId} • Category: {quote.category}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-600 block">Quotation Date</span>
              <span className="font-semibold text-slate-800">{quote.date}</span>
            </div>
          </div>

          {/* Commercial Breakdown */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Commercial Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-slate-600 text-[11px]">Quantity</p>
                <p className="font-extrabold text-base text-slate-900 mt-1">{(Number(quote.quantity ?? quote.items?.[0]?.quantity ?? 1)).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-slate-600 text-[11px]">Unit Price</p>
                <p className="font-extrabold text-base text-slate-900 mt-1">${(Number(quote.unitPrice ?? quote.items?.[0]?.unitPrice ?? 0)).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-slate-600 text-[11px]">Freight / Shipping</p>
                <p className="font-extrabold text-base text-slate-900 mt-1">${(Number(quote.shippingCost ?? quote.commercialTerms?.deliveryCharges ?? 0)).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                <p className="text-blue-700 text-[11px] font-semibold">Total Cost</p>
                <p className="font-extrabold text-base text-blue-700 mt-1">
                  ${(Number(quote.totalAmount ?? quote.summary?.grandTotal ?? quote.grandTotal ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Purchasing Terms */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Purchasing & Supply Terms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold">Lead Time</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{quote.leadTimeDays} Business Days</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">Payment Terms</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{quote.paymentTerms || 'Net 30'}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-semibold">Warranty Period</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{quote.warrantyMonths || 12} Months Warranty</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900">
              <p className="font-semibold mb-1">Supplier Commercial Remarks:</p>
              <p className="text-slate-700 leading-relaxed">{quote.notes}</p>
            </div>
          )}

          {/* Status Decision Controls */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Procurement Decision & Action
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(quote.id, 'Approved');
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Quotation
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(quote.id, 'Under Negotiation');
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center justify-center gap-1.5 transition"
              >
                <AlertCircle className="w-4 h-4" />
                Start Negotiation
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(quote.id, 'Rejected');
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold inline-flex items-center justify-center gap-1.5 transition"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
