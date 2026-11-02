import React from 'react';
import { 
  Building2, 
  Star, 
  MapPin, 
  Clock, 
  CreditCard, 
  Award, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SupplierPerformanceReport({
  suppliers = [],
  quotations = [],
  onSelectSupplier
}) {
  // Aggregate stats per supplier
  const supplierStats = suppliers.map((sup) => {
    const sId = sup._id || sup.id;
    const supQuotes = quotations.filter((q) => {
      const qSupId = q.supplierId?._id || q.supplierId?.id || q.supplierId;
      return qSupId?.toString() === sId?.toString() || q.supplierName === sup.name;
    });

    const quoteCount = supQuotes.length;
    const totalQuotedValue = supQuotes.reduce((sum, q) => sum + (q.summary?.grandTotal || q.totalAmount || 0), 0);
    const avgLeadTime = quoteCount > 0
      ? Math.round(supQuotes.reduce((sum, q) => sum + (q.commercialTerms?.leadTimeDays || 7), 0) / quoteCount)
      : 7;

    const acceptedCount = supQuotes.filter(q => q.status === 'Accepted').length;

    return {
      supplier: sup,
      id: sId,
      name: sup.name,
      category: sup.category,
      city: sup.city,
      country: sup.country,
      rating: sup.rating || 4.5,
      paymentTerms: sup.paymentTerms || 'Net 30',
      quoteCount,
      totalQuotedValue,
      avgLeadTime,
      acceptedCount
    };
  }).sort((a, b) => b.rating - a.rating || b.quoteCount - a.quoteCount);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
      <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Supplier Performance & Turnaround Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate vendor reliability, historical quote volume, average fulfillment lead times, and credit terms
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {supplierStats.length} Registered Vendors
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Supplier Profile</th>
              <th className="p-4">Industry Category</th>
              <th className="p-4 text-center">Quality Rating</th>
              <th className="p-4 text-center">Avg Lead Time</th>
              <th className="p-4 text-center">Credit Terms</th>
              <th className="p-4 text-right">Quoted Bids (Total)</th>
              <th className="p-4 text-right">Gross Evaluated Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {supplierStats.map((stat, idx) => (
              <tr 
                key={stat.id}
                onClick={() => onSelectSupplier && onSelectSupplier(stat.name)}
                className="hover:bg-slate-50/80 transition cursor-pointer"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0">
                      {stat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        {stat.name}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {[stat.city, stat.country].filter(Boolean).join(', ') || 'Global'}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-4 font-medium text-slate-600">
                  {stat.category}
                </td>

                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {stat.rating}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <span className="font-bold text-slate-800">
                    {stat.avgLeadTime} Business Days
                  </span>
                </td>

                <td className="p-4 text-center font-semibold text-slate-700">
                  {stat.paymentTerms}
                </td>

                <td className="p-4 text-right">
                  <span className="font-bold text-slate-900">{stat.quoteCount}</span>
                  {stat.acceptedCount > 0 && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {stat.acceptedCount} Accepted
                    </span>
                  )}
                </td>

                <td className="p-4 text-right font-black text-slate-900">
                  {formatCurrency(stat.totalQuotedValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
