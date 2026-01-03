
import React, { useState, useEffect } from 'react';
import { X, Baby, Trash2, Save, Phone } from 'lucide-react';
import { ChildProfile, UserRole } from '../types';
import { BG_COLOR_ACCENT } from '../constants';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: ChildProfile) => void;
  onDelete: (childId: string) => void;
  initialData?: ChildProfile | null;
  currentUserRole: UserRole;
  currentUserName: string;
  isForced?: boolean; // If true, cannot close without saving (for initial onboarding)
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialData,
  currentUserRole,
  currentUserName,
  isForced = false
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(5);
  const [info, setInfo] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAge(initialData.age);
      setInfo(initialData.info);
      setEmergencyContact(initialData.emergencyContact || '');
    } else {
      setName('');
      setAge(5);
      setInfo('');
      setEmergencyContact('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // If Educator, show Read-Only view (though typically they wouldn't see this modal to edit, strictly for safety)
  const isReadOnly = currentUserRole === UserRole.EDUCATOR;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: ChildProfile = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      age,
      info,
      parentName: initialData?.parentName || currentUserName, // Use existing or current user's name
      emergencyContact,
      inviteCode: initialData?.inviteCode || `CHILD-${Math.floor(1000 + Math.random() * 9000)}`
    };
    onSave(newProfile);
    if (!isForced) onClose();
  };

  const handleDelete = () => {
    if (initialData && window.confirm('Are you sure you want to delete this profile? All data will be lost.')) {
        onDelete(initialData.id);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
             <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-500">
                <Baby size={24} />
             </div>
             <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                {initialData ? 'Edit Child Profile' : 'Add Child Profile'}
             </h3>
          </div>
          {!isForced && (
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Child's Name</label>
                    <input 
                        type="text" 
                        required
                        disabled={isReadOnly}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                
                <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                    <input 
                        type="number" 
                        required
                        disabled={isReadOnly}
                        min="1"
                        max="18"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diagnosis / Key Info</label>
                <textarea 
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    disabled={isReadOnly}
                    placeholder="e.g. Sensory sensitivities to loud noises, loves trains..."
                    className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                />
            </div>

            <div className="grid grid-cols-1">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Phone size={12} /> Emergency Contact
                    </label>
                    <input 
                        type="tel" 
                        required
                        disabled={isReadOnly}
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {!isReadOnly && (
                <div className="flex gap-3 pt-4">
                    {initialData && !isForced && (
                        <button 
                            type="button" 
                            onClick={handleDelete}
                            className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button 
                        type="submit"
                        className={`flex-1 py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all bg-blue-500 flex items-center justify-center gap-2`}
                    >
                        <Save size={20} />
                        {initialData ? 'Save Changes' : 'Add Child'}
                    </button>
                </div>
            )}
        </form>
      </div>
    </div>
  );
};
