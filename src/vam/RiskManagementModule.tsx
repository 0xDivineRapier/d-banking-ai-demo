
import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from './i18n';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Layers, 
  Fingerprint, 
  Scan, 
  Globe, 
  Server,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Lock,
  Eye,
  Radar
} from 'lucide-react';

// --- Mock Data for Sentinel Shield ---

const RISK_ALERTS = [
  { id: 'AL-001', entity: 'Unknown Device', location: 'Jakarta, ID', score: 85, level: 'CRITICAL', type: 'Velocity Attack', timestamp: '2:14 PM' },
  { id: 'AL-002', entity: 'VA 88041002', location: 'Singapore, SG', score: 62, level: 'HIGH', type: 'Pattern Mismatch', timestamp: '1:45 PM' },
  { id: 'AL-003', entity: 'API Gateway #4', location: 'H2H Rail', score: 45, level: 'MEDIUM', type: 'Signature Drift', timestamp: '12:30 PM' },
];

const SECURITY_LAYERS = [
  { id: 'ACCOUNT', name: 'Account Check', status: 'PROTECTED', detail: 'Cross-product behavior verified' },
  { id: 'DEVICE', name: 'Device Fingerprint', status: 'PROTECTED', detail: 'SentinelGuard Hardware ID Active' },
  { id: 'BEHAVIOR', name: 'User Interaction', status: 'MONITORING', detail: 'Real-time gesture analysis' },
  { id: 'STRATEGY', name: 'Risk Strategy', status: 'PROTECTED', detail: '850+ active fraud rules' },
  { id: 'MANUAL', name: 'Expert Review', status: 'PENDING', detail: '2 anomalies flagged for Ops' },
];

// --- Sub-Components ---

const RainScoreEngine = () => {
  const [score, setScore] = useState(12);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(5, Math.min(25, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-tour="rain-score" className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-[1.01]">
       <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] group-hover:bg-orange-500/20 transition-all rounded-full"></div>
       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6">

             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                   <Zap size={20} className="text-white" />
                </div>
                <div>
                   <h3 className="text-xl font-black uppercase tracking-[0.2em] italic">SENTINEL GUARD</h3>
                   <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">RAIN Score Engine XYZ_V4</p>
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-5xl font-black tracking-tighter">Current Risk: {score}</p>
                <div className="flex items-center gap-3">
                   <div className="h-1.5 flex-1 bg-card/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-orange-500 transition-all duration-1000" 
                        style={{ width: `${(score / 40) * 100}%` }}
                      ></div>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Stable Pool</span>
                </div>
             </div>
             <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                SentinelGuard is calculating real-time risk scores across 1.8 billion Alipay+ network nodes. Currently processing 24,500 TPS with 95% precision.
             </p>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="text-center group/item">
                <p className="text-3xl font-black text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">0.1ms</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Decision Latency</p>
             </div>
             <div className="w-px h-12 bg-card/10"></div>
             <div className="text-center group/item">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">AI Uptime</p>
             </div>
          </div>
       </div>
    </div>
  );
};

