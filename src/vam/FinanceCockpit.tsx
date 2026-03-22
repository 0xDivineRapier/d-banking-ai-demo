
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useI18n } from './i18n';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, 
  TrendingDown, 
  ArrowRightLeft, 
  Info,
  ChevronRight, 
  Zap, 
  Command as CommandIcon,
  Fingerprint,
  Loader2,
  CheckCircle2, 
  ShieldCheck,
  Send,
  X,
  FileSearch,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  History,
  TrendingUp,
  CreditCard,
  Sparkles,
  BrainCircuit,
  MessageSquare,
  Bot,
  // Added missing MoreVertical icon import
  MoreVertical
} from 'lucide-react';
import { CommandAgent, ActionResponse } from './CommandAgent';
import { ReconciliationAgent, ReconciliationResult, BankTransaction, ERPInvoice, FeeAuditResult, SuspenseItem, SuspenseResolution } from './ReconciliationAgent';
import { FinanceAssistantAgent, AssistantResponse } from './FinanceAssistantAgent';

// --- Shared Data Models ---

interface HeatmapCell {
  x: string;
  y: string;
  balance: number;
  projected_outflow: number;
  inflows: number;
  lsi_score: number;
  alert?: string;
}

interface HeatmapData {
  dimensions: {
    x_axis: string[];
    y_axis: string[];
  };
  cells: HeatmapCell[];
}

const generateHeatmapData = (): HeatmapData => {
  const accounts = [
    'Bank XYZ Operating Pool (BI)',
    'SNAP Settlement Buffer',
    'Fintech Escrow Pool (H2H)',
    'BI-RTGS Reserve Account',
    'OJK Mandatory Reserve',
    'Bank XYZ-Interbank Clearing'
  ];
  
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const cells: HeatmapCell[] = [];
  
  accounts.forEach(acc => {
    dates.forEach((date, i) => {
      const baseBalance = 5000000000 + Math.random() * 10000000000;
      const inflow = i === 0 ? 0 : Math.random() * 2000000000;
      const isCriticalDay = (acc.includes('Settlement') && i === 3) || (acc.includes('Reserve') && i === 5);
      const outflow = isCriticalDay 
        ? baseBalance * 1.1 
        : baseBalance * (0.2 + Math.random() * 0.7);
      
      const lsi = outflow / (baseBalance + inflow);
      
      cells.push({
        x: date,
        y: acc,
        balance: baseBalance,
        projected_outflow: outflow,
        inflows: inflow,
        lsi_score: lsi,
        alert: lsi >= 1.0 ? "Settlement Shortfall detected" : lsi >= 0.8 ? "High Utilization" : undefined
      });
    });
  });

  return {
    dimensions: { x_axis: dates, y_axis: accounts },
    cells
  };
};

