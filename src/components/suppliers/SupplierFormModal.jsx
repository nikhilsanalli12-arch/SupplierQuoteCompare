import React, { useState, useEffect } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, DollarSign, Star, AlertCircle } from 'lucide-react';

export default function SupplierFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Machinery & Heavy Equipment',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    rating: 4.5,
    paymentTerms: 'Net 30',
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Machinery & Heavy Equipment',
        contactPerson: initialData.contactPerson || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || 'United States',
        rating: initialData.rating || 4.5,
        paymentTerms: initialData.paymentTerms || 'Net 30',
        status: initialData.status || 'Active',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Machinery & Heavy Equipment',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'United States',
        rating: 4.5,
        paymentTerms: 'Net 30',
        status: 'Active',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Company/Supplier name is required.';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address (e.g., info@company.com).';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    if (!formData.address.trim()) errs.address = 'Business address is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.category.trim()) errs.category = 'Category is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors({ server: err.message || 'Operation failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isEdit ? 'Edit Supplier Profile' : 'Register New Supplier'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit ? 'Update vendor details and purchasing conditions' : 'Onboard vendor to database for quotation comparisons'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {errors.server && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.server}</span>
            </div>
          )}

          {/* Supplier Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company / Supplier Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Industrial Solutions Inc."
              className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 text-slate-800 transition ${
                errors.name ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Commercial Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Machinery & Heavy Equipment">Machinery & Heavy Equipment</option>
                <option value="Electronics & Hardware">Electronics & Hardware</option>
                <option value="Raw Materials & Metals">Raw Materials & Metals</option>
                <option value="Packaging & Logistics">Packaging & Logistics</option>
                <option value="Custom Fabrication & CNC">Custom Fabrication & CNC</option>
                <option value="Chemicals & Coatings">Chemicals & Coatings</option>
                <option value="Industrial Safety & Tools">Industrial Safety & Tools</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Contact Person & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person Name *</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. David Miller"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-800 ${
                  errors.contactPerson ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.contactPerson && <p className="text-[11px] text-rose-600 mt-1">{errors.contactPerson}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-800 ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Phone & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-800 ${
                  errors.phone ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Credit Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
                <option value="100% Advance">100% Advance</option>
                <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 4500 Industrial Parkway, Suite 200"
              className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-800 ${
                errors.address ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
          </div>

          {/* City, Country & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Chicago"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-800 ${
                  errors.city ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="United States"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rating (1 to 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Internal Notes & Remarks</label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Certified ISO 9001. Reliable supplier for bulk orders with expedited shipping."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Supplier' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
