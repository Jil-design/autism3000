import React, { useState } from 'react';
import { X, Trophy, Star, Medal, Award } from 'lucide-react';
import { UserRole, LogEntry, LogType } from '../types';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Omit childId as it's added by the parent Dashboard
  onSubmit: (log: Omit<LogEntry, 'id' | 'timestamp' | 'childId'>) => void;
  userRole: UserRole;
}

const ACHIEVEMENT_TYPES = [
  { label: 'Task Complete', icon: Star },
  { label: 'Social Win', icon: Trophy },
  { label: 'Good Focus', icon: Medal },
  { label: 'New Skill', icon: Award },
];

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [selectedType, setSelectedType] = useState(ACHIEVEMENT_TYPES[0].label);
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: LogType.ACHIEVEMENT,
      authorRole: userRole,
      activityName: selectedType, // Reusing activityName for the type/title
      details: description || "Great job!"
    });
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header with Gold Theme */}
        <div className="p-5 border-b border-amber-100 dark:border-amber-900/30 flex justify-between items-center bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
               <Trophy size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg">Log Achievement</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-amber-800 dark:text-amber-200" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
            Celebrate a small win or completed task to share with parents.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {ACHIEVEMENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.label;
              return (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => setSelectedType(type.label)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm scale-105' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-200 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-amber-500 fill-current' : 'text-slate-300 dark:text-slate-600'} />
                  <span className="text-[10px] font-bold text-center leading-tight">{type.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Finished the math worksheet without prompts..."
              className="w-full bg-slate-50 dark:bg-slate-750 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none h-24 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-amber-200 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all bg-amber-500"
          >
            Save Achievement
          </button>
        </form>
      </div>
    </div>
  );
};