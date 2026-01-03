import React from 'react';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationToastProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((note) => (
        <div 
          key={note.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border animate-in slide-in-from-right duration-300 ${
            note.type === 'critical' 
              ? 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100' 
              : note.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {note.type === 'critical' && <AlertTriangle size={20} className="text-red-600 dark:text-red-300" />}
            {note.type === 'success' && <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-300" />}
            {note.type === 'info' && <Info size={20} className="text-blue-500" />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-0.5">{note.title}</h4>
            <p className="text-xs opacity-90 leading-snug">{note.message}</p>
          </div>
          <button 
            onClick={() => onDismiss(note.id)}
            className="shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};