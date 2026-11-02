import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Download,
  Calendar,
  Layers
} from 'lucide-react';

export default function ReportsView({ quotations, suppliers }) {
  // Aggregate category spends
  const categorySpend = quotations.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + q.totalAmount;
    return acc;
  }, {});

  const totalSpend = Object.values(categorySpend).reduce((a, b) => a + b, 0) || 1;

  const categories = Object.keys(categorySpend).map((cat) => ({
    name: cat,
    amount: categorySpend[cat],
    percentage: Math.round((categorySpend[cat] / totalSpend) * 100)
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Procurement & Spend Analytics</h2>
          <p className="text-xs text-slate-600">
            Audit expenditure distribution, category variance and cost optimization
          </p>
        </div>

        <button
          onClick={() => alert('Analytics PDF summary report generated!')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200 self-start sm:self-center"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-semibold uppercase tracking-wider">Gross Evaluated Quotes</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            Across 6 critical industry categories
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-semibold uppercase tracking-wider">Avg Quotation Lead Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">11.4 Days</p>
          <span className="text-[11px] text-slate-600 mt-1 block">
            Fastest turnaround: 5 business days
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-semibold uppercase tracking-wider">Identified Savings</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">$10,420.00</p>
          <span className="text-[11px] text-slate-600 mt-1 block">
            13.8% saved via multi-bid comparisons
          </span>
        </div>
      </div>

      {/* Spend Distribution and Supplier Reliability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Quotation Value by Category</h3>
            </div>
            <span className="text-xs text-slate-600">Total: {categories.length} segments</span>
          </div>

          <div className="space-y-4 pt-1">
            {categories.map((cat, idx) => {
              const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-teal-600', 'bg-amber-500', 'bg-rose-500'];
              const color = colors[idx % colors.length];

              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-slate-900">
                      ${cat.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({cat.percentage}%)
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
          </div>
        </div>

        {/* Vendor Performance Ranking */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Supplier Reliability & Performance</h3>
            </div>
            <span className="text-xs text-slate-600">Updated weekly</span>
          </div>

          <div className="space-y-3">
            {suppliers.map((sup) => (
              <div 
                key={sup.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {sup.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{sup.name}</p>
                    <p className="text-[10px] text-slate-600">{sup.location} • {sup.paymentTerms}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ★ {sup.rating}
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-1">Verified Vendor</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
