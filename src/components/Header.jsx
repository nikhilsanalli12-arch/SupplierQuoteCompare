import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  ArrowLeftRight, 
  CheckCircle2, 
  ChevronDown,
  Clock,
  Layers
} from 'lucide-react';

export default function Header({ 
  onOpenMobileMenu, 
  onNewQuotationClick, 
  searchQuery,
  setSearchQuery,
  pendingCount
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getPathMeta = () => {
    const path = location.pathname;
    if (path.startsWith('/suppliers')) {
      return { title: 'Supplier Directory', subtitle: 'Manage supplier contacts, verification status & payment terms' };
    }
    if (path.startsWith('/quotations')) {
      return { title: 'Quotation Repository', subtitle: 'Review, approve, and track incoming commercial quotes' };
    }
    if (path.startsWith('/compare')) {
      return { title: 'Quotation Comparison Matrix', subtitle: 'Side-by-side multi-parameter commercial evaluation & price normalisation' };
    }
    if (path.startsWith('/reports')) {
      return { title: 'Procurement Reports & Analytics', subtitle: 'Cost savings, supplier turnaround & expenditure insights' };
    }
    if (path.startsWith('/settings')) {
      return { title: 'System & Organization Settings', subtitle: 'Manage procurement rules, users, and currency preferences' };
    }
    return { title: 'Dashboard Overview', subtitle: 'Real-time supplier rates and procurement statistics' };
  };

  const currentMeta = getPathMeta();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {currentMeta.title}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-600 hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Center / Right: Global Search & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search bar */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotes, suppliers, parts..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400 text-slate-800"
          />
        </div>

        {/* Compare Quick Button */}
        <button
          onClick={() => navigate('/compare')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition border border-slate-200"
          title="Open Comparison Tool"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
          <span>Compare Quotes</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onNewQuotationClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">New Quotation</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="font-semibold text-xs text-slate-900">Procurement Alerts</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                  {pendingCount} Pending
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg">
                  <p className="font-semibold text-amber-900">3 Quotes Pending Review</p>
                  <p className="text-amber-700 text-[11px]">Apex Industrial & Precision Dynamics require approval.</p>
                </div>
                <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                  <p className="font-semibold text-emerald-900">Comparison Saved</p>
                  <p className="text-emerald-700 text-[11px]">Hydraulic Actuators matrix generated $3,550 in savings.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-xs text-blue-600 font-semibold pt-1 hover:underline"
              >
                Close Alerts
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
