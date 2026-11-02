import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  TrendingDown, 
  DollarSign,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TradeOffProsConsCard({
  evaluatedQuotes = [],
  weights = {}
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Ranked Vendor Trade-Off Analysis & Scorecards
          </h3>
          <p className="text-xs text-slate-500">
            Weighted composite scoring based on your active criteria weighting
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {evaluatedQuotes.length} Proposals Evaluated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {evaluatedQuotes.map((eq, idx) => {
          const isTopRank = idx === 0;
          const score = eq.scores.composite;
          const contributions = eq.weightedContributions;

          return (
            <div
              key={eq.id}
              className={`bg-white rounded-2xl border p-5 transition flex flex-col justify-between shadow-xs relative overflow-hidden ${
                isTopRank
                  ? 'border-blue-500 ring-2 ring-blue-500/15 shadow-sm'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Top Rank Badge */}
              {isTopRank && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold py-0.5 px-3 uppercase tracking-wider flex items-center justify-center gap-1 -mt-5 -mx-5 mb-4 shadow-2xs">
                  <Award className="w-3.5 h-3.5" />
                  <span>Top Ranked Value Proposal</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Header: Name, Quote #, Score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {eq.quotationNumber}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {eq.supplierName}
                    </h4>
                  </div>

                  {/* Big Composite Score Box */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-baseline gap-0.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl font-black text-lg">
                      <span>{score}</span>
                      <span className="text-[10px] text-slate-400 font-bold">/100</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-semibold">
                      Composite Score
                    </span>
                  </div>
                </div>

                {/* Commercial Summary Row */}
                <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Bid</span>
                    <span className="text-xs font-black text-slate-900">{formatCurrency(eq.grandTotal)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Lead Time</span>
                    <span className="text-xs font-bold text-slate-800">{eq.leadTimeDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Warranty</span>
                    <span className="text-xs font-bold text-slate-800">{eq.warrantyMonths} Mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Terms</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">{eq.paymentTerms}</span>
                  </div>
                </div>

                {/* Contribution Breakdown Bars */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Score Contribution Breakdown</span>
                    <span className="text-slate-400 font-normal">Points contributed out of 100</span>
                  </div>

                  {/* Multi-segment progress bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-300" 
                      style={{ width: `${contributions.price}%` }}
                      title={`Price: ${contributions.price} pts`}
                    />
                    <div 
                      className="bg-amber-500 h-full transition-all duration-300" 
                      style={{ width: `${contributions.delivery}%` }}
                      title={`Delivery: ${contributions.delivery} pts`}
                    />
                    <div 
                      className="bg-emerald-600 h-full transition-all duration-300" 
                      style={{ width: `${contributions.warranty}%` }}
                      title={`Warranty: ${contributions.warranty} pts`}
                    />
                    <div 
                      className="bg-purple-600 h-full transition-all duration-300" 
                      style={{ width: `${contributions.paymentTerms}%` }}
                      title={`Terms: ${contributions.paymentTerms} pts`}
                    />
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Price ({contributions.price} pts)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Speed ({contributions.delivery} pts)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      Warranty ({contributions.warranty} pts)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      Terms ({contributions.paymentTerms} pts)
                    </span>
                  </div>
                </div>

                {/* Pros & Cons Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  {/* Advantages (Pros) */}
                  {eq.pros && eq.pros.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Strongest Advantages (Pros)
                      </span>
                      <ul className="space-y-1 pl-1">
                        {eq.pros.map((pro, pIdx) => (
                          <li key={pIdx} className="text-slate-700 text-[11px] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disadvantages / Caveats (Cons) */}
                  {eq.cons && eq.cons.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" /> Disadvantages & Trade-Offs (Cons)
                      </span>
                      <ul className="space-y-1 pl-1">
                        {eq.cons.map((con, cIdx) => (
                          <li key={cIdx} className="text-slate-600 text-[11px] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
