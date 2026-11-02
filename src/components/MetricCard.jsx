import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  onClick 
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      badge: 'bg-blue-50 text-blue-700',
      highlight: 'from-blue-500 to-indigo-600'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-50 text-amber-700',
      highlight: 'from-amber-500 to-orange-500'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700',
      highlight: 'from-emerald-500 to-teal-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      badge: 'bg-indigo-50 text-indigo-700',
      highlight: 'from-indigo-500 to-violet-600'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
            {change && (
              <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {change}
              </span>
            )}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-xl ${scheme.bg} ${scheme.text} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">{subtitle}</span>
        <span className="text-blue-600 font-semibold group-hover:underline">View Details &rarr;</span>
      </div>
    </div>
  );
}
