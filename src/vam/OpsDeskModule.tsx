
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n } from './i18n';
import { 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  Search, 
  MessageSquare, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Terminal,
  Network,
  Bell,
  CheckCircle2,
  Ghost,
  ArrowUpRight,
  ShieldX,
  X,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { LogMonitorAgent, LogEntry, AgentDiagnosis } from './LogMonitorAgent';
import { ReportingAgent, ReportResult } from './ReportingAgent';
import { SimulationEngine } from './SimulationEngine';
import { LimitAgent, LimitPrediction, VolumeStat } from './LimitAgent';

export default function OpsDeskModule() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnosis, setDiagnosis] = useState<AgentDiagnosis | null>(null);
  const [supportQuery, setSupportQuery] = useState('');
  const [supportResult, setSupportResult] = useState<ReportResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [prediction, setPrediction] = useState<LimitPrediction | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [limitOverrideApplied, setLimitOverrideApplied] = useState(false);
  const [notifications, setNotifications] = useState<{id: string; text: string; time: string; read: boolean}[]>([
    { id: '1', text: 'SNAP Gateway latency spike detected on JKT-02', time: '2 min ago', read: false },
    { id: '2', text: 'Fintech Rail limit reaching 78% utilization', time: '5 min ago', read: false },
    { id: '3', text: 'Scheduled maintenance: BI-FAST node at 02:00 WIB', time: '15 min ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const monitorAgent = useRef(new LogMonitorAgent());
  const reportAgent = useRef(new ReportingAgent());
  const limitAgent = useRef(new LimitAgent());
  const engine = useRef(new SimulationEngine());

  useEffect(() => {
    const interval = setInterval(async () => {
      const newLogs = await engine.current.generateSystemLogs(1, Math.random() > 0.95);
      setLogs(prev => [...prev.slice(-14), ...newLogs]);
      if (newLogs[0].severity === 'CRITICAL') {
        try {
          const diag = await monitorAgent.current.analyzeLogs(newLogs);
          if (diag.diagnosis.classification === 'API_OVERLOAD') {
            setQuotaExceeded(true);
          } else {
            setQuotaExceeded(false);
            setDiagnosis(diag);
            setNotifications(prev => [{ id: Date.now().toString(), text: `CRITICAL: ${diag.diagnosis.root_cause_hypothesis}`, time: 'Just now', read: false }, ...prev]);
          }
        } catch (err) {
          console.error("Diagnosis error", err);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const volumeData = useMemo<VolumeStat[]>(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      volume: 10 + Math.random() * 60,
    }));
  }, []);

  useEffect(() => {
    const runPrediction = async () => {
      const res = await limitAgent.current.predictBreach(volumeData, 100);
      if (res.risk_level === 'OVERLOAD') setQuotaExceeded(true);
      setPrediction(res);
    };
    runPrediction();
  }, [volumeData]);

  const handleSupportSearch = async () => {
    if (!supportQuery) return;
    setIsQuerying(true);
    setQuotaExceeded(false);
    try {
      const res = await reportAgent.current.queryInsights(supportQuery);
      setSupportResult(res);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('429')) setQuotaExceeded(true);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleApplyLimitOverride = () => {
    setLimitOverrideApplied(true);
    setNotifications(prev => [{ id: Date.now().toString(), text: 'Limit Override applied: +15B IDR for Fintech-Rail-01', time: 'Just now', read: false }, ...prev]);
    setTimeout(() => {
      setPrediction(prev => prev ? { ...prev, risk_level: 'LOW', recommendation: 'Override applied. Rails stable with additional 15B IDR headroom.', projected_breach_time: null } : prev);
    }, 500);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {quotaExceeded && (
        <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-500">
           <div className="flex items-center gap-3">
              <ShieldX size={20} />
              <div className="text-xs font-bold">
                 <p className="uppercase tracking-widest font-black">AI Service Quota Exceeded</p>
                 <p className="opacity-80">Real-time proactive diagnostics are temporarily running in fallback mode.</p>
              </div>
           </div>
           <button onClick={() => setQuotaExceeded(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Operations Desk</h2>
           <p className="text-slate-500 font-medium">Bank XYZ Sentinel AI • Proactive Monitoring & Troubleshooting</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Gateway Healthy</span>
           </div>
           {/* Notification Bell */}
           <div className="relative">
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className="relative w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
             >
               <Bell size={18} className="text-slate-600" />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                   {unreadCount}
                 </span>
               )}
             </button>
             {showNotifications && (
               <div className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                 <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                   <h4 className="text-sm font-black text-slate-800">Notifications</h4>
                   <button onClick={markAllRead} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Mark All Read</button>
                 </div>
                 <div className="max-h-80 overflow-y-auto">
                   {notifications.map(n => (
                     <div key={n.id} className={`p-4 border-b border-slate-50 flex items-start gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                       <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                       <div>
                         <p className="text-xs font-bold text-slate-700">{n.text}</p>
                         <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg">
              <Network size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">XYZ-H2H-CENTRAL</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <TrendingUp size={20} className="text-blue-600" />
                 <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Predictive Capacity Monitor</h3>
              </div>
              {prediction?.projected_breach_time && !limitOverrideApplied && (
                <div className="text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-2 bg-red-50 text-red-600">
                   <AlertTriangle size={12} /> Limit Breach Projected: {prediction.projected_breach_time} WIB
                </div>
              )}
              {limitOverrideApplied && (
                <div className="text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-2 bg-emerald-50 text-emerald-600">
                   <CheckCircle2 size={12} /> Override Active
                </div>
              )}
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="volume" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVol)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Recommendation</p>
                  <p className="text-xs font-bold text-slate-700">{prediction?.recommendation || "Analyzing traffic patterns..."}</p>
               </div>
               <button 
                 onClick={handleApplyLimitOverride}
                 disabled={limitOverrideApplied}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   limitOverrideApplied 
                     ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                     : 'bg-slate-900 text-white hover:bg-slate-800'
                 }`}
               >
                  {limitOverrideApplied ? (
                    <span className="flex items-center gap-2"><Check size={14} /> Override Applied</span>
                  ) : 'Apply Limit Override'}
               </button>
            </div>
          </div>

          <div className="bg-[#020617] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[400px]">
             <div className="p-6 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-blue-400">
                   <Terminal size={18} />
                   <h3 className="text-[11px] font-black uppercase tracking-widest font-mono">Bank XYZ Sentinel AI Diagnostic Feed</h3>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-mono text-emerald-500 uppercase">Live Trace</span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-3 custom-scrollbar">
                {diagnosis && (
                  <div className={`p-6 rounded-3xl border mb-6 animate-in slide-in-from-top duration-500 ${
                    diagnosis.diagnosis.classification === 'Systemic' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 font-black uppercase text-xs">
                       <ShieldAlert size={14} /> AI Analysis: {diagnosis.diagnosis.classification} Issue Detected
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed font-bold">Root Cause Hypothesis: {diagnosis.diagnosis.root_cause_hypothesis}</p>
                  </div>
                )}
                {logs.map((log, i) => (
                   <div key={i} className={`flex gap-4 py-1 border-l-2 pl-4 ${
                     log.severity === 'CRITICAL' ? 'border-red-500 text-red-400' : 'border-blue-500/20 text-slate-500'
                   }`}>
                      <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="font-black w-20 shrink-0">{log.service_module}</span>
                      <span className="flex-1 truncate">{log.raw_payload}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col h-[520px]">
             <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={24} className="text-blue-600" />
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Support Copilot</h3>
             </div>
             <div className="relative mb-6">
                <input 
                   type="text" 
                   value={supportQuery}
                   onChange={(e) => setSupportQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSupportSearch()}
                   placeholder="e.g. 'Show failed tx for Hasjrat last hour'"
                   className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                />
                <button onClick={handleSupportSearch} className="absolute right-3 top-3 p-1.5 bg-slate-900 text-white rounded-lg">
                   {isQuerying ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
                </button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {supportResult ? (
                   <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                         <p className="text-[10px] font-bold text-slate-600 italic">"{supportResult.explanation}"</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-xl">
                         <pre className="text-[9px] font-mono text-emerald-400 whitespace-pre-wrap">{supportResult.sql}</pre>
                      </div>
                      <div className="border border-slate-100 rounded-2xl overflow-hidden">
                         <table className="w-full text-[9px]">
                            <thead className="bg-slate-50">
                               <tr>{Object.keys(supportResult.data[0] || {}).map(k => <th key={k} className="px-3 py-2 text-left text-slate-400 font-black">{k}</th>)}</tr>
                            </thead>
                            <tbody>
                               {supportResult.data.map((row, i) => (
                                  <tr key={i} className="border-t border-slate-50">
                                     {Object.values(row).map((v: any, j) => <td key={j} className="px-3 py-2 text-slate-600 font-bold">{v}</td>)}
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                      <Ghost size={48} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Command...<br/>Translate natural language to SQL instantly.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
