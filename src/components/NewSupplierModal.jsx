import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, DollarSign, Check } from 'lucide-react';

export default function NewSupplierModal({ isOpen, onClose, onAddSupplier }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Machinery & Heavy Equipment',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    paymentTerms: 'Net 30',
    rating: 4.5,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in Supplier Name and Email.');
      return;
    }

    const newSupplier = {
      id: `SUP-${Math.floor(Math.random() * 900) + 100}`,
      name: formData.name,
      category: formData.category,
      contactPerson: formData.contactPerson || 'Procurement Rep',
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      location: formData.location || 'United States',
      rating: Number(formData.rating),
      activeQuotes: 0,
      paymentTerms: formData.paymentTerms,
      status: 'Active',
      verified: true,
    };

    onAddSupplier(newSupplier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Register New Supplier</h3>
              <p className="text-xs text-slate-300">Add vendor profile to quote request pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company / Supplier Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Delta Precision Robotics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Machinery & Heavy Equipment">Machinery & Equipment</option>
                <option value="Electronics & Components">Electronics & Components</option>
                <option value="Raw Materials & Metals">Raw Materials & Metals</option>
                <option value="Packaging & Logistics">Packaging & Logistics</option>
                <option value="Custom Fabrication">Custom Fabrication</option>
                <option value="Chemicals & Industrial Supplies">Chemicals & Supplies</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location / HQ</label>
              <input
                type="text"
                placeholder="e.g. Austin, TX"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
              </select>
            </div>
          </div>

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
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
