import React from 'react';
import { Trash2, Calculator, Info } from 'lucide-react';
import { calculateLineItem } from '../../utils/costCalculator';
import { normalizeUnitPrice } from '../../utils/unitConverter';
import { formatCurrency } from '../../utils/formatters';

export default function LineItemRow({
  item,
  index,
  onChange,
  onRemove,
  canRemove = true
}) {
  const calc = calculateLineItem(item);
  const norm = normalizeUnitPrice(item.unitPrice, item.packageSize || 1, item.measurementUnit || 'pcs');

  const handleFieldChange = (field, value) => {
    onChange(index, { ...item, [field]: value });
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-3 relative group">
      {/* Top Row: Item Name, Category, and Remove */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <input
            type="text"
            required
            placeholder="Product / Service description *"
            value={item.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="flex-1 p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={item.category || 'General'}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="General">General</option>
            <option value="Machinery">Machinery & Equipment</option>
            <option value="Electronics">Electronics & Hardware</option>
            <option value="Raw Materials">Raw Materials & Metals</option>
            <option value="Packaging">Packaging & Logistics</option>
            <option value="Fabrication">Custom Fabrication</option>
            <option value="Chemicals">Chemicals & Coatings</option>
            <option value="Services">Services & Maintenance</option>
          </select>

          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Remove Line Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description / Part No */}
      <div>
        <input
          type="text"
          placeholder="Specification, model, part number, or technical details (optional)"
          value={item.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="w-full p-2 text-[11px] bg-slate-50/70 border border-slate-200/80 rounded-lg text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
        {/* Quantity */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Order Qty *
          </label>
          <input
            type="number"
            min="0.001"
            step="any"
            required
            value={item.quantity}
            onChange={(e) => handleFieldChange('quantity', Math.max(0.001, parseFloat(e.target.value) || 0))}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold text-center"
          />
        </div>

        {/* Package Size */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1" title="e.g. 500 for 500g package, 2 for 2kg pack">
            Pack Size
          </label>
          <input
            type="number"
            min="0.001"
            step="any"
            value={item.packageSize || 1}
            onChange={(e) => handleFieldChange('packageSize', Math.max(0.001, parseFloat(e.target.value) || 1))}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center"
          />
        </div>

        {/* Measurement Unit */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Unit *
          </label>
          <select
            value={item.measurementUnit || 'pcs'}
            onChange={(e) => handleFieldChange('measurementUnit', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-center font-medium"
          >
            <option value="pcs">Pieces (pcs)</option>
            <option value="units">Units</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="g">Grams (g)</option>
            <option value="L">Litres (L)</option>
            <option value="ml">Millilitres (ml)</option>
            <option value="box">Boxes</option>
            <option value="carton">Cartons</option>
          </select>
        </div>

        {/* Unit Price (INR) */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Unit Price (₹) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={item.unitPrice}
            onChange={(e) => handleFieldChange('unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-center"
          />
        </div>

        {/* Discount % */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Disc (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={item.discountPercent || 0}
            onChange={(e) => handleFieldChange('discountPercent', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center"
          />
        </div>

        {/* Tax % */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            GST/Tax (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={item.taxPercent || 0}
            onChange={(e) => handleFieldChange('taxPercent', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-center"
          />
        </div>
      </div>

      {/* Bottom Subtotal & Normalisation Row */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          <span>Gross: {formatCurrency(calc.grossSubtotal)}</span>
          {calc.discountAmount > 0 && (
            <span className="text-emerald-700">Disc: -{formatCurrency(calc.discountAmount)}</span>
          )}
          {calc.taxAmount > 0 && (
            <span className="text-blue-700">Tax: +{formatCurrency(calc.taxAmount)}</span>
          )}
          {norm.success && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium border border-indigo-100" title="Normalized Unit Price across base measurement">
              Normalised: {formatCurrency(norm.normalizedPrice)} / {norm.baseUnit}
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-slate-500 font-medium mr-1.5">Line Total:</span>
          <span className="font-extrabold text-slate-900 text-sm">
            {formatCurrency(calc.lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
