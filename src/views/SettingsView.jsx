import React, { useState } from 'react';
import { 
  Settings, 
  Building, 
  DollarSign, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    companyName: 'Apex Global Enterprises Inc.',
    procurementLead: 'Sarah Jenkins',
    defaultCurrency: 'USD ($)',
    quoteThreshold: 5000,
    paymentTermDefault: 'Net 30',
    notifyNewQuote: true,
    notifyExpiring: true,
    autoHighlightBestPrice: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System & Procurement Settings</h2>
          <p className="text-xs text-slate-600">
            Configure default quote evaluation parameters and business credentials
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Organization Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Procurement Lead Officer</label>
              <input
                type="text"
                value={settings.procurementLead}
                onChange={(e) => setSettings({ ...settings, procurementLead: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Commercial Defaults */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Commercial & Evaluation Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="USD ($)">USD - US Dollar ($)</option>
                <option value="EUR (€)">EUR - Euro (€)</option>
                <option value="GBP (£)">GBP - British Pound (£)</option>
                <option value="INR (₹)">INR - Indian Rupee (₹)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mandatory Multi-Quote Threshold</label>
              <input
                type="number"
                value={settings.quoteThreshold}
                onChange={(e) => setSettings({ ...settings, quoteThreshold: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
              <span className="text-[10px] text-slate-600">Requires 3 quotes if exceeded</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Credit Terms</label>
              <select
                value={settings.paymentTermDefault}
                onChange={(e) => setSettings({ ...settings, paymentTermDefault: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Net 60">Net 60 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">Automation & Notification Alerts</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyNewQuote}
                onChange={(e) => setSettings({ ...settings, notifyNewQuote: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">Instant alerts on new quotation arrival</span>
                <span className="text-slate-600 text-[11px]">Notify procurement team when vendor submits rate bid</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyExpiring}
                onChange={(e) => setSettings({ ...settings, notifyExpiring: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">Expiry warnings 5 days prior</span>
                <span className="text-slate-600 text-[11px]">Alert when price lock validity is close to running out</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoHighlightBestPrice}
                onChange={(e) => setSettings({ ...settings, autoHighlightBestPrice: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">Auto-calculate and highlight best cost option</span>
                <span className="text-slate-600 text-[11px]">Display recommendation badge on lowest total bid</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {saved && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings successfully saved!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
