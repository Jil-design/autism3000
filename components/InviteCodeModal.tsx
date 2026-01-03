import React from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { ChildProfile } from '../types';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
}

export const InviteCodeModal: React.FC<InviteCodeModalProps> = ({ isOpen, onClose, child }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(child.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 flex justify-end">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
            </button>
        </div>
        
        <div className="px-8 pb-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Invite Educator</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Share this code with {child.name}'s educator to give them access to this dashboard.
            </p>

            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 mb-6 relative group">
                <div className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100 tracking-widest">
                    {child.inviteCode}
                </div>
            </div>

            <button 
                onClick={handleCopy}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-900 dark:bg-slate-700 text-white hover:opacity-90'
                }`}
            >
                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>
      </div>
    </div>
  );
};