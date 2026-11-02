import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  FileSpreadsheet, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  X, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, pendingCount }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active view based on path
  const currentPath = location.pathname;

  const navItems = [
    { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'suppliers', path: '/suppliers', label: 'Suppliers', icon: Building2 },
    { 
      id: 'quotations', 
      path: '/quotations', 
      label: 'Quotations', 
      icon: FileSpreadsheet, 
      badge: pendingCount > 0 ? pendingCount : null 
    },
    { id: 'compare', path: '/compare', label: 'Compare Quotations', icon: ArrowLeftRight },
    { id: 'reports', path: '/reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50 group-hover:scale-105 transition">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Supplier<span className="text-blue-600">Quote</span></span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Procurement Hub</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? currentPath === '/' 
              : currentPath.startsWith(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </div>
              </button>
            );
          })}

          {/* Feature Highlight Card */}
          <div className="pt-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 relative overflow-hidden">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full absolute -right-4 -bottom-4 blur-sm" />
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Unit Price Normalizer</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Compares package sizes across kg, grams, litres, and units with zero bias.
              </p>
              <button
                onClick={() => handleNavClick('/compare')}
                className="w-full text-xs font-semibold py-2 px-3 bg-white text-blue-600 border border-blue-200/80 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
              >
                Launch Matrix
              </button>
            </div>
          </div>
        </div>

        {/* User / Procurement Org Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm ring-2 ring-white">
                  SJ
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-500">Procurement Manager</p>
              </div>
            </div>
            <button 
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
              title="Organization Settings"
              onClick={() => handleNavClick('/settings')}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
