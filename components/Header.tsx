import React, { useState } from 'react';
import { Heart, Menu, Moon, Sun, LogOut, LayoutDashboard, Users, UserCog, UserPlus, ChevronDown, Check } from 'lucide-react';
import { APP_COLOR_ACCENT, APP_COLOR_PRIMARY } from '../constants';
import { UserRole, AppView, User, ChildProfile } from '../types';

interface HeaderProps {
  user: User | null;
  activeChild: ChildProfile | null;
  availableChildren: ChildProfile[]; // List of children user has access to
  currentView: AppView;
  isDarkMode: boolean;
  onNavigate: (view: AppView) => void;
  onToggleTheme: () => void;
  onLogoutClick: () => void;
  onManageProfile?: () => void; // For parents to edit child
  onShowInvite?: () => void; // For parents to show invite code
  onSwitchChild: (childId: string) => void; // Switch active child
  onAddStudent?: () => void; // For educators to add new student
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  activeChild,
  availableChildren,
  currentView,
  isDarkMode,
  onNavigate, 
  onToggleTheme, 
  onLogoutClick,
  onManageProfile,
  onShowInvite,
  onSwitchChild,
  onAddStudent
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleChildSelector = () => setIsChildSelectorOpen(!isChildSelectorOpen);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => user && onNavigate('dashboard')}
        >
          <Heart className={`w-8 h-8 ${APP_COLOR_ACCENT} fill-current`} />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight leading-none">
                <span className={`${APP_COLOR_PRIMARY} dark:text-slate-100`}>Autism</span>
                <span className={APP_COLOR_ACCENT}>3000</span>
            </h1>
          </div>
          {/* Mobile Only: Child Name compact */}
          <div className="sm:hidden block">
             <h1 className="text-lg font-bold">
               <span className={APP_COLOR_ACCENT}>A3000</span>
             </h1>
          </div>
        </div>

        {/* Child Selector (Center) - Only if logged in and has children */}
        {user && activeChild && (
            <div className="relative z-50">
                <button 
                    onClick={toggleChildSelector}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Viewing:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{activeChild.name}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isChildSelectorOpen ? 'rotate-180' : ''}`} />
                </button>

                {isChildSelectorOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsChildSelectorOpen(false)}></div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                             <div className="p-2">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Select Profile</div>
                                {availableChildren.map(child => (
                                    <button
                                        key={child.id}
                                        onClick={() => { onSwitchChild(child.id); setIsChildSelectorOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                                    >
                                        <span className={child.id === activeChild.id ? 'text-rose-500 font-bold' : 'text-slate-600 dark:text-slate-300'}>{child.name}</span>
                                        {child.id === activeChild.id && <Check size={16} className="text-rose-500" />}
                                    </button>
                                ))}
                                
                                {user.role === UserRole.EDUCATOR && (
                                    <>
                                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                        <button
                                            onClick={() => { onAddStudent && onAddStudent(); setIsChildSelectorOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                        >
                                            <UserPlus size={16} />
                                            Add Student
                                        </button>
                                    </>
                                )}
                                
                                {user.role === UserRole.PARENT && (
                                    <>
                                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                        <button
                                            onClick={() => { onManageProfile && onManageProfile(); setIsChildSelectorOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                        >
                                            <UserPlus size={16} />
                                            Add / Edit Child
                                        </button>
                                    </>
                                )}
                             </div>
                        </div>
                    </>
                )}
            </div>
        )}
        
        {/* Navigation & Menu */}
        {user && (
          <div className="relative flex items-center gap-2">
            
            {/* Quick Actions for Parent */}
            {user.role === UserRole.PARENT && activeChild && (
                <button 
                    onClick={onShowInvite}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                    <UserPlus size={14} />
                    Invite
                </button>
            )}

            <button 
              onClick={toggleMenu}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2"
              aria-label="Menu"
            >
              <div className="hidden sm:block text-sm font-medium text-right mr-1">
                <div className="text-slate-900 dark:text-slate-100">{user.name}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Menu size={20} />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                
                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        currentView === 'dashboard' 
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>
                    
                    <button 
                      onClick={() => { onNavigate('community'); setIsMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        currentView === 'community' 
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Users size={18} />
                      Community Forum
                    </button>

                    {user.role === UserRole.PARENT && (
                         <>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                            <button 
                                onClick={() => { onManageProfile && onManageProfile(); setIsMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                <UserCog size={18} />
                                Manage Child Profile
                            </button>
                            <button 
                                onClick={() => { onShowInvite && onShowInvite(); setIsMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            >
                                <UserPlus size={18} />
                                Invite Educator
                            </button>
                         </>
                    )}
                    
                    {user.role === UserRole.EDUCATOR && (
                        <>
                           <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                           <button 
                                onClick={() => { onAddStudent && onAddStudent(); setIsMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                            >
                                <UserPlus size={18} />
                                Connect New Student
                            </button>
                        </>
                    )}
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>

                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { onToggleTheme(); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </div>
                      <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-rose-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setIsMenuOpen(false); onLogoutClick(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};