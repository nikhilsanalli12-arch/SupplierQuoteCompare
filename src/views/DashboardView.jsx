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

export default function DashboardView({
  suppliers,
  quotations,
  comparisons,
  onNavigate,
  onNewQuotation,
  onNewSupplier,
  onViewQuotation,
  onCompareQuotes,
  searchQuery,
  setSearchQuery,
}) {
  const pendingQuotations = quotations.filter((q) => q.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeBanner
        onNewQuotationClick={onNewQuotation}
        onCompareClick={() => onNavigate('compare')}
        pendingCount={pendingQuotations.length}
        totalQuotesCount={quotations.length}
        suppliersCount={suppliers.length}
      />

      {/* Metrics Row (4 Overview Cards required by prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Suppliers */}
        <MetricCard
          title="Total Suppliers"
          value={suppliers.length}
          change="+18%"
          isPositive={true}
          subtitle="6 Active & Verified"
          icon={Building2}
          color="blue"
          onClick={() => onNavigate('suppliers')}
        />

        {/* Total Quotations */}
        <MetricCard
          title="Total Quotations"
          value={quotations.length}
          change="+24%"
          isPositive={true}
          subtitle="Submitted this quarter"
          icon={FileSpreadsheet}
          color="indigo"
          onClick={() => onNavigate('quotations')}
        />

        {/* Pending Quotations */}
        <MetricCard
          title="Pending Quotations"
          value={pendingQuotations.length}
          change="3 Actionable"
          isPositive={false}
          subtitle="Requires commercial review"
          icon={Clock}
          color="amber"
          onClick={() => onNavigate('quotations')}
        />

        {/* Recent Comparisons */}
        <MetricCard
          title="Recent Comparisons"
          value={comparisons.length}
          change="+$10.4k"
          isPositive={true}
          subtitle="Estimated total savings"
          icon={ArrowLeftRight}
          color="emerald"
          onClick={() => onNavigate('compare')}
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
              {comparisons.slice(0, 3).map((comp) => (
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
                  <span className="font-bold text-emerald-400">5-7 Days</span>
                </div>
                <p className="text-[11px] text-slate-400">Optima Packaging & Global Tech lead fulfillment times.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Payment Term Optimization</span>
                  <span className="font-bold text-blue-400">Net 45 / 60</span>
                </div>
                <p className="text-[11px] text-slate-400">65% of vendors agree to Net 30 or higher terms.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cost Savings Realized</span>
                </div>
                <p className="text-2xl font-black text-white">$10,420.00</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Identified through multi-quote price negotiation</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="w-full mt-4 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-900/40"
          >
            Open Analytics Report
          </button>
        </div>
      </div>

      {/* Recent Quotations Table Component */}
      <QuotationsTable
        quotations={quotations}
        onViewQuotation={onViewQuotation}
        onCompareQuotes={onCompareQuotes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        limit={6}
      />
    </div>
  );
}
