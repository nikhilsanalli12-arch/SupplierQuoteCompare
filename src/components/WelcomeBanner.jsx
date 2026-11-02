import React from 'react';
import { 
  Plus, 
  ArrowLeftRight, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  FileText,
  Calendar
} from 'lucide-react';

export default function WelcomeBanner({ 
  onNewQuotationClick, 
  onCompareClick, 
  pendingCount, 
  totalQuotesCount, 
  suppliersCount 
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-lg shadow-blue-950/10 border border-blue-700/50">
      {/* Decorative background grid and blurs */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side: Greeting & Status */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-200">
            <span className="flex items-center gap-1.5 bg-blue-700/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-blue-400/30">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              {currentDate}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Procurement Cycle Active
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, Procurement Team
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Manage quotes across <strong className="text-white font-semibold">{suppliersCount} verified suppliers</strong>. 
            Currently, you have <strong className="text-white font-semibold underline decoration-amber-400 decoration-2">{pendingCount} quotations pending review</strong> and commercial approval.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Multi-currency comparison enabled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>12.4% avg. cost variance detected</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 self-start lg:self-center shrink-0">
          <button
            onClick={onNewQuotationClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-blue-900 hover:bg-blue-50 transition shadow-md shadow-black/10 active:scale-95"
          >
            <Plus className="w-4 h-4 text-blue-700 stroke-[2.5]" />
            <span>Create Quotation</span>
          </button>
          
          <button
            onClick={onCompareClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-blue-700/80 hover:bg-blue-700 text-white border border-blue-400/40 backdrop-blur-xs transition shadow-sm active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-200" />
            <span>Compare Quotes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
