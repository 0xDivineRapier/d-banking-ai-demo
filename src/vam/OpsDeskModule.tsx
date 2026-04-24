
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  ShieldX,
  X,
  Check,
  Building,
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
import { useChartTheme } from '@/hooks/useChartTheme';
import { LogMonitorAgent, LogEntry, AgentDiagnosis } from './LogMonitorAgent';
import { ReportingAgent, ReportResult } from './ReportingAgent';
import { SimulationEngine } from './SimulationEngine';
import { LimitAgent, LimitPrediction, VolumeStat } from './LimitAgent';

// --- Corporate Client Data ---
const CORPORATE_CLIENTS = [
  { name: 'PT. Hasjrat Abadi', code: 'HSJ', connection: 'H2H-SOCKET', vol24h: 14820, txMonth: 128450, fee: 385350000, cashback: 19267500, status: 'ACTIVE' },
  { name: 'Xendit Group', code: 'XND', connection: 'REST-API', vol24h: 9240, txMonth: 89210, fee: 267630000, cashback: 13381500, status: 'ACTIVE' },
  { name: 'PT. Flip Indonesia', code: 'FLP', connection: 'REST-API', vol24h: 7650, txMonth: 72340, fee: 217020000, cashback: 10851000, status: 'ACTIVE' },
  { name: 'Modalku Financial', code: 'MDK', connection: 'H2H-SOCKET', vol24h: 6890, txMonth: 61200, fee: 183600000, cashback: 9180000, status: 'ACTIVE' },
  { name: 'PT. Dana Indonesia', code: 'DNA', connection: 'REST-API', vol24h: 5430, txMonth: 52180, fee: 156540000, cashback: 7827000, status: 'ACTIVE' },
  { name: 'OVO (Visionet)', code: 'OVO', connection: 'REST-API', vol24h: 4980, txMonth: 48920, fee: 146760000, cashback: 7338000, status: 'ACTIVE' },
  { name: 'GoPay (Tokopedia)', code: 'GPY', connection: 'H2H-SOCKET', vol24h: 4210, txMonth: 41500, fee: 124500000, cashback: 6225000, status: 'ACTIVE' },
  { name: 'ShopeePay Digital', code: 'SPD', connection: 'REST-API', vol24h: 3890, txMonth: 38900, fee: 116700000, cashback: 5835000, status: 'ACTIVE' },
  { name: 'PT. Akulaku Silvrr', code: 'AKU', connection: 'REST-API', vol24h: 3450, txMonth: 34500, fee: 103500000, cashback: 5175000, status: 'ACTIVE' },
  { name: 'LinkAja (Fintek)', code: 'LKA', connection: 'H2H-SOCKET', vol24h: 2980, txMonth: 28400, fee: 85200000, cashback: 4260000, status: 'ACTIVE' },
  { name: 'Kredivo Group', code: 'KRD', connection: 'REST-API', vol24h: 2750, txMonth: 26100, fee: 78300000, cashback: 3915000, status: 'ACTIVE' },
  { name: 'PT. Bukalapak', code: 'BKL', connection: 'REST-API', vol24h: 2340, txMonth: 22800, fee: 68400000, cashback: 3420000, status: 'ACTIVE' },
  { name: 'Blibli (Global Digital)', code: 'BLB', connection: 'H2H-SOCKET', vol24h: 2100, txMonth: 19500, fee: 58500000, cashback: 2925000, status: 'ACTIVE' },
  { name: 'PT. Traveloka', code: 'TVK', connection: 'REST-API', vol24h: 1890, txMonth: 17800, fee: 53400000, cashback: 2670000, status: 'ACTIVE' },
  { name: 'Astra Financial', code: 'ASF', connection: 'H2H-SOCKET', vol24h: 1650, txMonth: 15200, fee: 45600000, cashback: 2280000, status: 'ACTIVE' },
  { name: 'PT. Pegadaian', code: 'PGD', connection: 'REST-API', vol24h: 1420, txMonth: 13100, fee: 39300000, cashback: 1965000, status: 'ACTIVE' },
  { name: 'Mandiri Sekuritas', code: 'MDS', connection: 'H2H-SOCKET', vol24h: 1280, txMonth: 11800, fee: 35400000, cashback: 1770000, status: 'ACTIVE' },
  { name: 'PT. Indosat Ooredoo', code: 'IDS', connection: 'REST-API', vol24h: 1100, txMonth: 10200, fee: 30600000, cashback: 1530000, status: 'ACTIVE' },
  { name: 'Telkomsel (T-Money)', code: 'TKS', connection: 'H2H-SOCKET', vol24h: 980, txMonth: 9400, fee: 28200000, cashback: 1410000, status: 'ACTIVE' },
  { name: 'PT. Prudential Life', code: 'PRU', connection: 'REST-API', vol24h: 870, txMonth: 8200, fee: 24600000, cashback: 1230000, status: 'ACTIVE' },
];

