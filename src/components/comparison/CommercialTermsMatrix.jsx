import React from 'react';
import { 
  FileText, 
  Truck, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  DollarSign, 
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CommercialTermsMatrix({
  quotations = [],
  insights = {}
}) {
  const lowestTotalId = insights.lowestCostQuote?.id;
  const fastestDeliveryId = insights.fastestDeliveryQuote?.id;
  const longestWarrantyId = insights.longestWarrantyQuote?.id;

  // Find lowest delivery charge
  const deliveryCharges = quotations.map((q) => q.commercialTerms?.deliveryCharges || 0);
  const minDelivery = Math.min(...deliveryCharges);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Commercial Terms & Cost Breakdown Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side comparison of pricing structures, logistics, warranty guarantees, and credit terms
          </p>
        </div>
      </div>

      {/* Structured Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-4 w-1/4 min-w-[200px]">Commercial Parameter</th>
              {quotations.map((quote) => {
                const qId = quote._id || quote.id;
                const isLowest = lowestTotalId && qId.toString() === lowestTotalId.toString();
                return (
                  <th key={qId} className={`p-4 min-w-[180px] ${isLowest ? 'bg-blue-50/50 text-blue-900' : 'text-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm">{quote.supplierName}</span>
                      {isLowest && (
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                          Lowest Total
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-semibold block mt-0.5">
                      {quote.quotationNumber || quote.id}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* 1. Products Subtotal */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                Products Subtotal
              </td>
              {quotations.map((quote) => {
                const subtotal = quote.summary?.productSubtotal || quote.summary?.grossSubtotal || 0;
                return (
                  <td key={quote._id || quote.id} className="p-4 font-bold text-slate-800">
                    {formatCurrency(subtotal)}
                  </td>
                );
              })}
            </tr>

            {/* 2. Total Discounts */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                Discounts Applied
              </td>
              {quotations.map((quote) => {
                const discount = quote.summary?.totalDiscount || 0;
                return (
                  <td key={quote._id || quote.id} className="p-4 font-semibold text-emerald-600">
                    {discount > 0 ? `-${formatCurrency(discount)}` : '₹0.00'}
                  </td>
                );
              })}
            </tr>

            {/* 3. Taxes & Duties */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                Taxes & GST
              </td>
              {quotations.map((quote) => {
                const tax = quote.summary?.totalTax || 0;
                return (
                  <td key={quote._id || quote.id} className="p-4 font-semibold text-slate-700">
                    {formatCurrency(tax)}
                  </td>
                );
              })}
            </tr>

            {/* 4. Delivery & Logistics */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Freight & Delivery Charges</span>
                </div>
              </td>
              {quotations.map((quote) => {
                const delivery = quote.commercialTerms?.deliveryCharges || 0;
                const isBestDelivery = delivery === minDelivery;
                return (
                  <td key={quote._id || quote.id} className="p-4 font-semibold text-slate-800">
                    <span className={isBestDelivery && delivery > 0 ? 'text-emerald-700 font-bold' : ''}>
                      {formatCurrency(delivery)}
                    </span>
                    {isBestDelivery && delivery > 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                        (Lowest)
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 5. Additional Fees */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                Additional / Handling Fees
              </td>
              {quotations.map((quote) => {
                const add = quote.commercialTerms?.additionalCharges || quote.commercialTerms?.additionalFees || 0;
                return (
                  <td key={quote._id || quote.id} className="p-4 font-semibold text-slate-700">
                    {formatCurrency(add)}
                  </td>
                );
              })}
            </tr>

            {/* 6. Grand Total */}
            <tr className="bg-slate-100/70 border-t-2 border-slate-200">
              <td className="p-4 font-extrabold text-slate-900 text-sm">
                Final Grand Total
              </td>
              {quotations.map((quote) => {
                const qId = quote._id || quote.id;
                const grandTotal = quote.summary?.grandTotal || quote.totalAmount || 0;
                const isLowest = lowestTotalId && qId.toString() === lowestTotalId.toString();

                return (
                  <td key={qId} className={`p-4 text-base font-black ${
                    isLowest ? 'text-blue-700 bg-blue-100/40' : 'text-slate-900'
                  }`}>
                    <div>{formatCurrency(grandTotal)}</div>
                    {isLowest && (
                      <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1 mt-0.5">
                        <Award className="w-3.5 h-3.5" /> Lowest Overall Price
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 7. Lead Time */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expected Lead Time</span>
                </div>
              </td>
              {quotations.map((quote) => {
                const qId = quote._id || quote.id;
                const lead = quote.commercialTerms?.leadTimeDays || 7;
                const isFastest = fastestDeliveryId && qId.toString() === fastestDeliveryId.toString();

                return (
                  <td key={qId} className="p-4">
                    <span className={`font-bold ${isFastest ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200' : 'text-slate-800'}`}>
                      {lead} Business Days
                    </span>
                    {isFastest && <span className="text-[10px] text-amber-600 block mt-0.5 font-bold">⚡ Fastest Fulfillment</span>}
                  </td>
                );
              })}
            </tr>

            {/* 8. Warranty */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Warranty Period</span>
                </div>
              </td>
              {quotations.map((quote) => {
                const qId = quote._id || quote.id;
                const war = quote.commercialTerms?.warrantyMonths || 12;
                const isLongest = longestWarrantyId && qId.toString() === longestWarrantyId.toString();

                return (
                  <td key={qId} className="p-4">
                    <span className={`font-bold ${isLongest ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200' : 'text-slate-800'}`}>
                      {war} Months
                    </span>
                    {isLongest && <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">🛡️ Longest Protection</span>}
                  </td>
                );
              })}
            </tr>

            {/* 9. Payment Terms */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Payment Terms</span>
                </div>
              </td>
              {quotations.map((quote) => {
                const pt = quote.commercialTerms?.paymentTerms || quote.supplierId?.paymentTerms || 'Net 30';
                return (
                  <td key={quote._id || quote.id} className="p-4 font-bold text-slate-800">
                    {pt}
                  </td>
                );
              })}
            </tr>

            {/* 10. Minimum Order Quantity */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                Minimum Order Quantity (MOQ)
              </td>
              {quotations.map((quote) => {
                const moq = quote.commercialTerms?.minOrderQuantity || 1;
                return (
                  <td key={quote._id || quote.id} className="p-4 text-slate-700 font-medium">
                    {moq} units
                  </td>
                );
              })}
            </tr>

            {/* 11. Notes & Special Conditions */}
            <tr className="hover:bg-slate-50/60 transition">
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                Special Conditions & Notes
              </td>
              {quotations.map((quote) => {
                const notes = quote.commercialTerms?.notes || quote.notes || 'None specified';
                return (
                  <td key={quote._id || quote.id} className="p-4 text-slate-600 italic text-[11px] leading-relaxed">
                    {notes}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
