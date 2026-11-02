import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  Receipt, 
  Percent, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CostBreakdownReport({
  quotations = []
}) {
  // Aggregate category spend
  const categoryMap = {};
  let totalGross = 0;
  let totalTaxes = 0;
  let totalFreight = 0;
  let totalDiscounts = 0;
  let totalGrand = 0;

  quotations.forEach((q) => {
    const grand = q.summary?.grandTotal || q.totalAmount || 0;
    const cat = q.category || q.supplierId?.category || 'General Procurement';
    const sub = q.summary?.productSubtotal || q.summary?.grossSubtotal || grand;
    const tax = q.summary?.totalTax || 0;
    const freight = q.commercialTerms?.deliveryCharges || 0;
    const discount = q.summary?.totalDiscount || 0;

    categoryMap[cat] = (categoryMap[cat] || 0) + grand;
    totalGross += sub;
    totalTaxes += tax;
    totalFreight += freight;
    totalDiscounts += discount;
    totalGrand += grand;
  });

  const categories = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    amount: categoryMap[cat],
    percentage: totalGrand > 0 ? Math.round((categoryMap[cat] / totalGrand) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-500', 'bg-purple-600', 'bg-rose-500'];

  return (
    <div className="space-y-6">
      {/* 4 Financial Component Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Grand Value */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Evaluated Spend</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(totalGrand)}
          </p>
          <span className="text-[11px] text-slate-400">
            Across {quotations.length} total quotations
          </span>
        </div>

        {/* Product Subtotals */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Base Product Subtotal</span>
            <Receipt className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(totalGross)}
          </p>
          <span className="text-[11px] text-slate-400">
            {totalGrand > 0 ? Math.round((totalGross / totalGrand) * 100) : 0}% of total procurement spend
          </span>
        </div>

        {/* Taxes & GST */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Taxes & GST</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 mt-1">
            {formatCurrency(totalTaxes)}
          </p>
          <span className="text-[11px] text-slate-400">
            Applicable GST & statutory duties
          </span>
        </div>

        {/* Freight & Logistics */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Logistics & Freight</span>
            <Truck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(totalFreight)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {totalDiscounts > 0 ? `Saved ${formatCurrency(totalDiscounts)} in discounts` : 'Delivery charges'}
          </span>
        </div>
      </div>

      {/* Spend Distribution by Category and Component Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Quotation Value by Category</h3>
            </div>
            <span className="text-xs text-slate-400">{categories.length} Industry Segments</span>
          </div>

          <div className="space-y-4 pt-1">
            {categories.map((cat, idx) => {
              const color = colors[idx % colors.length];
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-slate-900 font-mono">
                      {formatCurrency(cat.amount)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {categories.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No quotation spend data available.
              </div>
            )}
          </div>
        </div>

        {/* Cost Structure Proportion */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Commercial Cost Structure Analysis</h3>
            </div>
            <span className="text-xs text-slate-400">Share of Total Spend</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {/* Products Share */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Direct Product Cost</p>
                <p className="text-[10px] text-slate-500">Net items cost quoted by suppliers</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{formatCurrency(totalGross)}</span>
                <span className="text-[10px] text-slate-500 block">
                  {totalGrand > 0 ? Math.round((totalGross / totalGrand) * 100) : 0}% share
                </span>
              </div>
            </div>

            {/* Taxes Share */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">GST & Duties</p>
                <p className="text-[10px] text-slate-500">Government taxes on products and freight</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-600">{formatCurrency(totalTaxes)}</span>
                <span className="text-[10px] text-slate-500 block">
                  {totalGrand > 0 ? Math.round((totalTaxes / totalGrand) * 100) : 0}% share
                </span>
              </div>
            </div>

            {/* Logistics Share */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Freight & Handling Fees</p>
                <p className="text-[10px] text-slate-500">Logistics dispatch and transport surcharges</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{formatCurrency(totalFreight)}</span>
                <span className="text-[10px] text-slate-500 block">
                  {totalGrand > 0 ? Math.round((totalFreight / totalGrand) * 100) : 0}% share
                </span>
              </div>
            </div>

            {/* Discounts Savings */}
            {totalDiscounts > 0 && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-emerald-900">
                <div>
                  <p className="font-bold text-emerald-800">Supplier Discounts Captured</p>
                  <p className="text-[10px] text-emerald-600">Volume and negotiation savings</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700">-{formatCurrency(totalDiscounts)}</span>
                  <span className="text-[10px] text-emerald-600 block">Deducted from gross</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
