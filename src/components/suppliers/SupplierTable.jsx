import React from 'react';
import { 
  Building2, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  ArrowUpDown, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function SupplierTable({
  suppliers = [],
  onViewDetails,
  onEditSupplier,
  onDeleteSupplier,
  sortField,
  sortDirection,
  onSort
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Under Review
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactive
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Supplier Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Contact Person</th>
              <th className="py-3.5 px-4">Location</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition text-center"
                onClick={() => onSort('rating')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Payment Terms</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:text-blue-600 transition text-center"
                onClick={() => onSort('activeQuotes')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Quotes</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((supplier) => (
              <tr 
                key={supplier._id || supplier.id} 
                className="hover:bg-blue-50/30 transition-colors group"
              >
                {/* Supplier Name & Initials */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-extrabold flex items-center justify-center text-xs border border-blue-200/60 shadow-2xs shrink-0">
                      {supplier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p 
                        onClick={() => onViewDetails(supplier)}
                        className="font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition"
                      >
                        {supplier.name}
                      </p>
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" />
                        {supplier.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 font-medium text-slate-700">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] text-slate-800">
                    {supplier.category}
                  </span>
                </td>

                {/* Contact Person */}
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{supplier.contactPerson}</p>
                  <p className="text-[10px] text-slate-600">{supplier.phone}</p>
                </td>

                {/* Location */}
                <td className="py-3.5 px-4 text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{supplier.city}, {supplier.country || 'USA'}</span>
                  </span>
                </td>

                {/* Rating */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{supplier.rating || 4.5}</span>
                  </span>
                </td>

                {/* Payment Terms */}
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {supplier.paymentTerms || 'Net 30'}
                  </span>
                </td>

                {/* Active Quotes */}
                <td className="py-3.5 px-4 text-center">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                    {supplier.activeQuotes || 0}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center">
                  {getStatusBadge(supplier.status || 'Active')}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewDetails(supplier)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="View Complete Supplier Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditSupplier(supplier)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title="Edit Supplier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSupplier(supplier)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Supplier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
