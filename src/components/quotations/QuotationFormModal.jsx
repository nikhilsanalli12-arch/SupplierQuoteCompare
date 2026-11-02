import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Calculator, 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';
import LineItemRow from './LineItemRow';
import { calculateQuotationTotals } from '../../utils/costCalculator';
import { formatCurrency } from '../../utils/formatters';

export default function QuotationFormModal({
  isOpen,
  onClose,
  onSubmit,
  suppliers = [],
  initialData = null,
  isEdit = false
}) {
  const [supplierId, setSupplierId] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Draft');

  // Commercial terms
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [warrantyMonths, setWarrantyMonths] = useState(12);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Line items state
  const [items, setItems] = useState([
    {
      name: '',
      description: '',
      category: 'General',
      quantity: 1,
      packageSize: 1,
      measurementUnit: 'pcs',
      unitPrice: 0,
      discountPercent: 0,
      taxPercent: 18
    }
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isEdit) {
      setSupplierId(initialData.supplierId?._id || initialData.supplierId || '');
      setQuotationNumber(initialData.quotationNumber || '');
      setQuotationDate(
        initialData.quotationDate ? new Date(initialData.quotationDate).toISOString().split('T')[0] : ''
      );
      setValidUntil(
        initialData.validUntil ? new Date(initialData.validUntil).toISOString().split('T')[0] : ''
      );
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'Draft');

      const terms = initialData.commercialTerms || {};
      setDeliveryCharges(terms.deliveryCharges || 0);
      setAdditionalCharges(terms.additionalCharges || 0);
      setLeadTimeDays(terms.leadTimeDays || 7);
      setWarrantyMonths(terms.warrantyMonths || 12);
      setPaymentTerms(terms.paymentTerms || 'Net 30');
      setMinOrderQuantity(terms.minOrderQuantity || 1);
      setNotes(terms.notes || '');

      if (initialData.items && initialData.items.length > 0) {
        setItems(initialData.items);
      }
    } else {
      // Default new state
      setSupplierId(suppliers[0]?._id || suppliers[0]?.id || '');
      setQuotationNumber(`QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setQuotationDate(new Date().toISOString().split('T')[0]);
      setValidUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setDescription('');
      setStatus('Draft');
      setDeliveryCharges(0);
      setAdditionalCharges(0);
      setLeadTimeDays(7);
      setWarrantyMonths(12);
      setPaymentTerms('Net 30');
      setMinOrderQuantity(1);
      setNotes('');
      setItems([
        {
          name: '',
          description: '',
          category: 'General',
          quantity: 1,
          packageSize: 1,
          measurementUnit: 'pcs',
          unitPrice: 0,
          discountPercent: 0,
          taxPercent: 18
        }
      ]);
    }
    setErrors({});
  }, [initialData, isEdit, isOpen, suppliers]);

  if (!isOpen) return null;

  // Live calculation of all line items + charges
  const calculatedTotals = calculateQuotationTotals(items, deliveryCharges, additionalCharges);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: '',
        description: '',
        category: 'General',
        quantity: 1,
        packageSize: 1,
        measurementUnit: 'pcs',
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 18
      }
    ]);
  };

  const handleUpdateItem = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    const errs = {};
    if (!supplierId) errs.supplierId = 'Please select a registered supplier.';
    if (!quotationNumber.trim()) errs.quotationNumber = 'Quotation reference number is required.';
    if (!validUntil) errs.validUntil = 'Validity date is required.';

    // Validate line items
    const invalidItems = items.some((item) => !item.name || !item.name.trim());
    if (invalidItems) {
      errs.items = 'All product/service line items must have a name.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (submitStatus) => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        quotationNumber: quotationNumber.trim().toUpperCase(),
        supplierId,
        quotationDate,
        validUntil,
        description,
        status: submitStatus || status,
        items,
        commercialTerms: {
          deliveryCharges: Number(deliveryCharges),
          additionalCharges: Number(additionalCharges),
          leadTimeDays: Number(leadTimeDays),
          warrantyMonths: Number(warrantyMonths),
          paymentTerms,
          minOrderQuantity: Number(minOrderQuantity),
          notes
        }
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors({ server: err.message || 'Failed to save quotation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isEdit ? 'Edit Supplier Quotation' : 'Create Quotation with Dynamic Line Items'}
              </h3>
              <p className="text-xs text-blue-100">
                Multi-product pricing breakdown, taxes, freight & commercial terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs text-slate-700 flex-1">
          {errors.server && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

          {/* Section 1: General Quotation Information */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              1. Quotation & Supplier Identification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Supplier Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Supplier *</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className={`w-full p-2.5 bg-white border rounded-xl text-slate-800 font-medium ${
                    errors.supplierId ? 'border-rose-400' : 'border-slate-200'
                  }`}
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name} ({s.city || s.location})
                    </option>
                  ))}
                </select>
                {errors.supplierId && <p className="text-[11px] text-rose-600 mt-1">{errors.supplierId}</p>}
              </div>

              {/* Quotation / Ref Number */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quotation / Ref Number *</label>
                <input
                  type="text"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  placeholder="e.g. QT-2026-001"
                  className={`w-full p-2.5 bg-white border rounded-xl font-mono uppercase font-bold text-slate-800 ${
                    errors.quotationNumber ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.quotationNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.quotationNumber}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quotation Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold"
                >
                  <option value="Draft">Draft (Work in progress)</option>
                  <option value="Submitted">Submitted (Formal bid)</option>
                  <option value="Accepted">Accepted (Approved PO)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quotation Date</label>
                <input
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Validity / Expiry Date *</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className={`w-full p-2.5 bg-white border rounded-xl text-slate-800 ${
                    errors.validUntil ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.validUntil && <p className="text-[11px] text-rose-600 mt-1">{errors.validUntil}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project / Order Reference</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Q4 Machinery Maintenance Parts"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  2. Product & Service Line Items ({items.length})
                </span>
                <p className="text-[11px] text-slate-500">
                  Add multiple items, package sizes, unit pricing, discounts, and taxes
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {errors.items && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {errors.items}
              </p>
            )}

            <div className="space-y-3">
              {items.map((item, index) => (
                <LineItemRow
                  key={index}
                  item={item}
                  index={index}
                  onChange={handleUpdateItem}
                  onRemove={handleRemoveItem}
                  canRemove={items.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Commercial Terms & Delivery */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              3. Commercial Logistics & Supply Terms
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery / Freight (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryCharges}
                  onChange={(e) => setDeliveryCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Additional Fees (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lead Time (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-center"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Warranty (Months)
                </label>
                <input
                  type="number"
                  min="0"
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Credit Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 45">Net 45 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                  <option value="100% Advance">100% Advance</option>
                  <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commercial Notes / Terms</label>
                <input
                  type="text"
                  placeholder="e.g. Free replacement warranty, includes transit insurance."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Calculated Totals Summary Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Live Deterministic Calculation Summary
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/20 font-mono">
                Currency: INR (₹)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Gross Subtotal</span>
                <span className="font-bold text-white text-sm">{formatCurrency(calculatedTotals.grossSubtotal)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Discounts</span>
                <span className="font-bold text-emerald-400 text-sm">-{formatCurrency(calculatedTotals.totalDiscount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">GST / Total Tax</span>
                <span className="font-bold text-blue-300 text-sm">+{formatCurrency(calculatedTotals.totalTax)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Delivery & Extras</span>
                <span className="font-bold text-white text-sm">
                  +{formatCurrency(Number(deliveryCharges) + Number(additionalCharges))}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">Final Quotation Total:</span>
              <span className="text-2xl font-black text-white tracking-tight">
                {formatCurrency(calculatedTotals.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Draft')}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Submitted')}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Quotation' : 'Submit Quotation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
