import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Sparkles, 
  AlertCircle, 
  Printer, 
  Download, 
  RefreshCw,
  Layers,
  Scale,
  Building2,
  FileText
} from 'lucide-react';
import { quotationService, comparisonService } from '../services/api';
import QuotationSelectorBar from '../components/comparison/QuotationSelectorBar';
import SupplierOverviewCards from '../components/comparison/SupplierOverviewCards';
import ItemComparisonMatrix from '../components/comparison/ItemComparisonMatrix';
import CommercialTermsMatrix from '../components/comparison/CommercialTermsMatrix';
import BestValueInsightsCard from '../components/comparison/BestValueInsightsCard';

export default function CompareView({ 
  quotations: initialQuotes = [], 
  preselectedQuoteIds = [] 
}) {
  const [allQuotations, setAllQuotations] = useState(initialQuotes);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load latest quotations from API on mount
  useEffect(() => {
    const loadAllQuotes = async () => {
      try {
        const fetched = await quotationService.getAll();
        if (fetched && fetched.length > 0) {
          setAllQuotations(fetched);
          
          // Initialize selection if not set
          if (selectedIds.length === 0) {
            if (preselectedQuoteIds && preselectedQuoteIds.length >= 2) {
              setSelectedIds(preselectedQuoteIds.slice(0, 4));
            } else {
              // Default to the first 2-3 quotes
              const defaultIds = fetched.slice(0, 3).map((q) => q._id || q.id);
              setSelectedIds(defaultIds);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch quotations for comparison:', err.message);
      }
    };

    loadAllQuotes();
  }, []);

  // Update selection if preselectedQuoteIds prop changes
  useEffect(() => {
    if (preselectedQuoteIds && preselectedQuoteIds.length >= 2) {
      setSelectedIds(preselectedQuoteIds.slice(0, 4));
    }
  }, [preselectedQuoteIds]);

  // Run comparison whenever selectedIds change
  useEffect(() => {
    const runComparison = async () => {
      if (!selectedIds || selectedIds.length < 2) {
        setComparisonData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await comparisonService.compare(selectedIds);
        setComparisonData(data);
      } catch (err) {
        console.error('Error running comparison:', err.message);
        setError(err.message || 'Failed to compare quotations');
      } finally {
        setLoading(false);
      }
    };

    runComparison();
  }, [selectedIds]);

  // Toggle quote in selection (add or remove)
  const handleToggleQuote = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert('You can compare a maximum of 4 quotations simultaneously.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleResetSelection = () => {
    const defaultIds = allQuotations.slice(0, 2).map((q) => q._id || q.id);
    setSelectedIds(defaultIds);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!comparisonData || !comparisonData.quotations) return;

    const quotes = comparisonData.quotations;
    const headers = ['Parameter', ...quotes.map(q => `${q.supplierName} (${q.quotationNumber})`)];
    const rows = [
      headers.join(','),
      ['Grand Total', ...quotes.map(q => q.summary?.grandTotal || 0)].join(','),
      ['Lead Time (Days)', ...quotes.map(q => q.commercialTerms?.leadTimeDays || 0)].join(','),
      ['Warranty (Months)', ...quotes.map(q => q.commercialTerms?.warrantyMonths || 0)].join(','),
      ['Payment Terms', ...quotes.map(q => `"${q.commercialTerms?.paymentTerms || ''}"`)].join(',')
    ];

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotation_comparison_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Quotation Comparison & Analysis
            </h1>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Phase 4 Matrix
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare vendor proposals, mathematically normalise unit prices across packaging units, and evaluate commercial trade-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparisonData && comparisonData.quotations?.length >= 2 && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                title="Export comparison to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                title="Print Comparison Report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Print Report</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quotation Selection Bar */}
      <QuotationSelectorBar
        availableQuotations={allQuotations}
        selectedIds={selectedIds}
        onToggleQuote={handleToggleQuote}
        onResetSelection={handleResetSelection}
      />

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3 shadow-xs">
          <RefreshCw className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
          <p className="font-bold text-slate-700 text-sm">Aligning quotation line items and normalising base units...</p>
          <p className="text-xs text-slate-400">Performing mathematical unit conversions and commercial parameter analysis</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-600" />
          <h4 className="font-bold text-sm">Comparison Error</h4>
          <p className="text-xs">{error}</p>
          <button
            onClick={handleResetSelection}
            className="mt-2 text-xs font-bold px-3 py-1.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition"
          >
            Reset Selection
          </button>
        </div>
      )}

      {/* Insufficient selection state (< 2 quotes) */}
      {!loading && !error && selectedIds.length < 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Select At Least 2 Quotations to Compare
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose two or more supplier quotations from the selector above to generate side-by-side product normalisations, commercial terms, and multi-parametric value trade-offs.
          </p>
        </div>
      )}

      {/* Main Comparison Modules (when 2 or more quotes are active) */}
      {!loading && !error && comparisonData && comparisonData.quotations?.length >= 2 && (
        <div className="space-y-6">
          {/* 1. Best-Value Intelligence & Trade-Offs Banner */}
          <BestValueInsightsCard
            insights={comparisonData.insights}
            quotations={comparisonData.quotations}
          />

          {/* 2. Side-by-Side Supplier Overview Cards */}
          <SupplierOverviewCards
            quotations={comparisonData.quotations}
            insights={comparisonData.insights}
          />

          {/* 3. Product Line Items & Unit Price Normalisation Table */}
          <ItemComparisonMatrix
            alignedItems={comparisonData.alignedItems || []}
            quotations={comparisonData.quotations}
          />

          {/* 4. Commercial Terms & Pricing Breakdown Table */}
          <CommercialTermsMatrix
            quotations={comparisonData.quotations}
            insights={comparisonData.insights}
          />
        </div>
      )}
    </div>
  );
}
