import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  DollarSign,
  Download,
  Filter
} from 'lucide-react';
import QuotationsTable from '../components/QuotationsTable';

export default function QuotationsView({
  quotations,
  onNewQuotation,
  onViewQuotation,
  onCompareQuotes,
  searchQuery,
  setSearchQuery,
}) {
  const approvedQuotes = quotations.filter((q) => q.status === 'Approved');
  const pendingQuotes = quotations.filter((q) => q.status === 'Pending');
  const negotiationQuotes = quotations.filter((q) => q.status === 'Under Negotiation');
  const rejectedQuotes = quotations.filter((q) => q.status === 'Rejected');

  const totalPipelineValue = quotations.reduce((acc, q) => acc + q.totalAmount, 0);

  const handleExportCSV = () => {
    const headers = ['ID,Supplier,Product,Category,Quantity,UnitPrice,ShippingCost,Tax,TotalAmount,Status,LeadTimeDays,PaymentTerms,Date'];
    const rows = quotations.map((q) => 
      `"${q.id}","${q.supplierName}","${q.product}","${q.category}",${q.quantity},${q.unitPrice},${q.shippingCost},${q.tax},${q.totalAmount},"${q.status}",${q.leadTimeDays},"${q.paymentTerms}","${q.date}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quotations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quotations Management</h2>
          <p className="text-xs text-slate-600">
            View, review, approve and export all supplier bids and rate cards
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewQuotation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* Mini Stat Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Pipeline Total</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">
            ${totalPipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-[10px] text-slate-600">{quotations.length} total bids received</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 mt-1">
            {pendingQuotes.length}
          </p>
          <span className="text-[10px] text-slate-600">Awaiting commercial approval</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Approved Quotes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600 mt-1">
            {approvedQuotes.length}
          </p>
          <span className="text-[10px] text-slate-600">PO issuance ready</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">In Negotiation</span>
            <AlertCircle className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-black text-blue-600 mt-1">
            {negotiationQuotes.length}
          </p>
          <span className="text-[10px] text-slate-600">Terms undergoing revision</span>
        </div>
      </div>

      {/* Main Quotations Table */}
      <QuotationsTable
        quotations={quotations}
        onViewQuotation={onViewQuotation}
        onCompareQuotes={onCompareQuotes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