const LiquidityHeatmap = ({ data }: { data: HeatmapData }) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const getCellColor = (lsiScore: number) => {
    if (lsiScore >= 1.0) return 'bg-red-500 hover:bg-red-600 border-red-700 shadow-lg shadow-red-200';
    if (lsiScore >= 0.8) return 'bg-yellow-400 hover:bg-yellow-500 border-yellow-600 shadow-md shadow-yellow-100';
    return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 shadow-sm shadow-emerald-50';
  };

  return (
    <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl relative overflow-visible h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Bank XYZ Liquidity Stress Forecast</h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Bank-Wide Treasury Health • Unit: IDR (Billions)</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Normal</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Caution</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical Settlement</span>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-3">
        <div className="col-span-1 text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-end pb-2">Bank XYZ Account Pool</div>
        {data.dimensions.x_axis.map((date, index) => {
          const d = new Date(date);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = index === 0;
          return (
            <div key={index} className={`text-center flex flex-col items-center gap-1 ${isToday ? 'bg-blue-50 rounded-2xl p-2 border border-blue-100' : ''}`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{dayName}</span>
              <span className={`text-[10px] font-bold ${isToday ? 'text-blue-800' : 'text-slate-600'}`}>{d.getDate()}</span>
            </div>
          );
        })}

        {data.dimensions.y_axis.map((account) => (
          <React.Fragment key={account}>
            <div className="col-span-1 text-xs font-black text-slate-700 truncate pr-4 flex items-center border-r border-slate-50">
              {account}
            </div>
            {data.dimensions.x_axis.map((date) => {
              const cell = data.cells.find(c => c.x === date && c.y === account);
              if (!cell) return <div key={date} className="h-12 bg-slate-50 rounded-2xl" />;

              return (
                <div 
                  key={date}
                  onMouseEnter={(e) => {
                    setHoveredCell(cell);
                    setMousePos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`h-12 w-full rounded-2xl border transition-all duration-300 cursor-pointer transform hover:scale-105 hover:z-10 flex items-center justify-center group ${getCellColor(cell.lsi_score)}`}
                >
                  {cell.lsi_score >= 1.0 && <ShieldAlert size={14} className="text-white animate-pulse" />}
                  {cell.lsi_score >= 0.8 && cell.lsi_score < 1.0 && <Info size={14} className="text-yellow-900/40" />}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {hoveredCell && (
        <div 
          className="fixed z-[100] w-64 bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl pointer-events-none animate-in fade-in zoom-in duration-200 border border-white/10"
          style={{ 
            left: `${mousePos.x + 20}px`, 
            top: `${mousePos.y - 120}px` 
          }}
        >
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Bank XYZ Treasury View</p>
              <h5 className="text-xs font-bold mt-1">{hoveredCell.y}</h5>
              <p className="text-[10px] text-slate-400">{hoveredCell.x}</p>
            </div>
            
            <div className="space-y-2 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Balance</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{(hoveredCell.balance / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Proj. Inflow</span>
                <span className="text-xs font-mono font-bold text-blue-400">+{(hoveredCell.inflows / 1000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Settlement Out</span>
                <span className="text-xs font-mono font-bold text-red-400">-{(hoveredCell.projected_outflow / 1000000000).toFixed(1)}B</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-black uppercase tracking-widest">LSI Score</span>
                 <span className={`text-xs font-black ${hoveredCell.lsi_score >= 1.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                   {(hoveredCell.lsi_score * 100).toFixed(1)}%
                 </span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Smart Reconciliation Workspace ---

interface WorkspaceProps {
  results: ReconciliationResult[];
  feeAudits: FeeAuditResult[];
  suspenseResolutions: SuspenseResolution[];
  onExecuteAll: () => void;
  loading: boolean;
  onResolveSuspense: () => void;
}

const ReconciliationWorkspace = ({ results, feeAudits, suspenseResolutions, onExecuteAll, loading, onResolveSuspense }: WorkspaceProps) => {
  const totalLeakage = feeAudits.reduce((acc, curr) => curr.status === 'LEAKAGE' ? acc + curr.discrepancy : acc, 0);

  const mockBankTrx: BankTransaction[] = [
    { trx_id: 'XYZ-BT-001', amount: 4500000000, date: '2026-03-01', narrative: 'XENDIT SETTLEMENT RAILS', billed_fee: 2500 },
    { trx_id: 'XYZ-BT-002', amount: 1250000000, date: '2026-03-01', narrative: 'ABC MULTIFINANCE DISBURSE', billed_fee: 0 },
    { trx_id: 'XYZ-BT-003', amount: 8900000000, date: '2026-03-02', narrative: 'BI-FAST INBOUND XYZ CORE', billed_fee: 2500 },
    { trx_id: 'XYZ-BT-004', amount: 500000000, date: '2026-03-02', narrative: 'MODALKU P2P REPAYMENT', billed_fee: 1250000 },
    { trx_id: 'XYZ-BT-005', amount: 15000000, date: '2026-03-03', narrative: 'XYZ INTERNAL CLEARING', billed_fee: 0 }
  ];

  const mockSuspense: SuspenseItem[] = [
    { trx_id: 'SUS-001', sender_name: 'JOKUL PAYMENTS', amount: 15000000, timestamp: '2026-03-05T08:00:00Z' },
    { trx_id: 'SUS-002', sender_name: 'AS-SEDAYA-FIN', amount: 450000000, timestamp: '2026-03-05T09:15:00Z' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <FileSearch size={32} className="text-blue-600" />
             Reconciliation & Fee Audit
          </h2>
          <p className="text-slate-500 font-medium">Bank XYZ Operations Control Desk • Automated Rail Verification</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={onExecuteAll}
             disabled={loading}
             className="px-8 py-4 bg-slate-900 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center gap-3"
           >
             {loading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
             Execute Bank XYZ Tally Engine
           </button>
        </div>
      </div>

      {/* 2. Intelligence Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-4 group hover:border-blue-500 transition-all">
          <div className="flex justify-between items-start">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} />
             </div>
             <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reconciliation MCS</p>
             <p className="text-3xl font-black text-slate-800">98.4%</p>
             <p className="text-xs text-emerald-500 font-bold mt-1">▲ 0.8% from yesterday</p>
          </div>
        </div>

        <div className={`bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-4 group hover:border-red-500 transition-all ${totalLeakage > 0 ? 'border-red-200 bg-red-50/10' : ''}`}>
          <div className="flex justify-between items-start">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${totalLeakage > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <DollarSign size={24} />
             </div>
             <AlertTriangle size={20} className={totalLeakage > 0 ? 'text-red-500 animate-pulse' : 'text-slate-200'} />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Assurance</p>
             <p className={`text-3xl font-black ${totalLeakage > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {totalLeakage > 0 ? `Rp ${totalLeakage.toLocaleString()}` : 'Rp 0'}
             </p>
             <p className="text-xs text-slate-500 font-bold mt-1">
                {totalLeakage > 0 ? 'Potential Fee Leakage Detected' : 'All Fees Correctly Billed'}
             </p>
          </div>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-[40px] text-white space-y-4 group overflow-hidden relative">
           <History size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Unappropriated Funds</p>
              <p className="text-3xl font-black">{mockSuspense.length}</p>
              <p className="text-xs text-slate-400 font-bold mt-1">
                 {suspenseResolutions.length > 0 ? `${suspenseResolutions.length} AI Resolutions Ready` : 'Awaiting Clearing Cycle'}
              </p>
              <button onClick={onResolveSuspense} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                 Review Suspense
              </button>
           </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Reconciliation Table */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Daily Rail Matching</h3>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                   <button className="px-4 py-1.5 bg-white text-[10px] font-black text-blue-600 rounded-lg shadow-sm uppercase tracking-widest">Inbound</button>
                   <button className="px-4 py-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">Outbound</button>
                </div>
             </div>
             <table className="w-full text-[11px] font-medium">
                <thead>
                   <tr className="bg-slate-50 text-left">
                      <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest">Institution / Narrative</th>
                      <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest">Amount (IDR)</th>
                      <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest">MCS Score</th>
                      <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-right font-black text-slate-400 uppercase tracking-widest">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {results.map((res, i) => {
                      const trx = mockBankTrx.find(t => t.trx_id === res.bank_trx_id);
                      return (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="space-y-1">
                                 <p className="font-black text-slate-800">{trx?.narrative}</p>
                                 <p className="text-[10px] font-mono text-slate-400 uppercase">{res.bank_trx_id}</p>
                              </div>
                           </td>
                           <td className="px-8 py-6 font-black text-slate-800">
                              Rp {trx?.amount.toLocaleString()}
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${res.confidence_score > 0.9 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                      style={{ width: `${res.confidence_score * 100}%` }}
                                    />
                                 </div>
                                 <span className="font-black text-slate-400">{(res.confidence_score * 100).toFixed(0)}%</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                res.match_type === 'AUTO' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                 {res.match_type}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
                                 <ChevronRight size={18} className="text-slate-400" />
                              </button>
                           </td>
                        </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>

          {/* Suspense Resolver Section */}
          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#1e293b] text-white rounded-2xl flex items-center justify-center">
                      <Search size={24} />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">Suspense Resolver</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI-Assisted Beneficiary Mapping</p>
                   </div>
                </div>
                {suspenseResolutions.length > 0 && (
                  <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    Resolution Ready
                  </span>
                )}
             </div>

             <div className="space-y-4">
                {mockSuspense.map((item, i) => {
                   const resolution = suspenseResolutions.find(r => r.trx_id === item.trx_id);
                   return (
                     <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-6 flex-1">
                           <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-xl">?</div>
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Unidentified Sender</p>
                              <p className="text-lg font-black text-slate-800 tracking-tight">{item.sender_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[10px] font-mono font-bold text-blue-600">Rp {item.amount.toLocaleString()}</span>
                                 <span className="text-slate-300">•</span>
                                 <span className="text-[10px] text-slate-400 uppercase font-bold">{new Date(item.timestamp).toLocaleTimeString()}</span>
                              </div>
                           </div>
                        </div>

                        {resolution ? (
                           <div className="flex-1 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-right duration-500">
                              <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                              <div className="flex-1">
                                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={12} /> Suggested Target
                                 </p>
                                 <p className="text-md font-black text-slate-800">{resolution.suggested_beneficiary}</p>
                                 <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1">"{resolution.rationale}"</p>
                              </div>
                              <button className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100">
                                 Resolve Match
                              </button>
                           </div>
                        ) : (
                           <div className="flex items-center gap-3 opacity-20">
                              <Loader2 size={16} className="animate-spin" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Scanning Patterns...</span>
                           </div>
                        )}
                     </div>
                   );
                })}
             </div>
          </div>
        </div>

        {/* Right: Revenue Assurance Panel */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col h-full">
             <div className="flex items-center gap-3 mb-10">
                <DollarSign size={24} className="text-blue-600" />
                <h4 className="text-xl font-black text-slate-800 tracking-tight">Revenue Assurance Audit</h4>
             </div>

             {feeAudits.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                   <ShieldCheck size={48} className="text-slate-400" />
                   <p className="text-xs font-black uppercase tracking-widest">Awaiting Fee Engine Trace...</p>
                </div>
             ) : (
                <div className="flex-1 space-y-8 animate-in fade-in duration-500">
                   {feeAudits.map((audit, i) => (
                     <div key={i} className={`p-6 rounded-3xl border-l-4 space-y-4 transition-all hover:bg-slate-50 ${
                       audit.status === 'MATCH' ? 'bg-white border-l-emerald-500 border-slate-100' :
                       audit.status === 'LEAKAGE' ? 'bg-red-50/50 border-l-red-500 border-red-100' : 'bg-amber-50/50 border-l-amber-500 border-amber-100'
                     }`}>
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed via Bank XYZ Engine</p>
                              <p className="text-lg font-black text-slate-800">Rp {audit.billed_fee.toLocaleString()}</p>
                           </div>
                           <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                             audit.status === 'MATCH' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {audit.status}
                           </span>
                        </div>
                        
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                           <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-slate-400 uppercase">Neural Calculation</span>
                              <span className="text-slate-800">Rp {audit.calculated_fee.toLocaleString()}</span>
                           </div>
                           {audit.discrepancy !== 0 && (
                              <div className="flex justify-between items-center text-[10px] font-black">
                                 <span className="text-red-500 uppercase">Leakage Identified</span>
                                 <span className="text-red-600">Rp {audit.discrepancy.toLocaleString()}</span>
                              </div>
                           )}
                        </div>
                        
                        <p className="text-[10px] text-slate-500 font-medium italic">"{audit.reason}"</p>
                     </div>
                   ))}

                   <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
                      <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200">
                         <div className="flex items-center gap-3 mb-2">
                            <AlertCircle size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Action Required</span>
                         </div>
                         <p className="text-xs font-bold leading-relaxed">
                            Detected discrepancies in fee mapping for Modalku P2P rails. Recommend manual override of Rule Engine XYZ_V2.
                         </p>
                         <button className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                            Patch Fee Engine
                         </button>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Neural Finance Chatbot ---

const FinanceIntelligenceBot = ({ 
  onTriggerRecon, 
  onTriggerFeeAudit, 
  onTriggerSuspense 
}: { 
  onTriggerRecon: () => void; 
  onTriggerFeeAudit: () => void;
  onTriggerSuspense: () => void;
}) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string; action?: any }[]>([
    { role: 'bot', content: "Bank XYZ Intelligence initialized. I can execute reconciliation matching, detect fee leakage, or resolve unappropriated suspense funds. How can I help today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const assistant = useRef(new FinanceAssistantAgent());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const response = await assistant.current.processQuery(text);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: response.message, 
        action: response.action 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "I encountered an error querying the neural gateway. Retrying..." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: any) => {
    if (action.type === 'RECONCILE') onTriggerRecon();
    if (action.type === 'FEE_AUDIT') onTriggerFeeAudit();
    if (action.type === 'RESOLVE_SUSPENSE') onTriggerSuspense();
    
    setMessages(prev => [...prev, { role: 'bot', content: `Executing ${action.summary.toLowerCase()} now...` }]);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[40px] flex flex-col h-full overflow-hidden shadow-inner">
      <div className="p-6 border-b border-slate-100 bg-white/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e293b] text-blue-400 rounded-xl flex items-center justify-center">
               <Bot size={20} />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Finance Copilot</h4>
               <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Neural Layer Active</p>
            </div>
         </div>
         {/* Fixed missing MoreVertical name error by adding to lucide-react imports */}
         <button className="text-slate-400"><MoreVertical size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
         {messages.map((m, i) => (
           <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold leading-relaxed shadow-sm ${
                m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                 {m.content}
              </div>
              {m.action && m.action.type !== 'NONE' && (
                <div className="mt-3 p-4 bg-white border border-blue-100 rounded-2xl w-[85%] space-y-3 shadow-md animate-in slide-in-from-left duration-300">
                   <div className="flex items-center gap-2 text-blue-600">
                      <Zap size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Action Proposed</span>
                   </div>
                   <p className="text-[11px] font-black text-slate-800">{m.action.summary}</p>
                   <button 
                    onClick={() => handleAction(m.action)}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                   >
                      Confirm Action
                   </button>
                </div>
              )}
           </div>
         ))}
         {loading && (
           <div className="flex items-center gap-2 text-slate-400 animate-pulse">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Thinking...</span>
           </div>
         )}
         <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
         <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask for reconciliation or fee audit..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-blue-500 shadow-inner"
            />
            <button 
              onClick={() => handleSend(input)}
              className="absolute right-2 top-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg"
            >
               <Send size={16} />
            </button>
         </div>
         <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
            {[
              "Reconcile ABC Corp",
              "Audit Xendit Fees",
              "Resolve Suspense"
            ].map(p => (
              <button 
                key={p} 
                onClick={() => handleSend(p)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[9px] font-black text-slate-600 uppercase tracking-widest rounded-lg whitespace-nowrap transition-all"
              >
                {p}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- Main FinanceCockpit Wrapper ---

export default function FinanceCockpit() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'heatmap';
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  // Shared State for Workspace
  const [results, setResults] = useState<ReconciliationResult[]>([]);
  const [feeAudits, setFeeAudits] = useState<FeeAuditResult[]>([]);
  const [suspenseResolutions, setSuspenseResolutions] = useState<SuspenseResolution[]>([]);
  const [loading, setLoading] = useState(false);
  const reconAgent = useRef(new ReconciliationAgent());

  const mockBankTrx: BankTransaction[] = [
    { trx_id: 'XYZ-BT-001', amount: 4500000000, date: '2026-03-01', narrative: 'XENDIT SETTLEMENT RAILS', billed_fee: 2500 },
    { trx_id: 'XYZ-BT-002', amount: 1250000000, date: '2026-03-01', narrative: 'ABC CORP MULTIFINANCE DISBURSE', billed_fee: 0 },
    { trx_id: 'XYZ-BT-003', amount: 8900000000, date: '2026-03-02', narrative: 'BI-FAST INBOUND XYZ CORE', billed_fee: 2500 },
    { trx_id: 'XYZ-BT-004', amount: 500000000, date: '2026-03-02', narrative: 'MODALKU P2P REPAYMENT', billed_fee: 1250000 },
    { trx_id: 'XYZ-BT-005', amount: 15000000, date: '2026-03-03', narrative: 'BANK XYZ INTERNAL CLEARING', billed_fee: 0 }
  ];

  const mockInvoices: ERPInvoice[] = [
    { invoice_id: 'XYZ-INV-101', amount: 4500000000, date: '2026-03-01', vendorName: 'Xendit Group Indonesia' },
    { invoice_id: 'XYZ-INV-102', amount: 1250000000, date: '2026-02-28', vendorName: 'ABC Corp Multifinance' },
    { invoice_id: 'XYZ-INV-103', amount: 8900000000, date: '2026-03-02', vendorName: 'Bank Indonesia RTGS' },
    { invoice_id: 'XYZ-INV-104', amount: 500000000, date: '2026-03-01', vendorName: 'PT. Mitrausaha Indonesia (Modalku)' }
  ];

  const mockSuspense: SuspenseItem[] = [
    { trx_id: 'SUS-001', sender_name: 'JOKUL PAYMENTS', amount: 15000000, timestamp: '2026-03-05T08:00:00Z' },
    { trx_id: 'SUS-002', sender_name: 'AS-SEDAYA-FIN', amount: 450000000, timestamp: '2026-03-05T09:15:00Z' }
  ];

  const handleRecon = async () => {
    setLoading(true);
    try {
      const res = await reconAgent.current.reconcile(mockBankTrx, mockInvoices);
      setResults(res);
    } finally { setLoading(false); }
  };

  const handleFeeAudit = async () => {
    setLoading(true);
    try {
      const res = await reconAgent.current.auditFees(mockBankTrx);
      setFeeAudits(res);
    } finally { setLoading(false); }
  };

  const handleSuspense = async () => {
    setLoading(true);
    try {
      const res = await reconAgent.current.resolveSuspense(mockSuspense);
      setSuspenseResolutions(res);
    } finally { setLoading(false); }
  };

  const handleExecuteAll = async () => {
    setLoading(true);
    await handleRecon();
    await handleFeeAudit();
    await handleSuspense();
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Treasury Node Active</div>
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank XYZ Liquidity Hub</div>
          </div>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-none">{t('fin.title')}</h1>
          <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">Real-time liquidity stress forecasting and automated AI bank-to-ERP reconciliation.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 h-full">
           {activeTab === 'heatmap' ? (
             <LiquidityHeatmap data={heatmapData} />
           ) : (
             <ReconciliationWorkspace 
                results={results} 
                feeAudits={feeAudits} 
                suspenseResolutions={suspenseResolutions} 
                onExecuteAll={handleExecuteAll}
                onResolveSuspense={handleSuspense}
                loading={loading}
             />
           )}
        </div>
        
        <div className="lg:col-span-4 h-full min-h-[600px]">
           <FinanceIntelligenceBot 
              onTriggerRecon={handleRecon}
              onTriggerFeeAudit={handleFeeAudit}
              onTriggerSuspense={handleSuspense}
           />
        </div>
      </div>
    </div>
  );
}