const FiveLayerSecurity = () => {
  return (
    <div data-tour="security-layers" className="grid grid-cols-1 md:grid-cols-5 gap-4">
       {SECURITY_LAYERS.map((layer, i) => (

         <div key={layer.id} className="bg-card dark:bg-slate-900/60 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all hover:scale-105 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${
              layer.status === 'PROTECTED' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 
              layer.status === 'MONITORING' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
            }`}>
               {layer.id === 'ACCOUNT' && <Fingerprint size={20} />}
               {layer.id === 'DEVICE' && <Server size={20} />}
               {layer.id === 'BEHAVIOR' && <Activity size={20} />}
               {layer.id === 'STRATEGY' && <Layers size={20} />}
               {layer.id === 'MANUAL' && <Eye size={20} />}
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{layer.name}</p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1">{layer.status}</p>
            <p className="text-[9px] text-slate-500 dark:text-slate-500 mt-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">{layer.detail}</p>
         </div>
       ))}
    </div>
  );
};

// --- Main Module ---

export default function RiskManagementModule() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SENTINEL' | 'GRAPH'>('OVERVIEW');

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                <Radar size={12} className="animate-pulse" /> SENTINEL SHIELD ACTIVE
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Security / Fraud Protection</div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-300 dark:to-slate-200 bg-clip-text text-transparent tracking-tighter leading-tight">Risk Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">Powered by Dozn Global's SHIELD 3-in-1 Risk Model. Real-time protection for every digital touchpoint.</p>
        </div>
        
        <div className="flex bg-card/50 dark:bg-slate-900/40 p-1.5 rounded-[32px] border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-xl shrink-0">
           {[
             { id: 'OVERVIEW', label: 'Shield Hub', icon: ShieldCheck },
             { id: 'SENTINEL', label: 'Threat Sentinel', icon: ShieldAlert },
             { id: 'GRAPH', label: 'Relation Graph', icon: BrainCircuit },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-8 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/20' : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
             >
               <tab.icon size={16} /> {tab.label}
             </button>
           ))}
        </div>
      </div>

      <RainScoreEngine />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Main Content Area */}
         <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
               <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Multilayered Security Verification</h3>
               <p className="text-slate-400 dark:text-slate-500 font-medium">Sentinel Guard active across 5 layers of transaction authentication</p>
            </div>
            
            <FiveLayerSecurity />

            <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-slate-200/60 dark:border-slate-800/80 shadow-sm overflow-hidden p-10 space-y-8 transition-all">
               <div className="flex items-center justify-between">
                  <div>
                     <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Real-Time Pattern Analysis</h4>
                     <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Global Sentinel Intelligence</p>
                  </div>
                  <button className="px-6 py-2 bg-slate-900 dark:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                     <TrendingUp size={14} /> Full Insight
                  </button>
               </div>
               
               <div className="h-[240px] flex items-end gap-2 px-2">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-orange-500/20 dark:bg-orange-500/10 hover:bg-orange-500 transition-all rounded-t-sm flex-1 group relative"
                      style={{ height: `${20 + Math.random() * 80}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all">
                          {Math.floor(Math.random() * 1000)}ms
                       </div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <span>T-240s</span>
                  <span>T-120s</span>
                  <span>Current Unit Execution (ms)</span>
               </div>
            </div>
         </div>

         {/* Side Sentinel Area */}
         <div className="lg:col-span-4 space-y-10">
            <div data-tour="sentinel-alerts" className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-[40px] p-8 space-y-8 flex flex-col h-full">
               <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                     <ShieldAlert size={20} />
                  </div>
                  <h4 className="text-md font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest italic font-mono">Sentinel Alerts</h4>
               </div>
               
               <div className="space-y-4 flex-1">
                  {RISK_ALERTS.map(alert => (
                    <div key={alert.id} className="bg-card/70 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-3 group hover:border-red-500/50 transition-all">
                       <div className="flex justify-between items-start">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                            alert.level === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
                          }`}>
                            {alert.level}
                          </span>
                          <span className="text-[10px] font-black text-slate-300 dark:text-slate-600">{alert.timestamp}</span>
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-800 dark:text-slate-100">{alert.type}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Target: {alert.entity} • {alert.location}</p>
                       </div>
                       <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-red-500">Score {alert.score}</span>
                          </div>
                          <button className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">Investigate</button>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="bg-slate-900 p-6 rounded-[28px] text-white space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-orange-400">
                     <Lock size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">SentinelGuard Integrity</span>
                  </div>
                  <p className="text-[11px] font-bold leading-relaxed opacity-80">
                     Enhanced security mode active. All cross-border settlements are being verified via the global reputation graph.
                  </p>
                  <button className="w-full py-2.5 bg-card/10 hover:bg-card/20 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all">
                     View Security Ledger
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
