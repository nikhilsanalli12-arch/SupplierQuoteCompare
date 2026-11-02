import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from 'lucide-react';

export default function SuppliersView({ suppliers, onNewSupplier, onSelectSupplierQuotes }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(suppliers.map((s) => s.category))];

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    const query = search.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(query) ||
      s.contactPerson.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supplier Directory</h2>
          <p className="text-xs text-slate-600">
            Manage your verified vendors, commercial ratings and credit terms
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 w-full sm:w-60"
            />
          </div>

          <button
            onClick={onNewSupplier}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Supplier Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-extrabold flex items-center justify-center text-sm border border-blue-200/60 shadow-2xs">
                    {supplier.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                      {supplier.name}
                    </h3>
                    <p className="text-[11px] text-slate-600">{supplier.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{supplier.rating}</span>
                </div>
              </div>

              {/* Status and Location */}
              <div className="flex items-center gap-2 text-xs mb-4">
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {supplier.location}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {supplier.status}
                </span>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Representative:</span>
                  <span className="font-semibold text-slate-800">{supplier.contactPerson}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email:</span>
                  <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                    {supplier.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Phone:</span>
                  <span className="text-slate-700">{supplier.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Payment Terms:</span>
                  <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {supplier.paymentTerms}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Active Quotes: <strong className="text-slate-800 font-bold">{supplier.activeQuotes}</strong>
              </span>
              <button
                onClick={() => onSelectSupplierQuotes && onSelectSupplierQuotes(supplier.name)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
              >
                <span>Filter Quotes</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
