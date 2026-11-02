import React from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Award,
  CheckCircle2,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function BestValueInsightsCard({
  insights = {},
  quotations = []
}) {
  const {
    lowestCostQuote,
    costVariance = 0,
    fastestDeliveryQuote,
    longestWarrantyQuote,
    tradeOffs = []
  } = insights;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/80 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Best-Value Intelligence & Trade-Off Analysis
            </h3>
            <span className="text-[10px] font-bold bg-blue-500/30 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Objective Decisioning
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Multi-parametric evaluation comparing direct commercial cost against operational lead times, warranties, and terms
          </p>
        </div>

        {/* Big Variance Savings KPI */}
        {costVariance > 0 && (
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-emerald-300 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                Variance Savings Opportunity
              </p>
              <p className="text-sm font-black text-white">
                Save up to {formatCurrency(costVariance)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Key Parameter Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Lowest Grand Total */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
            <Award className="w-4 h-4" />
            <span>Lowest Commercial Total</span>
          </div>
          <p className="text-lg font-black text-white">
            {formatCurrency(lowestCostQuote?.grandTotal || 0)}
          </p>
          <p className="text-xs text-slate-300 truncate">
            {lowestCostQuote?.supplierName} ({lowestCostQuote?.quotationNumber})
          </p>
        </div>

        {/* Fastest Delivery */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Clock className="w-4 h-4" />
            <span>Fastest Lead Time</span>
          </div>
          <p className="text-lg font-black text-white">
            {fastestDeliveryQuote?.leadTimeDays || 7} Days
          </p>
          <p className="text-xs text-slate-300 truncate">
            {fastestDeliveryQuote?.supplierName} ({fastestDeliveryQuote?.quotationNumber})
          </p>
        </div>

        {/* Longest Warranty */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Longest Warranty Guarantee</span>
          </div>
          <p className="text-lg font-black text-white">
            {longestWarrantyQuote?.warrantyMonths || 12} Months
          </p>
          <p className="text-xs text-slate-300 truncate">
            {longestWarrantyQuote?.supplierName} ({longestWarrantyQuote?.quotationNumber})
          </p>
        </div>
      </div>

      {/* Trade-Off Details Feed */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Procurement Trade-Off Assessment
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tradeOffs.map((tradeOff, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 space-y-1 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tradeOff.type === 'cost'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : tradeOff.type === 'delivery'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : tradeOff.type === 'warranty'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                }`}>
                  {tradeOff.badge || tradeOff.type}
                </span>
                <span className="font-bold text-slate-200">{tradeOff.title}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mt-1">
                {tradeOff.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Guidance Reminder */}
      <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 text-xs text-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">
            Procurement Best Practice Notice:
          </p>
          <p className="text-slate-300 leading-relaxed">
            The quotation with the lowest monetary sum is not automatically the optimal procurement decision. Evaluate factors such as supplier performance rating, packaging efficiency (normalised base unit costs), warranty risk coverage, and fulfillment speed when awarding the contract.
          </p>
        </div>
      </div>
    </div>
  );
}
