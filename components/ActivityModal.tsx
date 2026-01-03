import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserRole, LogEntry, LogType } from '../types';
import { ACTIVITY_CATEGORIES, BG_COLOR_ACCENT } from '../constants';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  userRole: UserRole;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(ACTIVITY_CATEGORIES[0].label);
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: LogType.ACTIVITY,
      authorRole: userRole,
      activityName: selectedCategory,
      details: details || "No additional details logged."
    });
    setDetails("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white">Log Activity</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {ACTIVITY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-700 dark:text-rose-400' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-rose-500' : 'text-slate-400'} />
                  <span className="text-[10px] font-medium text-center leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Details (Optional)</label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g., Ate half sandwich, Played with blocks..."
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 transition-opacity ${BG_COLOR_ACCENT}`}
          >
            Log Activity
          </button>
        </form>
      </div>
    </div>
  );
};