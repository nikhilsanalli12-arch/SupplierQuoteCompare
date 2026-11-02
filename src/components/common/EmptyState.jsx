import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'Get started by creating a new record in this section.',
  actionLabel,
  onAction,
  icon: Icon = Inbox
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>

      <div className="max-w-md">
        <h4 className="font-bold text-base text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
