import React from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Edit3,
  Layers,
  Scale
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function QuotationDetailsModal({
  quote,
  isOpen,
  onClose,
  onEdit,
  onStatusChange
}) {
  if (!isOpen || !quote) return null;

  const items = quote.items || [];
  const terms = quote.commercialTerms || {};
  const summary = quote.summary || {
    grossSubtotal: quote.grossSubtotal || quote.totalAmount || 0,
    totalDiscount: quote.totalDiscount || 0,
    totalTax: quote.totalTax || quote.tax || 0,
    deliveryCharges: terms.deliveryCharges || quote.shippingCost || 0,
    additionalCharges: terms.additionalCharges || 0,
    grandTotal: quote.grandTotal || quote.totalAmount || 0
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case 'Submitted':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <Clock className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
            <AlertCircle className="w-3.5 h-3.5" />
            Draft
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-blue-400 tracking-wider">
                  {quote.quotationNumber || quote.id}
                </span>
                {getStatusBadge(quote.status)}
              </div>
              <h3 className="font-bold text-lg text-white mt-0.5">
                {quote.description || (items[0]?.name ? `${items[0].name} (${items.length} item(s))` : 'Quotation Details')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs text-slate-700 flex-1">
          {/* Supplier Info & Meta Strip */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{quote.supplierName}</p>
                <p className="text-[11px] text-slate-500">
                  {quote.supplierId?.email ? `${quote.supplierId.email} • ` : ''}
                  {quote.supplierId?.category || 'Registered Vendor'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Quoted On</span>
                <span className="font-semibold text-slate-800">{formatDate(quote.quotationDate || quote.date)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Valid Until</span>
                <span className="font-semibold text-slate-800">{formatDate(quote.validUntil)}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Product & Service Line Items ({items.length})
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Item / Service</th>
                    <th className="py-2.5 px-3 text-center">Order Qty</th>
                    <th className="py-2.5 px-3 text-center">Pack Size</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Disc / Tax</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                    <th className="py-2.5 px-3 text-right">Normalised</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        {item.description && (
                          <p className="text-[10px] text-slate-500">{item.description}</p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                        {item.quantity} {item.measurementUnit}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {item.packageSize ? `${item.packageSize} ${item.measurementUnit}` : '1.0'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[11px]">
                        <span className="text-emerald-700 font-semibold">{item.discountPercent || 0}%</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-blue-700 font-semibold">{item.taxPercent || 0}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                        {formatCurrency(item.lineTotal)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[11px] font-semibold text-indigo-700">
                        {item.normalisedUnitPrice ? (
                          `${formatCurrency(item.normalisedUnitPrice)} / ${item.normalisedBaseUnit || item.measurementUnit}`
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commercial Terms & Supply Conditions */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Commercial & Fulfillment Terms
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Delivery Lead Time</span>
                <p className="font-extrabold text-slate-900 text-sm mt-1">
                  {terms.leadTimeDays || quote.leadTimeDays || 7} Business Days
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Warranty Period</span>
                <p className="font-extrabold text-slate-900 text-sm mt-1">
                  {terms.warrantyMonths || quote.warrantyMonths || 12} Months
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Payment Terms</span>
                <p className="font-extrabold text-slate-900 text-sm mt-1">
                  {terms.paymentTerms || quote.paymentTerms || 'Net 30'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Min. Order Qty</span>
                <p className="font-extrabold text-slate-900 text-sm mt-1">
                  {terms.minOrderQuantity || 1} Units
                </p>
              </div>
            </div>

            {terms.notes && (
              <div className="mt-2.5 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                <strong className="font-bold">Terms & Conditions: </strong>
                {terms.notes}
              </div>
            )}
          </div>

          {/* Financial Calculation Summary */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <span className="font-bold text-xs uppercase tracking-wider text-blue-300 block">
              Cost & Surcharge Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-800 pb-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Gross Subtotal</span>
                <span className="font-bold text-white">{formatCurrency(summary.grossSubtotal)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Discounts Applied</span>
                <span className="font-bold text-emerald-400">-{formatCurrency(summary.totalDiscount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Taxes & Surcharges</span>
                <span className="font-bold text-blue-300">+{formatCurrency(summary.totalTax)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Freight & Extra Fees</span>
                <span className="font-bold text-white">
                  +{formatCurrency(Number(summary.deliveryCharges || 0) + Number(summary.additionalCharges || 0))}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-300">Final Quotation Total:</span>
              <span className="text-2xl font-black text-white">
                {formatCurrency(summary.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onStatusChange && (
              <>
                <button
                  onClick={() => onStatusChange(quote._id || quote.id, 'Accepted')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Quotation</span>
                </button>
                <button
                  onClick={() => onStatusChange(quote._id || quote.id, 'Rejected')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(quote);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Quotation</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
