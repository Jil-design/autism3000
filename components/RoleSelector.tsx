import React from 'react';
import { UserRole } from '../types';
import { Baby, GraduationCap, Heart } from 'lucide-react';
import { APP_COLOR_ACCENT } from '../constants';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md mx-auto flex flex-col gap-8">
          <div className="text-center">
            <div className="inline-flex justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-rose-200 dark:bg-rose-900 rounded-full blur-2xl opacity-40"></div>
                 <Heart className={`w-16 h-16 ${APP_COLOR_ACCENT} fill-current relative z-10`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Please select your role to continue
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => onSelectRole(UserRole.PARENT)}
              className="group relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                <Baby size={28} />
              </div>
              <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Parent</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">Log home activities & sleep</p>
              </div>
            </button>

            <button
              onClick={() => onSelectRole(UserRole.EDUCATOR)}
              className="group relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center shrink-0">
                <GraduationCap size={28} />
              </div>
              <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Educator</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">Log school transitions & focus</p>
              </div>
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-300 dark:text-slate-600 mt-4">Autism3000 v1.0</p>
      </div>
    </div>
  );
};