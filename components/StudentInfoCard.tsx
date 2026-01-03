import React from 'react';
import { Phone, User, Info, Baby } from 'lucide-react';
import { ChildProfile } from '../types';

interface StudentInfoCardProps {
  child: ChildProfile;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ child }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
         <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full text-indigo-500">
            <Info size={20} />
         </div>
         <h3 className="font-bold text-slate-800 dark:text-slate-100">Student Profile</h3>
      </div>
      
      <div className="space-y-4">
         {/* Child Details */}
         <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <Baby size={32} className="text-slate-400" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-none mb-1">{child.name}</h4>
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{child.age} Years Old</div>
                <div className="text-xs bg-slate-50 dark:bg-slate-750 p-2 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 italic">
                    "{child.info}"
                </div>
            </div>
         </div>

         <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

         {/* Emergency Contact */}
         <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-50 dark:bg-slate-750 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                 <div className="flex items-center gap-2 mb-1">
                     <User size={12} className="text-slate-400" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Parent</span>
                 </div>
                 <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
                     {child.parentName || "Not listed"}
                 </div>
             </div>
             
             <a href={`tel:${child.emergencyContact}`} className="bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-2 mb-1">
                     <Phone size={12} className="text-red-400" />
                     <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Emergency</span>
                 </div>
                 <div className="font-semibold text-red-700 dark:text-red-300 text-sm truncate group-hover:underline">
                     {child.emergencyContact || "No number"}
                 </div>
             </a>
         </div>
      </div>
    </div>
  );
};