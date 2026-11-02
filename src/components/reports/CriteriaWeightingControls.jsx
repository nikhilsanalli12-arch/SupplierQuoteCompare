import React from 'react';
import { 
  Sliders, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { PRESET_WEIGHTS } from '../../utils/tradeOffEngine';

export default function CriteriaWeightingControls({
  weights,
  onChangeWeights,
  activePreset,
  onSelectPreset
}) {
  const totalWeight = (weights.price || 0) + (weights.delivery || 0) + (weights.warranty || 0) + (weights.paymentTerms || 0);

  const handleSliderChange = (criterion, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
    onChangeWeights({
      ...weights,
      [criterion]: num
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Configurable Evaluation Criteria & Weighting
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              totalWeight === 100 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Total Weight: {totalWeight}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign mathematical importance to each evaluation dimension to calculate transparent composite scores
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.values(PRESET_WEIGHTS).map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
                title={preset.description}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Weighting Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* 1. Price Weight */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              Purchase Price
            </span>
            <span className="font-mono font-black text-blue-700 text-sm">
              {weights.price}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={weights.price}
            onChange={(e) => handleSliderChange('price', e.target.value)}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <p className="text-[10px] text-slate-400">Lower total bid and unit cost efficiency</p>
        </div>

        {/* 2. Delivery Lead Time Weight */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Fulfillment Speed
            </span>
            <span className="font-mono font-black text-amber-600 text-sm">
              {weights.delivery}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={weights.delivery}
            onChange={(e) => handleSliderChange('delivery', e.target.value)}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <p className="text-[10px] text-slate-400">Shortest turnaround in business days</p>
        </div>

        {/* 3. Warranty Coverage Weight */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Warranty Coverage
            </span>
            <span className="font-mono font-black text-emerald-700 text-sm">
              {weights.warranty}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={weights.warranty}
            onChange={(e) => handleSliderChange('warranty', e.target.value)}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <p className="text-[10px] text-slate-400">Longer replacement and defect coverage</p>
        </div>

        {/* 4. Payment Terms Weight */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              Credit Terms
            </span>
            <span className="font-mono font-black text-purple-700 text-sm">
              {weights.paymentTerms}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={weights.paymentTerms}
            onChange={(e) => handleSliderChange('paymentTerms', e.target.value)}
            className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <p className="text-[10px] text-slate-400">Extended payment credit window (Net 30/45/60)</p>
        </div>
      </div>

      {/* Methodology notice */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span><strong>Transparent Formula:</strong> Score = (Price × {weights.price}%) + (Delivery × {weights.delivery}%) + (Warranty × {weights.warranty}%) + (Terms × {weights.paymentTerms}%). Missing data is penalized.</span>
        </span>
      </div>
    </div>
  );
}
