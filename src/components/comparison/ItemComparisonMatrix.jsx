import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  Scale, 
  Calculator,
  Percent,
  TrendingDown
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ItemComparisonMatrix({
  alignedItems = [],
  quotations = []
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Product Line Items & Unit Price Normalisation
            </h3>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Canonical Base Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prices are mathematically converted to standard base units (₹/kg, ₹/L, ₹/pcs) to allow fair comparison across varying package sizes
          </p>
        </div>
      </div>

      {/* Aligned Products List */}
      <div className="divide-y divide-slate-200/80">
        {alignedItems.map((alignedProduct, idx) => {
          const { 
            productName, 
            category, 
            areAllCompatible, 
            incompatibleDetails, 
            lowestNormalisedUnitPrice, 
            lowestUnitEntry,
            entries = [] 
          } = alignedProduct;

          return (
            <div key={idx} className="p-5 space-y-4">
              {/* Product Header & Compatibility Notification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {productName}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                      Category: {category || 'General'} • Quoted by {entries.length} supplier{entries.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Compatibility or Lowest Unit Price Badge */}
                <div>
                  {!areAllCompatible ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Incompatible Measurement Units</span>
                    </div>
                  ) : lowestUnitEntry ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Lowest Unit Price: {formatCurrency(lowestNormalisedUnitPrice)} / {lowestUnitEntry.baseUnit}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ({lowestUnitEntry.supplierName})
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Incompatible Dimensions Alert Box */}
              {!areAllCompatible && (
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Unit Normalisation Notice:</p>
                    <p className="text-amber-800 mt-0.5">
                      {incompatibleDetails || 'Suppliers have quoted this item in different measurement dimensions (e.g. Weight vs Volume or Count). Direct unit price mathematical normalisation cannot be performed.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Side-by-Side Quotation Line Item Comparison Cards / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {quotations.map((quote) => {
                  const qId = quote._id || quote.id;
                  const matchingEntry = entries.find(
                    (e) => e.quotationId?.toString() === qId?.toString()
                  );

                  if (!matchingEntry) {
                    return (
                      <div
                        key={qId}
                        className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400 flex flex-col justify-center items-center min-h-[140px]"
                      >
                        <p className="font-medium text-slate-500">{quote.supplierName}</p>
                        <p className="text-[11px] mt-1 text-slate-400">Item not included in this quotation</p>
                      </div>
                    );
                  }

                  const { item, calculatedNormalisation } = matchingEntry;
                  const normPrice = calculatedNormalisation?.normalizedPrice;
                  const baseUnit = calculatedNormalisation?.baseUnit || item.measurementUnit;

                  const isBestUnitPrice = areAllCompatible && 
                    lowestNormalisedUnitPrice !== null && 
                    normPrice === lowestNormalisedUnitPrice;

                  return (
                    <div
                      key={qId}
                      className={`rounded-xl border p-4 text-xs space-y-3 transition relative flex flex-col justify-between ${
                        isBestUnitPrice
                          ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-500/20'
                          : 'bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Supplier Tag */}
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="font-bold text-slate-800 truncate" title={quote.supplierName}>
                            {quote.supplierName}
                          </span>
                          <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {quote.quotationNumber || quote.id}
                          </span>
                        </div>

                        {/* Normalised Price Showcase */}
                        <div className="mt-3 p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Normalised Base Price
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className={`text-lg font-black ${
                              isBestUnitPrice ? 'text-emerald-700' : 'text-slate-900'
                            }`}>
                              {formatCurrency(normPrice)}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                              / {baseUnit}
                            </span>
                          </div>

                          {/* Calculation formula explanation */}
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <Calculator className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>
                              {formatCurrency(item.unitPrice)} ÷ ({item.packageSize} {item.measurementUnit})
                            </span>
                          </div>
                        </div>

                        {/* Parameter details */}
                        <div className="space-y-1.5 mt-3 text-[11px]">
                          <div className="flex justify-between py-0.5 text-slate-600">
                            <span className="text-slate-400">Quoted Pack Size:</span>
                            <span className="font-semibold text-slate-800">
                              {item.packageSize} {item.measurementUnit}
                            </span>
                          </div>

                          <div className="flex justify-between py-0.5 text-slate-600">
                            <span className="text-slate-400">Quoted Unit Price:</span>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(item.unitPrice)}
                            </span>
                          </div>

                          <div className="flex justify-between py-0.5 text-slate-600">
                            <span className="text-slate-400">Order Quantity:</span>
                            <span className="font-semibold text-slate-800">
                              {item.quantity} packs
                            </span>
                          </div>

                          {(item.discountPercent > 0 || item.taxPercent > 0) && (
                            <div className="flex justify-between py-0.5 text-slate-600">
                              <span className="text-slate-400">Discount / Tax:</span>
                              <span className="font-semibold text-slate-700">
                                {item.discountPercent}% off / +{item.taxPercent}% GST
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500">Line Subtotal:</span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
