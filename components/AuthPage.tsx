
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Heart, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { APP_COLOR_ACCENT, APP_COLOR_PRIMARY, BG_COLOR_ACCENT } from '../constants';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PARENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDemoLogin = (type: 'parent' | 'teacher') => {
    const demoUser: User = {
      id: type === 'parent' ? 'demo-parent-id' : 'demo-teacher-id',
      name: type === 'parent' ? 'Sarah' : 'Mr. Henderson',
      email: type === 'parent' ? 'parent@demo.com' : 'teacher@demo.com',
      role: type === 'parent' ? UserRole.PARENT : UserRole.EDUCATOR
    };
    onLogin(demoUser);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for Demo Credentials (Hidden from UI but functional)
    if (!isSignUp) {
      if (email === 'parent@demo.com' && password === 'demo123') {
        handleDemoLogin('parent');
        return;
      }
      if (email === 'teacher@demo.com' && password === 'demo123') {
        handleDemoLogin('teacher');
        return;
      }
      
      // Basic validation for other inputs
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
    }

    // Standard Login Simulation for new accounts
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name || (isSignUp ? 'New User' : 'Guest User'),
      email: email,
      role: role
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center gap-2 mb-2">
           <Heart className={`w-12 h-12 ${APP_COLOR_ACCENT} fill-current`} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className={`${APP_COLOR_PRIMARY} dark:text-slate-100`}>Autism</span>
          <span className={APP_COLOR_ACCENT}>3000</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Collaborative care for parents & educators</p>
      </div>

      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Toggle Header */}
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${!isSignUp ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${isSignUp ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {isSignUp && (
            <div className="space-y-4 mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">Select your role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.PARENT)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    role === UserRole.PARENT 
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' 
                    : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.EDUCATOR)}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    role === UserRole.EDUCATOR 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                    : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Educator
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

          <button 
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-rose-200 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${BG_COLOR_ACCENT}`}
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-center text-xs text-slate-400">
        Demo Accounts: parent@demo.com or teacher@demo.com (PW: demo123)
      </p>
    </div>
  );
};
