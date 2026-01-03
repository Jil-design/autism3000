import React from 'react';
import { LogOut } from 'lucide-react';
import { BG_COLOR_ACCENT } from '../constants';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut size={32} className="text-red-500 dark:text-red-400" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Sign Out?</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Are you sure you want to end your session? <br/>Unsaved notes will be lost.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onClose}
            className="py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`py-3 rounded-xl font-semibold text-white shadow-lg shadow-rose-200 dark:shadow-none hover:opacity-90 transition-opacity ${BG_COLOR_ACCENT}`}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};