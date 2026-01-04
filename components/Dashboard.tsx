
import React, { useState, useEffect } from 'react';
import { UserRole, LogEntry, LogType, StressLevel, ChildProfile } from '../types.ts';
import { STRESS_BUTTONS, APP_COLOR_ACCENT, SIMULATED_GRAPH_DATA } from '../constants.ts';
import { Plus, Activity, HeartPulse, Wifi, Info, Trophy, School } from 'lucide-react';
import { CheckInModal } from './CheckInModal.tsx';
import { ActivityModal } from './ActivityModal.tsx';
import { AchievementModal } from './AchievementModal.tsx';
import { PredictionPanel } from './PredictionPanel.tsx';
import { StudentInfoCard } from './StudentInfoCard.tsx';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, CartesianGrid, Line } from 'recharts';

const SHEET_ID = '1vy9GLU3dww9Cl8UtYeAODbndFRIn_WyN3gVtem0DK1s';
const BPM_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

interface DashboardProps {
  userName: string;
  userRole: UserRole;
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  activeChild: ChildProfile;
  onRiskAlert: (level: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userName,
  userRole, 
  logs, 
  addLog, 
  activeChild, 
  onRiskAlert
}) => {
  const [isCheckInOpen, setCheckInOpen] = useState(false);
  const [isActivityOpen, setActivityOpen] = useState(false);
  const [isAchievementOpen, setAchievementOpen] = useState(false);
  
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchBpm = async () => {
      try {
        const response = await fetch(BPM_CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch BPM from sheet');
        
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim().length > 0);
        
        if (rows.length > 1) {
          const lastRow = rows[rows.length - 1].split(',');
          const rawBpmValue = lastRow[1]?.trim();
          const lastValue = parseFloat(rawBpmValue);
          
          if (isNaN(lastValue) || lastValue === 0) {
            setBpm(null);
          } else {
            setBpm(lastValue);
          }
        }
      } catch (error) {
        console.error("Error fetching BPM from Google Sheet:", error);
        setBpm(null);
      }
    };

    if (isDeviceConnected) {
      fetchBpm();
      intervalId = setInterval(fetchBpm, 5000);
    } else {
      setBpm(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDeviceConnected]);

  const handleQuickStress = (level: StressLevel) => {
    addLog({
      id: crypto.randomUUID(),
      childId: activeChild.id,
      timestamp: Date.now(),
      type: LogType.STRESS_INDICATOR,
      authorRole: userRole,
      stressLevel: level,
      details: `Quick log: ${level}`
    });
  };

  const handleModalSubmit = (entry: Omit<LogEntry, 'id' | 'timestamp' | 'childId'>) => {
    addLog({
      ...entry,
      id: crypto.randomUUID(),
      childId: activeChild.id,
      timestamp: Date.now()
    });
  };

  const schoolLogs = logs.filter(
      l => l.authorRole === UserRole.EDUCATOR && 
      (l.type === LogType.ACHIEVEMENT || l.type === LogType.ACTIVITY)
  ).reverse();

  return (
    <div className="max-w-md md:max-w-5xl mx-auto p-4 pb-24 space-y-6">
      
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {userName}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Dashboard for {activeChild.name} • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
        
        <div className="order-1 md:order-2 md:col-span-1 space-y-4">
           {userRole === UserRole.EDUCATOR && <StudentInfoCard child={activeChild} />}
           <PredictionPanel logs={logs} onRiskAlert={onRiskAlert} />

           <button 
                onClick={() => setIsDeviceConnected(!isDeviceConnected)}
                className={`w-full p-4 rounded-3xl shadow-sm text-left transition-all active:scale-[0.98] border border-transparent ${
                    isDeviceConnected 
                    ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-lg shadow-slate-200 dark:shadow-none border-slate-800' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
             >
                <div className="flex justify-between items-start mb-2">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDeviceConnected ? 'bg-slate-800 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700'}`}>
                      <HeartPulse size={20} className={isDeviceConnected ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                   </div>
                   {isDeviceConnected && <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-full flex items-center gap-1"><Wifi size={10} /> Live</div>}
                </div>
                <div>
                  <div className="text-xs font-medium opacity-70 uppercase tracking-wide">Heart Rate Monitor (Cloud)</div>
                  <div className="font-bold text-3xl leading-tight tabular-nums" id="bpm-display">
                      {isDeviceConnected ? (bpm || '--') : 'Connect'} <span className="text-sm font-normal opacity-60">{isDeviceConnected && 'BPM'}</span>
                  </div>
                </div>
           </button>
        </div>

        <div className="order-2 md:order-1 md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => setCheckInOpen(true)} className="group relative overflow-hidden p-5 rounded-3xl shadow-lg shadow-rose-100 dark:shadow-none text-left bg-rose-500 text-white transition-transform active:scale-[0.98]">
                <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 pointer-events-none group-hover:rotate-12 transition-transform"><Plus size={48} /></div>
                <div className="bg-white/20 w-10 h-10 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm"><Plus size={24} className="text-white" /></div>
                <div className="font-bold text-lg leading-none mb-1">Check-In</div>
                <div className="text-rose-100 text-xs font-medium opacity-90">Log mood & sleep</div>
             </button>

             <button onClick={() => setActivityOpen(true)} className="group p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-left bg-white dark:bg-slate-800 text-slate-800 dark:text-white transition-transform active:scale-[0.98] hover:border-slate-200 dark:hover:border-slate-600">
                <div className="bg-slate-50 dark:bg-slate-700 w-10 h-10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-slate-100 dark:group-hover:bg-slate-600 transition-colors">
                    <Activity size={24} className={APP_COLOR_ACCENT} />
                </div>
                <div className="font-bold text-lg leading-none mb-1">Activity</div>
                <div className="text-slate-400 text-xs font-medium">Meals, transitions</div>
             </button>

             {userRole === UserRole.EDUCATOR && (
               <button onClick={() => setAchievementOpen(true)} className="col-span-2 group p-5 rounded-3xl shadow-sm border border-amber-200 dark:border-amber-900/50 text-left bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 transition-transform active:scale-[0.98] flex items-center gap-4">
                  <div className="bg-amber-100 dark:bg-amber-800 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-700 transition-colors">
                      <Trophy size={28} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                      <div className="font-bold text-lg leading-none mb-1">Log Achievement</div>
                      <div className="text-amber-700/60 dark:text-amber-300/60 text-xs font-medium">Record a task completion or win</div>
                  </div>
               </button>
             )}
          </div>

          <div className="bg-white dark:bg-slate-800 py-4 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700">
             <div className="px-5 mb-2 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Indicators</h3>
                 <span className="text-[10px] text-slate-300">Scroll for more</span>
             </div>
             <div className="overflow-x-auto pb-2 px-5 hide-scrollbar">
               <div className="flex gap-2 min-w-max">
                  {STRESS_BUTTONS.map(btn => (
                      <button key={btn.value} onClick={() => handleQuickStress(btn.value)} className={`px-4 py-3 rounded-2xl text-sm font-semibold border transition-all active:scale-95 whitespace-nowrap ${btn.color}`}>
                          {btn.label}
                      </button>
                  ))}
               </div>
             </div>
          </div>

           <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-1">Trends & Insights</h3>
              <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 flex flex-col min-h-[300px]">
                      <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mood vs. BPM</h3>
                            <div className="group relative">
                                <Info size={12} className="text-slate-300 cursor-help" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">Correlates manual mood logs with your real-time heart rate from Google Sheets.</div>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500">Correlation of State & Biometrics</p>
                      </div>
                      <div className="flex-1 w-full h-full min-h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={SIMULATED_GRAPH_DATA}>
                                  <defs>
                                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                  <XAxis dataKey="time" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                  <YAxis yAxisId="left" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} width={20} hide />
                                  <YAxis yAxisId="right" orientation="right" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} width={20} domain={[60, 120]} hide />
                                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#94a3b8' }} />
                                  <Area yAxisId="left" type="monotone" dataKey="moodScore" name="Mood Score" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorMood)" />
                                  {isDeviceConnected && <Line yAxisId="right" type="monotone" dataKey="heartRate" name="BPM" stroke="#10b981" strokeWidth={2} dot={false} />}
                              </ComposedChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>
           </div>
           
           {userRole === UserRole.PARENT && schoolLogs.length > 0 && (
             <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                   <School size={20} className="text-amber-600 dark:text-amber-400" />
                   <h3 className="font-bold text-amber-900 dark:text-amber-100">School Updates</h3>
                </div>
                <div className="space-y-3">
                    {schoolLogs.slice(0, 3).map(log => (
                        <div key={log.id} className="bg-white dark:bg-slate-800 p-3 rounded-2xl flex items-start gap-3 shadow-sm">
                             {log.type === LogType.ACHIEVEMENT ? (<div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full shrink-0"><Trophy size={14} className="text-amber-600 dark:text-amber-400" /></div>) : (<div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full shrink-0"><Activity size={14} className="text-slate-500 dark:text-slate-400" /></div>)}
                             <div><div className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.activityName}</div><div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{log.details}</div><div className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div>
                        </div>
                    ))}
                </div>
             </div>
           )}

           <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity Log</h3>
               <button className="text-rose-500 text-xs font-bold">See All</button>
             </div>
             
             <div className="space-y-4">
                {logs.length === 0 ? (
                    <div className="text-center py-8 text-slate-300 text-sm font-medium">No activity logged yet today.</div>
                ) : (
                    logs.slice().reverse().slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).replace(" ", "")}</span>
                                <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-700 min-h-[20px]"></div>
                            </div>
                            <div className="pb-4 w-full">
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                        {log.type === LogType.MOOD && `Mood Check-in`}
                                        {log.type === LogType.ACTIVITY && log.activityName}
                                        {log.type === LogType.STRESS_INDICATOR && log.stressLevel}
                                        {log.type === LogType.ACHIEVEMENT && log.activityName}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${log.type === LogType.ACHIEVEMENT ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>{log.authorRole}</span>
                                </div>
                                {log.details && <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-snug">{log.details}</div>}
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>
        </div>
      </div>

      <CheckInModal isOpen={isCheckInOpen} onClose={() => setCheckInOpen(false)} onSubmit={handleModalSubmit} userRole={userRole} />
      <ActivityModal isOpen={isActivityOpen} onClose={() => setActivityOpen(false)} onSubmit={handleModalSubmit} userRole={userRole} />
      <AchievementModal isOpen={isAchievementOpen} onClose={() => setAchievementOpen(false)} onSubmit={handleModalSubmit} userRole={userRole} />
    </div>
  );
};
