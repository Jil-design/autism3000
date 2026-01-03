import React, { useState } from 'react';
import { Link, ArrowRight, X } from 'lucide-react';

interface ConnectStudentModalProps {
  isOpen: boolean;
  onConnect: (code: string) => void;
  onClose: () => void;
  error?: string;
}

export const ConnectStudentModal: React.FC<ConnectStudentModalProps> = ({ isOpen, onConnect, onClose, error }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 relative">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
        >
            <X size={20} />
        </button>

        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
           <Link size={32} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Connect to Student</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
            Please enter the <strong>Invite Code</strong> provided by the student's parent to access their dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE (e.g. CHILD-1234)"
                className="w-full text-center text-2xl font-mono tracking-widest uppercase bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl py-4 text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-0 outline-none"
            />
            
            {error && (
                <div className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    {error}
                </div>
            )}

            <button 
                type="submit"
                disabled={!code}
                className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-200 dark:shadow-none hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                Connect
                <ArrowRight size={20} />
            </button>
        </form>
      </div>
    </div>
  );
};