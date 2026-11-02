import React from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Calendar,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function SupplierOverviewCards({
  quotations = [],
  insights = {}
}) {
  const lowestTotalId = insights.lowestCostQuote?.id;
  const fastestDeliveryId = insights.fastestDeliveryQuote?.id;
  const longestWarrantyId = insights.longestWarrantyQuote?.id;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {quotations.map((quote) => {
        const qId = quote._id || quote.id;
        const grandTotal = quote.summary?.grandTotal || quote.totalAmount || 0;
        const supplier = quote.supplierId || {};

        const isLowestTotal = lowestTotalId && qId.toString() === lowestTotalId.toString();
        const isFastest = fastestDeliveryId && qId.toString() === fastestDeliveryId.toString();
        const isLongestWarranty = longestWarrantyId && qId.toString() === longestWarrantyId.toString();

        const leadDays = quote.commercialTerms?.leadTimeDays || 7;
        const warrantyMo = quote.commercialTerms?.warrantyMonths || 12;
        const payTerms = quote.commercialTerms?.paymentTerms || supplier.paymentTerms || 'Net 30';

        return (
          <div
            key={qId}
            className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs relative ${
              isLowestTotal
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            {/* Top Recommended Banner for Lowest Total */}
            {isLowestTotal && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold py-1 px-3 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-2xs">
                <Award className="w-3.5 h-3.5" />
                <span>Lowest Commercial Cost</span>
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Header with Quote # and Category */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {quote.quotationNumber || quote.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    quote.status === 'Accepted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : quote.status === 'Submitted'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {quote.status}
                  </span>
                </div>

                {/* Supplier Name and Profile */}
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {quote.supplierName}
                </h3>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  {supplier.category && <span>{supplier.category}</span>}
                  {(supplier.city || supplier.country) && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {[supplier.city, supplier.country].filter(Boolean).join(', ')}
                      </span>
                    </>
                  )}
                  {supplier.rating && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {supplier.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Grand Total Value Box */}
              <div className={`p-4 rounded-xl text-center border ${
                isLowestTotal
                  ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-900'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Grand Total (Incl. Taxes & Logistics)
                </span>
                <p className="text-2xl font-black mt-1 text-slate-900">
                  {formatCurrency(grandTotal)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {(quote.items || []).length} {(quote.items || []).length === 1 ? 'line item' : 'line items'}
                </p>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                {isLowestTotal && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    <TrendingDown className="w-3 h-3" />
                    Lowest Bid
                  </span>
                )}
                {isFastest && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3 h-3" />
                    Fastest Delivery ({leadDays}d)
                  </span>
                )}
                {isLongestWarranty && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Longest Warranty ({warrantyMo}m)
                  </span>
                )}
              </div>

              {/* Commercial Terms Summary */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Delivery Lead Time
                  </span>
                  <span className={`font-bold ${isFastest ? 'text-amber-600 font-extrabold' : 'text-slate-800'}`}>
                    {leadDays} Days
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Warranty Protection
                  </span>
                  <span className={`font-bold ${isLongestWarranty ? 'text-emerald-600 font-extrabold' : 'text-slate-800'}`}>
                    {warrantyMo} Months
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    Credit Terms
                  </span>
                  <span className="font-semibold text-slate-800">
                    {payTerms}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Quote Validity
                  </span>
                  <span className="text-slate-600 font-medium text-[11px]">
                    {formatDate(quote.validUntil)}
                  </span>
                </div>
              </div>
            </div>

            {/* Note Snippet */}
            {quote.commercialTerms?.notes && (
              <div className="px-5 pb-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 italic line-clamp-2" title={quote.commercialTerms.notes}>
                  "{quote.commercialTerms.notes}"
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
