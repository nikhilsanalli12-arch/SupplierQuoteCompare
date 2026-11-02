import React, { useState } from 'react';
import { X, Calculator, Plus, Check, DollarSign, Calendar, Clock, Truck } from 'lucide-react';

export default function NewQuotationModal({ isOpen, onClose, suppliers, onAddQuotation }) {
  const [formData, setFormData] = useState({
    supplierId: suppliers[0]?.id || '',
    product: '',
    category: 'Machinery',
    quantity: 100,
    unitPrice: 45.00,
    shippingCost: 300.00,
    taxRate: 5, // 5%
    leadTimeDays: 14,
    paymentTerms: 'Net 30',
    warrantyMonths: 12,
    validUntil: '2026-12-15',
    notes: 'Standard procurement quotation.',
  });

  if (!isOpen) return null;

  const subtotal = Number(formData.quantity) * Number(formData.unitPrice);
  const taxAmount = (subtotal * Number(formData.taxRate)) / 100;
  const grandTotal = subtotal + Number(formData.shippingCost) + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product.trim()) {
      alert('Please enter a product or item name.');
      return;
    }

    const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId) || {
      name: 'Custom Supplier',
      id: 'SUP-NEW'
    };

    const newQuote = {
      id: `QT-2024-00${Math.floor(Math.random() * 900) + 100}`,
      supplierId: formData.supplierId,
      supplierName: selectedSupplier.name,
      product: formData.product,
      category: formData.category,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      shippingCost: Number(formData.shippingCost),
      tax: Number(taxAmount.toFixed(2)),
      totalAmount: Number(grandTotal.toFixed(2)),
      currency: 'USD',
      leadTimeDays: Number(formData.leadTimeDays),
      validUntil: formData.validUntil,
      paymentTerms: formData.paymentTerms,
      warrantyMonths: Number(formData.warrantyMonths),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      notes: formData.notes,
    };

    onAddQuotation(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Create New Supplier Quotation</h3>
              <p className="text-xs text-blue-100">Add commercial quote terms for side-by-side comparison</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supplier Select */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Supplier *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Product Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Machinery">Machinery & Heavy Equipment</option>
                <option value="Electronics">Electronics & Hardware</option>
                <option value="Raw Materials">Raw Materials & Metals</option>
                <option value="Packaging">Packaging & Shipping</option>
                <option value="Fabrication">Custom Fabrication & CNC</option>
                <option value="Chemicals">Chemicals & Industrial Supplies</option>
              </select>
            </div>
          </div>

          {/* Product / Item */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product / Item Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Servo Motor 750W with Integrated Drive"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Numerical Pricing Grid */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
              Pricing Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 0) })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Freight / Shipping ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Dynamic Live Calculated Total Bar */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-semibold">
              <span className="text-slate-600">Calculated Grand Total:</span>
              <span className="text-base text-blue-700 font-extrabold">
                ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Time (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
                <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Warranty (Months)</label>
              <input
                type="number"
                min="0"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes & Terms</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              placeholder="e.g. Free replacement warranty, shipping includes insurance."
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
            >
              Add Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
