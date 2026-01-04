
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { AuthPage } from './components/AuthPage.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { CommunityPage } from './components/CommunityPage.tsx';
import { LogoutModal } from './components/LogoutModal.tsx';
import { ChildProfileModal } from './components/ChildProfileModal.tsx';
import { ConnectStudentModal } from './components/ConnectStudentModal.tsx';
import { InviteCodeModal } from './components/InviteCodeModal.tsx';
import { NotificationToast } from './components/NotificationToast.tsx';
import { UserRole, LogEntry, AppView, User, ChildProfile, NotificationItem, LogType, StressLevel, MoodLevel } from './types.ts';
import { Link } from 'lucide-react';

const DEMO_CHILD_ID = 'demo-child-leo';
const DEMO_CHILD: ChildProfile = {
  id: DEMO_CHILD_ID,
  name: "Leo",
  age: 6,
  info: "Sensory sensitivities to loud noises, loves space and trains.",
  inviteCode: "LEO-2024",
  parentName: "Sarah Parent",
  emergencyContact: "(555) 010-9988"
};

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    childId: DEMO_CHILD_ID,
    timestamp: Date.now() - 3600000 * 4,
    type: LogType.MOOD,
    authorRole: UserRole.PARENT,
    moodLevel: MoodLevel.HAPPY,
    details: "Woke up well, very interested in his toy rocket."
  }
];

const STORAGE_KEY_USER = 'autism3000_user';
const STORAGE_KEY_LOGS = 'autism3000_logs';
const STORAGE_KEY_CHILDREN = 'autism3000_children';
const STORAGE_KEY_CONNECTED = 'autism3000_connected_ids';

