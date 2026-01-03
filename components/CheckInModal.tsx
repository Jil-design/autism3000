import React, { useState } from 'react';
import { X, Moon, Sun, Battery, MessageSquare } from 'lucide-react';
import { UserRole, LogEntry, LogType, MoodLevel } from '../types';
import { MOOD_OPTIONS, BG_COLOR_ACCENT } from '../constants';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  userRole: UserRole;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [mood, setMood] = useState<MoodLevel>(MoodLevel.NEUTRAL);
  const [energy, setEnergy] = useState<number>(3); // 1-5
  const [sleepQuality, setSleepQuality] = useState<number>(3); // 1-5
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details = `Energy: ${energy}/5. ${userRole === UserRole.PARENT ? `Sleep: ${sleepQuality}/5.` : ''} Note: ${notes}`;
    onSubmit({
      type: LogType.MOOD,
      authorRole: userRole,
      moodLevel: mood,
      details: details,
      sleepQuality: userRole === UserRole.PARENT ? sleepQuality : undefined
    });
    setNotes("");
    setMood(MoodLevel.NEUTRAL);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-t-3xl md:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg pl-2">Daily Check-In</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full transition-colors">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Current Mood</label>
            <div className="flex justify-between gap-1">
              {MOOD_OPTIONS.map((option) => {
                 const Icon = option.icon;
                 const isSelected = mood === option.value;
                 return (
                   <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`flex-1 flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${
                      isSelected ? 'bg-slate-50 dark:bg-slate-700 scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                    }`}
                   >
                     <Icon 
                        size={32} 
                        className={isSelected ? option.color : 'text-slate-400 dark:text-slate-500'} 
                        strokeWidth={isSelected ? 2.5 : 1.5}
                     />
                     {isSelected && <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 animate-in fade-in">{option.label}</span>}
                   </button>
                 );
              })}
            </div>
          </div>

          {/* Sleep (Parent Only) */}
          {userRole === UserRole.PARENT && (
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                 Last Night's Sleep
               </label>
               <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-2xl flex items-center gap-4">
                 <Moon size={20} className="text-indigo-400" />
                 <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold w-4">{sleepQuality}</span>
               </div>
             </div>
          )}

          {/* Energy Level */}
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Energy Level</label>
             <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-2xl flex items-center gap-4">
                 <Battery size={20} className="text-emerald-500" />
                 <input 
                   type="range" 
                   min="1" 
                   max="5" 
                   value={energy}
                   onChange={(e) => setEnergy(parseInt(e.target.value))}
                   className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                 />
                 <span className="text-emerald-600 dark:text-emerald-400 font-bold w-4">{energy}</span>
             </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any context..."
              className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none h-24 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-rose-200 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all ${BG_COLOR_ACCENT}`}
          >
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
};