export default function OpsDeskModule() {
  const { t, language } = useI18n();
  const { gridColor, tooltipStyle } = useChartTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnosis, setDiagnosis] = useState<AgentDiagnosis | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [openIssues, setOpenIssues] = useState([
    { id: 'ISS-102', title: 'Latency spike in JKT-02', status: 'IN_PROGRESS', progress: 65 },
    { id: 'ISS-105', title: 'Xendit fee reconciliation mismatch', status: 'OPEN', progress: 10 },
    { id: 'ISS-108', title: 'Credential rotation failed for PT. Flip', status: 'IN_PROGRESS', progress: 40 },
  ]);

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

  // Much faster diagnostic interval - 3s instead of 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      const newLogs = await engine.current.generateSystemLogs(1, Math.random() > 0.92);
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
    }, 3000);
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

  const handleSupportSearch = useCallback(async (queryOverride?: string) => {
    const query = queryOverride ?? supportQuery;
    if (!query) return;
    if (queryOverride) setSupportQuery(queryOverride);
    setIsQuerying(true);
    setQuotaExceeded(false);
    try {
      const res = await reportAgent.current.queryInsights(query, language as 'en' | 'ko');
      setSupportResult(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('429')) setQuotaExceeded(true);
    } finally {
      setIsQuerying(false);
    }
  }, [supportQuery, language]);

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

  const filteredClients = useMemo(() => {
    if (!clientSearch) return CORPORATE_CLIENTS;
    return CORPORATE_CLIENTS.filter(c => 
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
      c.code.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {quotaExceeded && (
        <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-500">
           <div className="flex items-center gap-3">
              <ShieldX size={20} />
              <div className="text-xs font-bold">
               <p className="uppercase tracking-widest font-black">{t('ops.quota_exceeded')}</p>
                  <p className="opacity-80">{t('ops.quota_fallback')}</p>
              </div>
           </div>
           <button onClick={() => setQuotaExceeded(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{t('ops.title')}</h2>
           <p className="text-slate-500 dark:text-slate-400 font-medium">{t('ops.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">{t('ops.gateway_healthy')}</span>
           </div>
           {/* Notification Bell */}
           <div className="relative">
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className="relative w-10 h-10 flex items-center justify-center bg-card dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
             >
               <Bell size={18} className="text-slate-600 dark:text-slate-400" />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                   {unreadCount}
                 </span>
               )}
             </button>
             {showNotifications && (
               <div className="absolute right-0 top-12 w-96 bg-card dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                 <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{t('ops.notifications')}</h4>
                    <button onClick={markAllRead} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">{t('ops.mark_all_read')}</button>
                 </div>
                 <div className="max-h-80 overflow-y-auto">
                   {notifications.map(n => (
                     <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800/50 flex items-start gap-3 ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                       <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                       <div>
                         <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{n.text}</p>
                         <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg">
              <Network size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">DOZN-H2H-CENTRAL</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t('ops.predictive_monitor')}</h3>
              </div>
              {prediction?.projected_breach_time && !limitOverrideApplied && (
                <div className="text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-2 bg-red-50 text-red-600">
                   <AlertTriangle size={12} /> {t('ops.limit_breach')}: {prediction.projected_breach_time} WIB
                </div>
              )}
              {limitOverrideApplied && (
                <div className="text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                   <CheckCircle2 size={12} /> {t('ops.override_active')}
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ ...tooltipStyle, fontSize: '10px' }} />
                  <Area type="monotone" dataKey="volume" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVol)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('ops.ai_recommendation')}</p>
                   <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{prediction?.recommendation || t('ops.analyzing')}</p>
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
                     <span className="flex items-center gap-2"><Check size={14} /> {t('ops.override_applied')}</span>
                   ) : t('ops.apply_limit')}
               </button>
            </div>
          </div>

          {/* Corporate Clients Table */}
          <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building size={20} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t('ops.corporate_clients')}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{filteredClients.length} {t('onb.corporate_clients')}</p>
                </div>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder={t('onb.search')}
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-left sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('ops.client_name')}</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('ops.connection')}</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('ops.vol_24h')}</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('ops.total_tx_month')}</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('ops.fee')}</th>
                    <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('ops.cashback')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {filteredClients.map((client, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 text-[10px] font-black">{client.code.slice(0, 2)}</div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-slate-200 text-xs">{client.name}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{client.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${client.connection.includes('SOCKET') ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>{client.connection}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-800 dark:text-slate-200 text-xs">{client.vol24h.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-black text-slate-800 dark:text-slate-200 text-xs">{client.txMonth.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-400">{(client.fee / 1000000).toFixed(0)}M</td>
                      <td className="px-6 py-4 text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">{(client.cashback / 1000000).toFixed(1)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#020617] rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[400px]">
             <div className="p-6 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-blue-400">
                   <Terminal size={18} />
                   <h3 className="text-[11px] font-black uppercase tracking-widest font-mono">{t('ops.diagnostic_feed')}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-mono text-emerald-500 uppercase">{t('ops.live_trace')}</span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-3 custom-scrollbar">
                {diagnosis && (
                  <div className={`p-6 rounded-3xl border mb-6 animate-in slide-in-from-top duration-500 ${
                    diagnosis.diagnosis.classification === 'Systemic' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 font-black uppercase text-xs">
                       <ShieldAlert size={14} /> {t('ops.ai_analysis')}: {diagnosis.diagnosis.classification} {t('ops.issue_detected')}
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed font-bold">{t('ops.root_cause')}: {diagnosis.diagnosis.root_cause_hypothesis}</p>
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
          <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[520px]">
             <div className="flex items-center gap-3 mb-6">
                <MessageSquare size={24} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{t('ops.customer_support_copilot')}</h3>
             </div>
             <div className="relative mb-3">
                <input 
                   type="text" 
                   value={supportQuery}
                   onChange={(e) => setSupportQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSupportSearch()}
                   placeholder="Ask for an analysis or reconciliation..."
                   className="w-full pl-6 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                />
                <button onClick={handleSupportSearch} className="absolute right-3 top-3 p-1.5 bg-slate-900 text-white rounded-lg">
                   {isQuerying ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
                </button>
             </div>
             
             {/* Suggested Queries */}
             <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleSupportSearch("Reconcile pending TXs for Xendit")}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors rounded-lg text-[10px] font-bold border border-blue-100 dark:border-blue-800"
                >
                  ✨ Reconcile pending TXs for Xendit
                </button>
                <button
                  onClick={() => handleSupportSearch("Analyze fee leakage across H2H rails")}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors rounded-lg text-[10px] font-bold border border-emerald-100 dark:border-emerald-800"
                >
                  ✨ Analyze fee leakage across H2H rails
                </button>
                <button
                  onClick={() => handleSupportSearch("Audit security limits for Flip")}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors rounded-lg text-[10px] font-bold border border-indigo-100 dark:border-indigo-800"
                >
                  ✨ Audit security limits for Flip
                </button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {supportResult ? (
                   <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                         <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 italic">"{supportResult.explanation}"</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-xl">
                         <pre className="text-[9px] font-mono text-emerald-400 whitespace-pre-wrap">{supportResult.sql}</pre>
                      </div>
                      <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                         <table className="w-full text-[9px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                               <tr>{Object.keys(supportResult.data[0] || {}).map(k => <th key={k} className="px-3 py-2 text-left text-slate-400 dark:text-slate-500 font-black">{k}</th>)}</tr>
                            </thead>
                            <tbody>
                               {supportResult.data.map((row, i) => (
                                  <tr key={i} className="border-t border-slate-50 dark:border-slate-800">
                                     {Object.values(row).map((v: any, j) => <td key={j} className="px-3 py-2 text-slate-600 dark:text-slate-300 font-bold">{v}</td>)}
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                    ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 text-center dark:text-slate-100">
                      <Ghost size={48} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">{t('ops.awaiting_command')}<br/>{t('ops.translate_nlp')}</p>
                   </div>
                )}
             </div>
          </div>

          {/* Issue Tracker */}
          <div className="bg-card dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 mt-8">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-amber-500" />
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t('ops.issue_tracker')}</h3>
            </div>
            <div className="space-y-4">
              {openIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-slate-400">{issue.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                      issue.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">{issue.title}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span>{t('ops.progress')}</span>
                      <span>{issue.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${issue.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