const getSaved = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to parse storage for ${key}`, e);
    return fallback;
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getSaved(STORAGE_KEY_USER, null));
  const [logs, setLogs] = useState<LogEntry[]>(() => getSaved(STORAGE_KEY_LOGS, INITIAL_LOGS));
  const [children, setChildren] = useState<ChildProfile[]>(() => getSaved(STORAGE_KEY_CHILDREN, [DEMO_CHILD]));
  const [educatorConnectedIds, setEducatorConnectedIds] = useState<string[]>(() => getSaved(STORAGE_KEY_CONNECTED, [DEMO_CHILD_ID]));

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectError, setConnectError] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    localStorage.getItem('autism3000_theme') as 'light' | 'dark' || 'light'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHILDREN, JSON.stringify(children));
    } catch (e) {}
  }, [children]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONNECTED, JSON.stringify(educatorConnectedIds));
    } catch (e) {}
  }, [educatorConnectedIds]);

  useEffect(() => {
    localStorage.setItem('autism3000_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser && !activeChildId) {
      if (currentUser.role === UserRole.EDUCATOR) {
        if (educatorConnectedIds.length > 0) setActiveChildId(educatorConnectedIds[0]);
      } else {
        if (children.length > 0) setActiveChildId(children[0].id);
      }
    }
  }, [currentUser, activeChildId, children, educatorConnectedIds]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogoutConfirm = () => {
    setCurrentUser(null);
    setActiveChildId(null);
    setCurrentView('dashboard');
    setShowLogoutModal(false);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const addNotification = (note: Omit<NotificationItem, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setNotifications(prev => [...prev, { ...note, id }]);
    setTimeout(() => dismissNotification(id), 6000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddLog = (log: LogEntry) => {
    setLogs(prev => [...prev, log]);
    if (log.type === LogType.STRESS_INDICATOR && (log.stressLevel === StressLevel.OVERWHELMED || log.stressLevel === StressLevel.STRESSED)) {
         const isOverwhelmed = log.stressLevel === StressLevel.OVERWHELMED;
         addNotification({
             title: isOverwhelmed ? '🚨 High Stress Alert' : 'Stress Indicator Logged',
             message: isOverwhelmed 
                ? `${activeChild?.name || 'Child'} is reported as Overwhelmed.`
                : `${activeChild?.name || 'Child'} is showing signs of stress.`,
             type: isOverwhelmed ? 'critical' : 'info'
         });
    }
  };

  const handleAiRiskAlert = (level: string) => {
     addNotification({
         title: level === 'Critical' ? '⚠️ Critical AI Prediction' : 'High Risk Alert',
         message: `AI predicts a ${level} risk of meltdown based on recent patterns.`,
         type: 'critical'
     });
  };

  const handleSaveChild = (child: ChildProfile) => {
    setChildren(prev => {
        const exists = prev.find(c => c.id === child.id);
        if (exists) return prev.map(c => c.id === child.id ? child : c);
        return [...prev, child];
    });
    setActiveChildId(child.id);
    setShowChildModal(false);
  };

  const handleDeleteChild = (childId: string) => {
    setChildren(prev => prev.filter(c => c.id !== childId));
    setLogs(prev => prev.filter(l => l.childId !== childId));
    if (activeChildId === childId) {
        setActiveChildId(null);
    }
  };

  const handleConnectStudent = (code: string) => {
    const child = children.find(c => c.inviteCode === code);
    if (child) {
        if (!educatorConnectedIds.includes(child.id)) {
            setEducatorConnectedIds(prev => [...prev, child.id]);
        }
        setActiveChildId(child.id);
        setConnectError(undefined);
        setShowConnectModal(false);
        addNotification({ title: 'Connected', message: `Connected to ${child.name}.`, type: 'success' });
    } else {
        setConnectError("Invalid Invite Code.");
    }
  };

  const activeChild = children.find(c => c.id === activeChildId) || null;
  const availableChildren = currentUser?.role === UserRole.EDUCATOR 
      ? children.filter(c => educatorConnectedIds.includes(c.id))
      : children;
  const activeLogs = logs.filter(l => l.childId === activeChildId);

  if (!currentUser) {
      return <AuthPage onLogin={handleLogin} />;
  }

  const parentNeedsOnboarding = currentUser.role === UserRole.PARENT && children.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Header 
        user={currentUser}
        activeChild={activeChild}
        availableChildren={availableChildren}
        currentView={currentView}
        isDarkMode={theme === 'dark'}
        onNavigate={setCurrentView}
        onToggleTheme={toggleTheme}
        onLogoutClick={() => setShowLogoutModal(true)}
        onManageProfile={() => setShowChildModal(true)}
        onShowInvite={() => setShowInviteModal(true)}
        onSwitchChild={setActiveChildId}
        onAddStudent={() => setShowConnectModal(true)}
      />
      
      <main>
        {(parentNeedsOnboarding || (currentUser.role === UserRole.EDUCATOR && !activeChildId)) && currentView === 'dashboard' ? (
            <div className="flex items-center justify-center min-h-[80vh] p-4 text-center">
                <div className="max-w-md w-full">
                   {currentUser.role === UserRole.EDUCATOR && !activeChildId && (
                       <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                           <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                               <Link size={32} />
                           </div>
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Student Connected</h3>
                           <button onClick={() => setShowConnectModal(true)} className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold mt-4 shadow-lg shadow-emerald-200 dark:shadow-none">
                             Connect Student
                           </button>
                       </div>
                   )}
                </div>
            </div>
        ) : (
            <>
                {currentView === 'dashboard' && activeChild && (
                <Dashboard 
                    userName={currentUser.name}
                    userRole={currentUser.role}
                    logs={activeLogs} 
                    addLog={handleAddLog} 
                    activeChild={activeChild}
                    onRiskAlert={handleAiRiskAlert}
                />
                )}
                {currentView === 'community' && <CommunityPage userRole={currentUser.role} />}
            </>
        )}
      </main>

      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />
      <ChildProfileModal 
        isOpen={showChildModal || parentNeedsOnboarding} 
        isForced={parentNeedsOnboarding} 
        onClose={() => setShowChildModal(false)} 
        onSave={handleSaveChild} 
        onDelete={handleDeleteChild} 
        initialData={activeChild} 
        currentUserRole={currentUser.role}
        currentUserName={currentUser.name} 
      />
      {activeChild && <InviteCodeModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} child={activeChild} />}
      <ConnectStudentModal isOpen={showConnectModal} onConnect={handleConnectStudent} onClose={() => setShowConnectModal(false)} error={connectError} />
    </div>
  );
}

export default App;
