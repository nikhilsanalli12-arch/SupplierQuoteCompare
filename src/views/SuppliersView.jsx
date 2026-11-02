import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Eye, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import SupplierTable from '../components/suppliers/SupplierTable';
import SupplierFormModal from '../components/suppliers/SupplierFormModal';
import SupplierDetailsModal from '../components/suppliers/SupplierDetailsModal';
import DeleteConfirmModal from '../components/suppliers/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { supplierService } from '../services/api';

export default function SuppliersView({ onSelectSupplierQuotes }) {
  // State
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Sorting
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Suppliers from API / Database
  const fetchSuppliers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await supplierService.getAll({
        search: searchQuery,
        category: selectedCategory,
        location: selectedLocation,
        status: selectedStatus
      });
      setSuppliers(data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [searchQuery, selectedCategory, selectedLocation, selectedStatus]);

  // Extract distinct categories & locations for filters
  const categories = ['All', 'Machinery & Heavy Equipment', 'Electronics & Hardware', 'Raw Materials & Metals', 'Packaging & Logistics', 'Custom Fabrication & CNC', 'Chemicals & Coatings'];
  const locations = ['All', ...new Set(suppliers.map((s) => s.city).filter(Boolean))];

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'rating' || sortField === 'activeQuotes') {
      aVal = Number(aVal || 0);
      bVal = Number(bVal || 0);
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handlers for CRUD
  const handleCreateSupplier = async (formData) => {
    const created = await supplierService.create(formData);
    showToast(`Supplier "${created.name}" created and saved to database!`);
    await fetchSuppliers();
  };

  const handleUpdateSupplier = async (formData) => {
    const id = editingSupplier._id || editingSupplier.id;
    const updated = await supplierService.update(id, formData);
    showToast(`Supplier "${updated.name}" updated successfully!`);
    setEditingSupplier(null);
    await fetchSuppliers();
  };

  const handleDeleteSupplier = async (supplier, force = false) => {
    setIsDeleting(true);
    try {
      const id = supplier._id || supplier.id;
      await supplierService.delete(id, force);
      showToast(`Supplier "${supplier.name}" removed from database.`);
      setDeletingSupplier(null);
      await fetchSuppliers();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supplier Directory</h2>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
              {suppliers.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage your verified vendors, commercial ratings, contacts, and payment credit terms
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchSuppliers}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition border border-slate-200"
            title="Refresh Suppliers"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={() => {
              setEditingSupplier(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, contact, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location / City Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="All">All Locations</option>
              {locations.filter((l) => l !== 'All').map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(selectedCategory !== 'All' || selectedLocation !== 'All' || selectedStatus !== 'All' || searchQuery) && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-600 font-semibold">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Category: {selectedCategory}
              </span>
            )}
            {selectedLocation !== 'All' && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                City: {selectedLocation}
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Status: {selectedStatus}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                Search: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLocation('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-bold text-xs ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={fetchSuppliers}
            className="font-bold underline text-rose-700 hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="font-semibold text-slate-700">Connecting to database & loading suppliers...</p>
        </div>
      ) : sortedSuppliers.length === 0 ? (
        /* Empty State */
        <EmptyState
          title="No suppliers match your criteria"
          description="Try clearing your search keyword, category, or location filters, or register a new supplier."
          actionLabel="Add New Supplier"
          onAction={() => {
            setEditingSupplier(null);
            setIsFormOpen(true);
          }}
          icon={Building2}
        />
      ) : viewMode === 'table' ? (
        /* Table View */
        <SupplierTable
          suppliers={sortedSuppliers}
          onViewDetails={(sup) => setViewingSupplier(sup)}
          onEditSupplier={(sup) => {
            setEditingSupplier(sup);
            setIsFormOpen(true);
          }}
          onDeleteSupplier={(sup) => setDeletingSupplier(sup)}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedSuppliers.map((supplier) => (
            <div
              key={supplier._id || supplier.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-extrabold flex items-center justify-center text-sm border border-blue-200/60 shadow-2xs">
                      {supplier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 
                        onClick={() => setViewingSupplier(supplier)}
                        className="font-bold text-slate-900 text-sm group-hover:text-blue-600 cursor-pointer transition"
                      >
                        {supplier.name}
                      </h3>
                      <p className="text-[11px] text-slate-600">{supplier.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{supplier.rating || 4.5}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs mb-4">
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {supplier.city}, {supplier.country || 'USA'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {supplier.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Contact:</span>
                    <span className="font-semibold text-slate-800">{supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Email:</span>
                    <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                      {supplier.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Payment Terms:</span>
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {supplier.paymentTerms || 'Net 30'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-3">
                <span className="text-xs text-slate-600">
                  Quotes: <strong className="text-slate-800 font-bold">{supplier.activeQuotes || 0}</strong>
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingSupplier(supplier)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title="Edit Supplier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingSupplier(supplier)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Supplier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <SupplierFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSupplier(null);
        }}
        onSubmit={editingSupplier ? handleUpdateSupplier : handleCreateSupplier}
        initialData={editingSupplier}
        isEdit={!!editingSupplier}
      />

      <SupplierDetailsModal
        isOpen={!!viewingSupplier}
        supplier={viewingSupplier}
        onClose={() => setViewingSupplier(null)}
        onEdit={(sup) => {
          setViewingSupplier(null);
          setEditingSupplier(sup);
          setIsFormOpen(true);
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deletingSupplier}
        supplier={deletingSupplier}
        onClose={() => setDeletingSupplier(null)}
        onConfirm={handleDeleteSupplier}
        isDeleting={isDeleting}
      />

      {/* Floating Action Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
