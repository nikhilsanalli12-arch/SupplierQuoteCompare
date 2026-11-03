import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  Clock, 
  ArrowLeftRight, 
  TrendingUp, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Award
} from 'lucide-react';
import WelcomeBanner from '../components/WelcomeBanner';
import MetricCard from '../components/MetricCard';
import QuotationsTable from '../components/QuotationsTable';

import { formatCurrency } from '../utils/formatters';

export default function DashboardView({
  suppliers = [],
  quotations = [],
  comparisons = [],
  onNavigate,
  onNewQuotation,
  onNewSupplier,
  onViewQuotation,
  onCompareQuotes,
  searchQuery,
  setSearchQuery,
}) {
  const safeQuotations = Array.isArray(quotations) ? quotations : [];
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const safeComparisons = Array.isArray(comparisons) ? comparisons : [];

  const pendingQuotations = safeQuotations.filter((q) => q && (q.status === 'Pending' || q.status === 'Submitted'));

  // Compute total evaluated spend and savings
  const totalEvaluatedSpend = safeQuotations.reduce((acc, q) => acc + (q?.summary?.grandTotal || q?.grandTotal || q?.totalAmount || 0), 0);
  const activeSuppliersCount = safeSuppliers.filter((s) => s && s.status !== 'Inactive').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeBanner
        onNewQuotationClick={onNewQuotation}
        onCompareClick={() => onNavigate('compare')}
        pendingCount={pendingQuotations.length}
        totalQuotesCount={safeQuotations.length}
        suppliersCount={safeSuppliers.length}
      />

      {/* Metrics Row (4 Overview Cards required by prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Suppliers */}
        <MetricCard
          title="Total Suppliers"
          value={safeSuppliers.length}
          change="+18%"
          isPositive={true}
          subtitle={`${activeSuppliersCount} Active & Verified`}
          icon={Building2}
          color="blue"
          onClick={() => onNavigate('suppliers')}
        />

        {/* Total Quotations */}
        <MetricCard
          title="Total Quotations"
          value={safeQuotations.length}
          change="+24%"
          isPositive={true}
          subtitle="Saved in database"
          icon={FileSpreadsheet}
          color="indigo"
          onClick={() => onNavigate('quotations')}
        />

        {/* Pending Quotations */}
        <MetricCard
          title="Actionable Quotations"
          value={pendingQuotations.length}
          change="Awaiting PO"
          isPositive={false}
          subtitle="Requires commercial review"
          icon={Clock}
          color="amber"
          onClick={() => onNavigate('quotations')}
        />

        {/* Evaluated Spend & Savings */}
        <MetricCard
          title="Evaluated Pipeline"
          value={formatCurrency(totalEvaluatedSpend)}
          change="Multi-Bid"
          isPositive={true}
          subtitle="Across active quotations"
          icon={ArrowLeftRight}
          color="emerald"
          onClick={() => onNavigate('reports')}
        />
      </div>

      {/* Highlights & Recent Comparisons Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Comparison Spotlights */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Active Comparison Matrices
                  </h3>
                  <p className="text-xs text-slate-600">
                    Side-by-side cost variance analysis across multiple quotations
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('compare')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>All Matrices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {safeComparisons.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onNavigate('compare')}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                        {comp.id}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600">
                        {comp.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition">
                      {comp.title}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Comparing: {comp.suppliersCompared.join(', ')}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saves {comp.estimatedSavings}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Best: <strong className="text-slate-800 font-semibold">{comp.bestPriceSupplier}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Auto-ranks by Unit Price, Lead Time & Reliability
            </span>
            <button
              onClick={() => onNavigate('compare')}
              className="font-bold text-blue-600 hover:underline"
            >
              Start New Comparison &rarr;
            </button>
          </div>
        </div>

        {/* Right: Quick Procurement Efficiency Widget */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold tracking-wider uppercase text-blue-300">
                Supplier Benchmark
              </span>
              <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/20">
                Q4 Insights
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Fastest Turnaround</span>
                  <span className="font-bold text-emerald-400">7 Business Days</span>
                </div>
                <p className="text-[11px] text-slate-400">Precision Dynamics & Global Tech lead current fulfillment.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Payment Term Flexibility</span>
                  <span className="font-bold text-blue-400">Up to Net 60</span>
                </div>
                <p className="text-[11px] text-slate-400">Vanguard & Precision Dynamics offer extended credit terms.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Variance Savings Opportunity</span>
                </div>
                <p className="text-2xl font-black text-white">{formatCurrency(4310)}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Identified through multi-quote price normalisation</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="w-full mt-4 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-900/40"
          >
            Open Trade-Off & Evaluation Reports
          </button>
        </div>
      </div>

      {/* Recent Quotations Table Component */}
      <QuotationsTable
        quotations={safeQuotations}
        onViewQuotation={onViewQuotation}
        onCompareQuotes={onCompareQuotes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        limit={6}
      />
    </div>
  );
}
