import React from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Edit3, 
  ExternalLink 
} from 'lucide-react';

export default function SupplierDetailsModal({
  supplier,
  isOpen,
  onClose,
  onEdit
}) {
  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 font-extrabold text-base text-white">
              {supplier.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-blue-100">
                  {supplier.category}
                </span>
                <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {supplier.status || 'Active'}
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-white mt-0.5">{supplier.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium text-[11px]">Vendor Rating</span>
              <p className="font-extrabold text-base text-amber-600 mt-1 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {supplier.rating || 4.5} / 5.0
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium text-[11px]">Payment Terms</span>
              <p className="font-extrabold text-base text-slate-800 mt-1">
                {supplier.paymentTerms || 'Net 30'}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
              <span className="text-blue-600 font-medium text-[11px]">Active Quotes</span>
              <p className="font-extrabold text-base text-blue-700 mt-1">
                {supplier.activeQuotes || 0}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Contact & Representative Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-slate-500 font-medium">Contact Person</span>
                <p className="font-bold text-sm text-slate-900">{supplier.contactPerson}</p>
                <span className="text-[10px] text-slate-500">Authorized Procurement Agent</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-slate-500 font-medium">Email Address</span>
                <p className="font-bold text-sm text-blue-600">
                  <a href={`mailto:${supplier.email}`} className="hover:underline">
                    {supplier.email}
                  </a>
                </p>
                <span className="text-[10px] text-slate-500">Official RFQ Communications</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <p className="font-bold text-sm text-slate-900">{supplier.phone}</p>
                <span className="text-[10px] text-slate-500">Direct Office / Dispatch Line</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-slate-500 font-medium">Commercial Category</span>
                <p className="font-bold text-sm text-slate-900">{supplier.category}</p>
                <span className="text-[10px] text-slate-500">Primary Industry Classification</span>
              </div>
            </div>
          </div>

          {/* Business Address & Logistics */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Registered Business Address
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-sm">{supplier.address}</p>
                <p className="text-slate-600">{supplier.city}, {supplier.country || 'United States'}</p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Designated delivery origin for freight calculations.
                </p>
              </div>
            </div>
          </div>

          {/* Notes & Comments */}
          {supplier.notes && (
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Internal Procurement Notes
              </h4>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-xs">
                {supplier.notes}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onEdit(supplier);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Supplier Profile</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
