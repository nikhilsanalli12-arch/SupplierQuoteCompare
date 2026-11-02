import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  Truck, 
  Calendar,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function CompareView({ quotations, preselectedQuoteIds = [] }) {
  // If preselected IDs exist, use them, otherwise pick the first 2-3 quotes
  const [selectedIds, setSelectedIds] = useState(() => {
    if (preselectedQuoteIds && preselectedQuoteIds.length >= 2) {
      return preselectedQuoteIds.slice(0, 3);
    }
    return quotations.slice(0, 3).map((q) => q.id);
  });

  const comparedQuotes = quotations.filter((q) => selectedIds.includes(q.id));

  // Determine best prices and lead times
  const minTotalPrice = comparedQuotes.length > 0 ? Math.min(...comparedQuotes.map((q) => q.totalAmount)) : 0;
  const maxTotalPrice = comparedQuotes.length > 0 ? Math.max(...comparedQuotes.map((q) => q.totalAmount)) : 0;
  const potentialSavings = maxTotalPrice - minTotalPrice;

  const minUnitPrice = comparedQuotes.length > 0 ? Math.min(...comparedQuotes.map((q) => q.unitPrice)) : 0;
  const minLeadTime = comparedQuotes.length > 0 ? Math.min(...comparedQuotes.map((q) => q.leadTimeDays)) : 0;

  const handleToggleQuote = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      } else {
        alert('Please keep at least 1 quotation to compare.');
      }
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare up to 3 quotations side-by-side for optimal clarity.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quotation Comparison Matrix</h2>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                Multi-Parametric
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Select 2 to 3 supplier quotations to evaluate commercial pricing, logistics & terms
            </p>
          </div>

          {/* Savings Metric Indicator */}
          {comparedQuotes.length >= 2 && potentialSavings > 0 && (
            <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-xl text-emerald-900">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-emerald-700">Variance Savings Opportunity</p>
                <p className="text-sm font-extrabold text-emerald-900">
                  Save ${potentialSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quote Selection Chips */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Select Quotes to Compare (Max 3):
          </span>
          <div className="flex flex-wrap gap-2">
            {quotations.map((q) => {
              const isSelected = selectedIds.includes(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => handleToggleQuote(q.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono font-bold">{q.id}</span>
                  <span>-</span>
                  <span className="font-semibold">{q.supplierName}</span>
                  <span className="text-[11px] opacity-80">(${q.totalAmount.toLocaleString()})</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Grid Matrix */}
      {comparedQuotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="font-semibold text-slate-700">No quotations currently selected</p>
          <p className="text-xs text-slate-500">Choose at least two quotations from the list above to view comparisons.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedQuotes.map((quote) => {
            const isLowestTotal = quote.totalAmount === minTotalPrice;
            const isLowestUnit = quote.unitPrice === minUnitPrice;
            const isFastest = quote.leadTimeDays === minLeadTime;

            return (
              <div
                key={quote.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-xs ${
                  isLowestTotal
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Highlight Badge if Lowest Total */}
                {isLowestTotal && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold py-1 px-4 text-center tracking-wide uppercase flex items-center justify-center gap-1.5 shadow-2xs">
                    <Award className="w-3.5 h-3.5" />
                    <span>Recommended Lowest Cost Option</span>
                  </div>
                )}

                <div className="p-6 space-y-5">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {quote.id}
                      </span>
                      <span className="text-slate-500 font-medium">{quote.category}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 mt-2">
                      {quote.supplierName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1" title={quote.product}>
                      {quote.product}
                    </p>
                  </div>

                  {/* Big Total Price Box */}
                  <div className={`p-4 rounded-xl text-center border ${
                    isLowestTotal
                      ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Total Commercial Value
                    </span>
                    <p className="text-3xl font-black mt-1">
                      ${quote.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      ${quote.unitPrice.toFixed(2)} unit price × {quote.quantity.toLocaleString()} units
                    </p>
                  </div>

                  {/* Key Highlights / Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {isLowestUnit && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        <DollarSign className="w-3 h-3" />
                        Best Unit Price (${quote.unitPrice.toFixed(2)})
                      </span>
                    )}
                    {isFastest && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Fastest Delivery ({quote.leadTimeDays}d)
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-slate-500" />
                      {quote.warrantyMonths || 12} mo warranty
                    </span>
                  </div>

                  {/* Structured Parameters Breakdown */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Quantity Requested</span>
                      <span className="font-bold text-slate-800">{quote.quantity.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Unit Price</span>
                      <span className="font-bold text-slate-800">${quote.unitPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Freight & Logistics</span>
                      <span className="font-bold text-slate-800">${quote.shippingCost.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Taxes & Duties</span>
                      <span className="font-bold text-slate-800">${quote.tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Delivery Lead Time</span>
                      <span className={`font-bold ${isFastest ? 'text-amber-600' : 'text-slate-800'}`}>
                        {quote.leadTimeDays} Business Days
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Payment Credit Terms</span>
                      <span className="font-bold text-slate-800">{quote.paymentTerms}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Quote Validity</span>
                      <span className="font-medium text-slate-600">{quote.validUntil || '2026-12-01'}</span>
                    </div>
                  </div>

                  {/* Notes snippet */}
                  {quote.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                      <strong className="text-slate-800">Note:</strong> {quote.notes}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${
                    quote.status === 'Approved' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    Status: {quote.status}
                  </span>
                  <button
                    onClick={() => alert(`Quotation ${quote.id} from ${quote.supplierName} selected as winning bid!`)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                      isLowestTotal
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Select Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
