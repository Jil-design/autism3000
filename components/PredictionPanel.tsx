import React, { useEffect, useState } from 'react';
import { LogEntry, PredictionResult } from '../types';
import { getPrediction } from '../services/geminiService';
import { BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PredictionPanelProps {
  logs: LogEntry[];
  onRiskAlert?: (level: string) => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ logs, onRiskAlert }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    if (logs.length === 0) return;
    setLoading(true);
    try {
      const result = await getPrediction(logs);
      setPrediction(result);
      
      // Notify parent/dashboard if risk is Critical
      if ((result.riskLevel === 'Critical' || result.riskLevel === 'High') && onRiskAlert) {
          onRiskAlert(result.riskLevel);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (logs.length > 0 && (!prediction || logs.length % 3 === 0)) {
        fetchPrediction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs.length]);

  if (logs.length < 3) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center min-h-[160px]">
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-full mb-3">
             <BrainCircuit size={24} className="text-slate-300 dark:text-slate-500" />
        </div>
        <h3 className="text-slate-700 dark:text-slate-200 font-bold text-sm">AI Learning in Progress</h3>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-[200px]">Log at least 3 activities to activate prediction.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-lg shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-700 relative overflow-hidden transition-colors">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                 <BrainCircuit size={16} className="text-rose-500" />
            </div>
            <div>
                 <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">Meltdown Risk</h3>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Real-time analysis</p>
            </div>
        </div>
        <button 
            onClick={fetchPrediction} 
            disabled={loading}
            className={`p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 transition-all ${loading ? 'animate-spin' : ''}`}
        >
            <RefreshCw size={16} />
        </button>
      </div>

      {loading && !prediction ? (
        <div className="h-40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-xs font-medium text-slate-400">Analyzing patterns...</span>
            </div>
        </div>
      ) : prediction ? (
        <div className="relative z-10">
            {/* Meter */}
            <div className="mb-5 text-center">
                <div className="inline-block mb-2">
                    <span className={`text-4xl font-extrabold tracking-tight ${
                        prediction.riskLevel === 'Critical' ? 'text-red-600 dark:text-red-400' :
                        prediction.riskLevel === 'High' ? 'text-orange-500' :
                        prediction.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>{prediction.riskScore}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                     {/* Background gradients/stops */}
                     <div className="absolute inset-0 w-full h-full opacity-30 flex">
                        <div className="w-1/4 h-full bg-emerald-500"></div>
                        <div className="w-1/4 h-full bg-yellow-400"></div>
                        <div className="w-1/4 h-full bg-orange-500"></div>
                        <div className="w-1/4 h-full bg-red-500"></div>
                     </div>
                    <div 
                        className={`h-full absolute top-0 left-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                            prediction.riskScore > 75 ? 'bg-red-500' : 
                            prediction.riskScore > 50 ? 'bg-orange-500' : 
                            prediction.riskScore > 25 ? 'bg-yellow-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${prediction.riskScore}%`, borderRadius: '99px' }}
                    />
                </div>
                <div className="flex justify-between mt-1.5 px-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Low</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">High</span>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 mb-4 border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    <span className="text-rose-500 mr-1">●</span>
                    {prediction.explanation}
                </p>
            </div>

            <div className="space-y-2">
                {prediction.recommendations.slice(0, 2).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 p-2 rounded-lg border border-slate-50 dark:border-slate-600 shadow-sm">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                    </div>
                ))}
            </div>
        </div>
      ) : null}
    </div>
  );
};