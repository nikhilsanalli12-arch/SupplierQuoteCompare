import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Download,
  Calendar,
  Layers,
  Sliders,
  Award,
  Scale,
  Building2,
  FileText,
  Printer,
  Sparkles,
  RefreshCw,
  Filter
} from 'lucide-react';
import { quotationService, supplierService, comparisonService } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { PRESET_WEIGHTS, evaluateQuotations } from '../utils/tradeOffEngine';
import { exportComparisonPDF } from '../utils/pdfExport';
import CriteriaWeightingControls from '../components/reports/CriteriaWeightingControls';
import TradeOffProsConsCard from '../components/reports/TradeOffProsConsCard';
import CostBreakdownReport from '../components/reports/CostBreakdownReport';
import SupplierPerformanceReport from '../components/reports/SupplierPerformanceReport';
import QuotationSelectorBar from '../components/comparison/QuotationSelectorBar';
import CommercialTermsMatrix from '../components/comparison/CommercialTermsMatrix';

export default function ReportsView({ 
  quotations: initialQuotations = [], 
  suppliers: initialSuppliers = [],
  onSelectSupplier
}) {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [activeTab, setActiveTab] = useState('tradeoff'); // 'tradeoff' | 'scoring' | 'cost' | 'suppliers'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '30d' | '90d' | 'year'
  const [loading, setLoading] = useState(false);

  // Criteria Weighting States
  const [activePreset, setActivePreset] = useState('balanced');
  const [weights, setWeights] = useState(PRESET_WEIGHTS.balanced.weights);

  // Selected quotes for trade-off evaluation
  const [selectedQuoteIds, setSelectedQuoteIds] = useState([]);
  const [comparisonDetails, setComparisonDetails] = useState(null);

  // Sync data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [qList, sList] = await Promise.all([
          quotationService.getAll(),
          supplierService.getAll()
        ]);
        if (qList && qList.length > 0) {
          setQuotations(qList);
          // Default selection to first 3-4 quotes
          if (selectedQuoteIds.length === 0) {
            setSelectedQuoteIds(qList.slice(0, 3).map(q => q._id || q.id));
          }
        }
        if (sList && sList.length > 0) setSuppliers(sList);
      } catch (err) {
        console.warn('Failed to load reports data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch comparison alignment whenever selected quotes change
  useEffect(() => {
    const fetchComparison = async () => {
      if (selectedQuoteIds.length < 2) {
        setComparisonDetails(null);
        return;
      }
      try {
        const res = await comparisonService.compare(selectedQuoteIds);
        setComparisonDetails(res);
      } catch (err) {
        console.error('Failed to align comparison for report:', err.message);
      }
    };
    fetchComparison();
  }, [selectedQuoteIds]);

  // Date Filtering Filter
  const filteredQuotations = quotations.filter((q) => {
    if (dateFilter === 'all') return true;
    const qDate = new Date(q.quotationDate || q.createdAt || Date.now());
    const now = new Date();
    if (dateFilter === '30d') {
      return (now - qDate) <= 30 * 24 * 60 * 60 * 1000;
    }
    if (dateFilter === '90d') {
      return (now - qDate) <= 90 * 24 * 60 * 60 * 1000;
    }
    if (dateFilter === 'year') {
      return qDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Quotations active in comparison
  const comparedQuotations = quotations.filter((q) => 
    selectedQuoteIds.includes(q._id || q.id)
  );

  // Run transparent multi-criteria evaluation
  const evaluatedQuotes = evaluateQuotations(comparedQuotations, weights);

  const handleSelectPreset = (presetId) => {
    setActivePreset(presetId);
    if (PRESET_WEIGHTS[presetId]) {
      setWeights(PRESET_WEIGHTS[presetId].weights);
    }
  };

  const handleCustomWeightsChange = (newWeights) => {
    setWeights(newWeights);
    setActivePreset('custom');
  };

  const handleToggleQuote = (id) => {
    if (selectedQuoteIds.includes(id)) {
      if (selectedQuoteIds.length > 2) {
        setSelectedQuoteIds(selectedQuoteIds.filter(item => item !== id));
      } else {
        alert('Please maintain at least 2 quotations for evaluation.');
      }
    } else {
      if (selectedQuoteIds.length >= 4) {
        alert('You can evaluate up to 4 quotations concurrently.');
        return;
      }
      setSelectedQuoteIds([...selectedQuoteIds, id]);
    }
  };

  const handleResetSelection = () => {
    setSelectedQuoteIds(quotations.slice(0, 3).map(q => q._id || q.id));
  };

  const handleExportPDF = () => {
    if (comparedQuotations.length < 2) {
      alert('Please select at least 2 quotations to generate a comparison report.');
      return;
    }

    exportComparisonPDF({
      quotations: comparedQuotations,
      evaluatedQuotes,
      alignedItems: comparisonDetails?.alignedItems || [],
      weights,
      insights: comparisonDetails?.insights || {}
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Procurement Analytics & Trade-Off Reports
            </h1>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
              Phase 5 Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit supplier quotations, customize multi-criteria evaluation weighting, and export audit-ready PDF reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="year">This Fiscal Year</option>
            </select>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            title="Download executive PDF evaluation report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('tradeoff')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'tradeoff'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Trade-Off Analysis & Pros/Cons</span>
        </button>

        <button
          onClick={() => setActiveTab('scoring')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'scoring'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Evaluation Weighting Configuration</span>
        </button>

        <button
          onClick={() => setActiveTab('cost')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'cost'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Cost & Spend Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'suppliers'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Supplier Performance Audit</span>
        </button>
      </div>

      {/* TAB 1: Trade-Off Analysis & Pros/Cons */}
      {activeTab === 'tradeoff' && (
        <div className="space-y-6">
          {/* Quotation Selector */}
          <QuotationSelectorBar
            availableQuotations={filteredQuotations}
            selectedIds={selectedQuoteIds}
            onToggleQuote={handleToggleQuote}
            onResetSelection={handleResetSelection}
          />

          {/* Criteria Weighting Sliders */}
          <CriteriaWeightingControls
            weights={weights}
            onChangeWeights={handleCustomWeightsChange}
            activePreset={activePreset}
            onSelectPreset={handleSelectPreset}
          />

          {/* Trade-Off Pros & Cons Cards */}
          <TradeOffProsConsCard
            evaluatedQuotes={evaluatedQuotes}
            weights={weights}
          />

          {/* Commercial Terms Breakdown Matrix */}
          {comparisonDetails && comparisonDetails.quotations?.length >= 2 && (
            <CommercialTermsMatrix
              quotations={comparisonDetails.quotations}
              insights={comparisonDetails.insights || {}}
            />
          )}
        </div>
      )}

      {/* TAB 2: Configurable Evaluation Weighting */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          <CriteriaWeightingControls
            weights={weights}
            onChangeWeights={handleCustomWeightsChange}
            activePreset={activePreset}
            onSelectPreset={handleSelectPreset}
          />

          {/* Scorecards */}
          <TradeOffProsConsCard
            evaluatedQuotes={evaluatedQuotes}
            weights={weights}
          />
        </div>
      )}

      {/* TAB 3: Cost & Spend Breakdown */}
      {activeTab === 'cost' && (
        <CostBreakdownReport
          quotations={filteredQuotations}
        />
      )}

      {/* TAB 4: Supplier Performance */}
      {activeTab === 'suppliers' && (
        <SupplierPerformanceReport
          suppliers={suppliers}
          quotations={filteredQuotations}
          onSelectSupplier={onSelectSupplier}
        />
      )}
    </div>
  );
}
