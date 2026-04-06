import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  BrainCircuit, RefreshCw, Send, ChevronRight, ShieldAlert,
  CheckCircle2, AlertCircle, TrendingUp, DollarSign, Zap,
  LayoutGrid, FileText, Activity, ArrowRight, Clock, Info,
  Sparkles, MessageSquare, X, ChevronDown
} from 'lucide-react';
import { FinanceAssistantAgent, AssistantResponse } from './FinanceAssistantAgent';
import { ReconciliationAgent, ReconciliationResult, FeeAuditResult, SuspenseResolution } from './ReconciliationAgent';
import { useI18n } from './i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeatmapCell {
  x: number;
  y: string;
  status: 'NORMAL' | 'CAUTION' | 'CRITICAL';
  lsi: number;
  balance: string;
  outflow: string;
}

type ActiveTab = 'heatmap' | 'reconciliation' | 'revenue';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ACCOUNTS = [
  'Dozn Operating',
  'SNAP Settlement',
  'Fintech Escrow',
  'BI-RTGS Reserve',
  'OJK Mandatory',
  'Interbank Pool'
];

const BALANCES = ['Rp 42.1B', 'Rp 6.8B', 'Rp 18.4B', 'Rp 31.0B', 'Rp 9.2B', 'Rp 55.7B'];
const OUTFLOWS = ['Rp 3.2B', 'Rp 7.1B', 'Rp 2.4B', 'Rp 4.8B', 'Rp 1.0B', 'Rp 8.2B'];

const generateHeatmap = (): HeatmapCell[] => {
  const cells: HeatmapCell[] = [];
  ACCOUNTS.forEach((acc, ai) => {
    for (let d = 1; d <= 7; d++) {
      let status: HeatmapCell['status'] = 'NORMAL';
      if (acc === 'SNAP Settlement' && d === 4) status = 'CAUTION';
      if (acc === 'SNAP Settlement' && d === 5) status = 'CRITICAL';
      if (acc === 'BI-RTGS Reserve' && d === 6) status = 'CAUTION';
      if (acc === 'OJK Mandatory' && (d === 1 || d === 5)) status = 'CAUTION';
      if (acc === 'OJK Mandatory' && d === 6) status = 'CRITICAL';
      cells.push({ x: d, y: acc, status, lsi: 70 + Math.random() * 45, balance: BALANCES[ai], outflow: OUTFLOWS[ai] });
    }
  });
  return cells;
};

const MOCK_RECON: ReconciliationResult[] = [
  { bank_trx_id: 'DOZN-BT-001', invoice_id: 'DOZN-INV-101', confidence_score: 0.99, match_type: 'AUTO', antasena_sector: { name: 'Technology', code: '7020' }, reasoning: "Exact amount match; narrative 'XENDIT SETTLEMENT' → Xendit." },
  { bank_trx_id: 'DOZN-BT-002', invoice_id: 'DOZN-INV-102', confidence_score: 0.95, match_type: 'AUTO', antasena_sector: { name: 'Finance', code: '6010' }, reasoning: 'Matched via entity extraction + settlement history.' },
  { bank_trx_id: 'DOZN-BT-004', invoice_id: 'DOZN-INV-104', confidence_score: 0.82, match_type: 'SUGGESTED', antasena_sector: { name: 'Finance', code: '6010' }, reasoning: 'Amount match; narrative date 2-day variance from ERP invoice.' },
  { bank_trx_id: 'DOZN-BT-007', invoice_id: '—', confidence_score: 0.0, match_type: 'EXCEPTION', antasena_sector: { name: 'Unknown', code: '0000' }, reasoning: 'No billing partner match found. Requires manual review.' },
];

const MOCK_FEES: FeeAuditResult[] = [
  { trx_id: 'DOZN-BT-001', billed_fee: 2500, calculated_fee: 2500, discrepancy: 0, status: 'MATCH', reason: 'Flat-fee standard applied correctly (Xendit).' },
  { trx_id: 'DOZN-BT-004', billed_fee: 1250000, calculated_fee: 2500000, discrepancy: 1250000, status: 'LEAKAGE', reason: 'P2P rule: 0.5% (Rp 2.5M) — only 0.25% charged (Modalku).' },
  { trx_id: 'DOZN-BT-008', billed_fee: 3100000, calculated_fee: 2500000, discrepancy: -600000, status: 'OVERCHARGE', reason: 'Tiered rate was incorrectly applied; Rp 600K overcharged.' },
];

const MOCK_SUSPENSE: SuspenseResolution[] = [
  { trx_id: 'SUS-001', suggested_beneficiary: 'E-Commerce Escrow Pool', confidence: 0.92, rationale: "Sender 'Jokul' is a known sub-aggregator for E-Commerce collections." },
  { trx_id: 'SUS-002', suggested_beneficiary: 'Hasjrat Multifinance', confidence: 0.88, rationale: "Entity 'AS-SEDAYA' matches parent group ID for PT. Hasjrat Abadi." },
];

// ─── Liquidity Heatmap ────────────────────────────────────────────────────────

const LiquidityHeatmap = () => {
  const { t } = useI18n();
  const data = useMemo(generateHeatmap, []);
  const days = [1, 2, 3, 4, 5, 6, 7];
  const dayNames = ['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE'];
  const [hovered, setHovered] = useState<HeatmapCell | null>(null);

  const cellColors = {
    NORMAL: 'bg-emerald-400/80 dark:bg-emerald-500/70 hover:bg-emerald-400',
    CAUTION: 'bg-amber-400/90 dark:bg-amber-400/80 hover:bg-amber-400',
    CRITICAL: 'bg-rose-500 dark:bg-rose-600 hover:bg-rose-400 animate-pulse',
  };

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-4">
          {(['NORMAL', 'CAUTION', 'CRITICAL'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-amber-400' : 'bg-rose-500'}`} />
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s}</span>
            </div>
          ))}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Unit: IDR Billions</span>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="grid gap-2" style={{ gridTemplateColumns: '150px repeat(7, minmax(40px,1fr))', minWidth: 520 }}>
          <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase self-end pb-2">{t('fin.account_pool')}</div>
          {days.map((d, i) => (
            <div key={d} className={`flex flex-col items-center p-2 rounded-xl ${i === 3 ? 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40' : i === 0 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30' : ''}`}>
              <span className={`text-[9px] font-black ${i === 3 ? 'text-rose-500' : i === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{dayNames[i]}</span>
              <span className={`text-sm font-black ${i === 3 ? 'text-rose-600' : i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>{d}</span>
            </div>
          ))}
          {ACCOUNTS.map(acc => (
            <React.Fragment key={acc}>
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center pr-2 truncate">{acc}</div>
              {days.map(d => {
                const cell = data.find(c => c.x === d && c.y === acc)!;
                return (
                  <div
                    key={`${acc}-${d}`}
                    className={`h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${cellColors[cell.status]}`}
                    onMouseEnter={() => setHovered(cell)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {cell.status === 'CRITICAL' && <span className="text-white text-[10px] font-black">!</span>}
                    {cell.status === 'CAUTION' && <span className="text-amber-900/60 text-[10px] font-black">~</span>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {hovered && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs grid grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div><p className="text-[9px] text-slate-400 uppercase font-black mb-0.5">Account</p><p className="font-black text-slate-800 dark:text-slate-100">{hovered.y}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-black mb-0.5">Balance</p><p className="font-black text-slate-800 dark:text-slate-100">{hovered.balance}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-black mb-0.5">LSI Score</p><p className={`font-black ${hovered.status === 'CRITICAL' ? 'text-rose-600' : hovered.status === 'CAUTION' ? 'text-amber-600' : 'text-emerald-600'}`}>{hovered.lsi.toFixed(1)}%</p></div>
        </div>
      )}
    </div>
  );
};

// ─── ERP Reconciliation Tab ────────────────────────────────────────────────────

const ERPReconciliationTab = ({ triggerRun }: { triggerRun: boolean }) => {
  const { t } = useI18n();
  const agent = useRef(new ReconciliationAgent());
  const [results, setResults] = useState<ReconciliationResult[]>([]);
  const [fees, setFees] = useState<FeeAuditResult[]>([]);
  const [suspense, setSuspense] = useState<SuspenseResolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  const run = useCallback(async () => {
    if (ran) return;
    setLoading(true);
    const [r, f, s] = await Promise.all([
      agent.current.reconcile([], []),
      agent.current.auditFees([]),
      agent.current.resolveSuspense([]),
    ]);
    setResults(r);
    setFees(f);
    setSuspense(s);
    setLoading(false);
    setRan(true);
  }, [ran]);

  useEffect(() => { if (triggerRun) run(); }, [triggerRun, run]);

  const matchBadge = (type: string) => {
    if (type === 'AUTO') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    if (type === 'SUGGESTED') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const feeStatusBadge = (s: string) => {
    if (s === 'MATCH') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    if (s === 'LEAKAGE') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
  };

  if (!ran && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[28px] flex items-center justify-center">
          <RefreshCw size={36} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Run ERP Reconciliation</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Auto-match bank transactions to ERP invoices using the Dozn probabilistic engine.</p>
        </div>
        <button onClick={run} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all flex items-center gap-2">
          <Zap size={16} /> Run Smart Match
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw size={32} className="text-blue-500 animate-spin" />
        <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Running Tally Engine…</p>
        <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-blue-500 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  const autoCount = results.filter(r => r.match_type === 'AUTO').length;
  const leakageTotal = fees.filter(f => f.status === 'LEAKAGE').reduce((s, f) => s + f.discrepancy, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Matched', val: `${autoCount}/${results.length}`, sub: 'Auto-matched', color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
          { label: 'Match Rate', val: `${((autoCount / results.length) * 100).toFixed(0)}%`, sub: 'Confidence avg 92%', color: 'text-blue-600 dark:text-blue-400', icon: Activity },
          { label: 'Fee Leakage', val: `Rp ${(leakageTotal / 1000000).toFixed(1)}M`, sub: 'Recoverable', color: 'text-rose-600 dark:text-rose-400', icon: AlertCircle },
          { label: 'Suspense', val: `${suspense.length}`, sub: 'Items to resolve', color: 'text-amber-600 dark:text-amber-400', icon: Clock },
        ].map(kpi => (
          <div key={kpi.label} className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Rail Matching Table */}
      <div className="bg-card dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <LayoutGrid size={16} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{t('fin.daily_rail')}</h4>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Dozn Global Tally Engine · Neural Match</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left">
              <tr>
                {['Bank TRX ID', 'Invoice ID', 'Sector', 'Confidence', 'Match Type', 'Reasoning'].map(h => (
                  <th key={h} className="px-5 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {(ran ? results : MOCK_RECON).map(r => (
                <tr key={r.bank_trx_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">{r.bank_trx_id}</td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">{r.invoice_id}</td>
                  <td className="px-5 py-4"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-black">{r.antasena_sector.name}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.confidence_score > 0.9 ? 'bg-emerald-400' : r.confidence_score > 0.7 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${r.confidence_score * 100}%` }} />
                      </div>
                      <span className="font-black text-slate-700 dark:text-slate-300">{(r.confidence_score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${matchBadge(r.match_type)}`}>{r.match_type}</span></td>
                  <td className="px-5 py-4 text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={r.reasoning}>{r.reasoning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fee Audit + Suspense side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Audit */}
        <div className="bg-card dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{t('fin.revenue_audit')}</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fee Variance Analysis</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {(ran ? fees : MOCK_FEES).map(f => (
              <div key={f.trx_id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{f.trx_id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${feeStatusBadge(f.status)}`}>{f.status}</span>
                </div>
                <div className="flex gap-4 text-[10px]">
                  <span className="text-slate-400">Billed: <strong className="text-slate-700 dark:text-slate-300">{f.billed_fee.toLocaleString()}</strong></span>
                  <span className="text-slate-400">Calc: <strong className="text-slate-700 dark:text-slate-300">{f.calculated_fee.toLocaleString()}</strong></span>
                  {f.discrepancy !== 0 && <span className={f.discrepancy > 0 ? 'text-rose-600 font-black' : 'text-amber-600 font-black'}>Δ {Math.abs(f.discrepancy).toLocaleString()}</span>}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">{f.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suspense Resolver */}
        <div className="bg-card dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{t('fin.suspense_resolver')}</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AI Beneficiary Identification</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {(ran ? suspense : MOCK_SUSPENSE).map(s => (
              <div key={s.trx_id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{s.trx_id}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${s.confidence * 100}%` }} />
                    </div>
                    <span className="text-[9px] font-black text-amber-600">{(s.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-slate-300 dark:text-slate-600 shrink-0" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">{s.suggested_beneficiary}</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">{s.rationale}</p>
                <button className="w-full py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all">
                  Confirm & Appropriate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Finance Copilot ──────────────────────────────────────────────────────────

interface ChatMessage { role: 'user' | 'ai'; content: string; action?: AssistantResponse['action'] }

const FinanceCopilot = ({ onSwitchTab, language }: { onSwitchTab: (tab: ActiveTab) => void; language: string }) => {
  const { t } = useI18n();
  const agent = useRef(new FinanceAssistantAgent());
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: t('fin.copilot_init') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<AssistantResponse | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const koSuggestions = ['Xendit 수수료 감사', 'SNAP 결제 버퍼 (토)', 'ERP 대사 실행'];
  const enSuggestions = ['Audit Xendit fees', 'SNAP buffer on Sat?', 'Run ERP reconciliation'];
  const suggestions = language === 'ko' ? koSuggestions : enSuggestions;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (q?: string) => {
    const query = q || input.trim();
    if (!query) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);
    try {
      const res = await agent.current.processQuery(query);
      setMessages(prev => [...prev, { role: 'ai', content: res.message, action: res.action }]);
      if (res.action && res.action.type !== 'NONE') setPendingAction(res);
    } finally { setLoading(false); }
  };

  const confirm = () => {
    if (!pendingAction?.action) return;
    const targetTab = pendingAction.action.targetTab || 'reconciliation';
    setMessages(prev => [...prev, {
      role: 'ai',
      content: `✅ **${pendingAction.action!.summary}** — executed. Switching to results tab…`,
    }]);
    setPendingAction(null);
    setTimeout(() => onSwitchTab(targetTab as ActiveTab), 600);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <Sparkles size={12} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed font-medium whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none'
            }`}>
              {m.content}
              {m.action && m.action.type !== 'NONE' && m === messages[messages.length - 1] && pendingAction && (
                <div className="mt-3 flex gap-2">
                  <button onClick={confirm} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Confirm
                  </button>
                  <button onClick={() => setPendingAction(null)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mr-2">
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-1.5 my-3">
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)} className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800">
            ✨ {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && send()}
          placeholder={t('fin.ask_recon')}
          className="w-full pr-12 pl-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-medium dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1.5 w-8 h-8 bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Main Finance Cockpit ──────────────────────────────────────────────────────

export default function FinanceCockpit() {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<ActiveTab>('heatmap');
  const [triggerRecon, setTriggerRecon] = useState(false);

  const handleSwitchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'reconciliation') setTriggerRecon(true);
  };

  const tabs: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'heatmap', label: t('nav.liquidity_heatmap'), icon: Activity },
    { id: 'reconciliation', label: t('nav.erp_reconciliation'), icon: RefreshCw },
    { id: 'revenue', label: t('fin.revenue_assurance'), icon: TrendingUp },
  ];

  const stats = [
    { label: t('fin.lsi_score'), val: '87.4%', delta: '+2.1%', up: true, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: t('fin.mcs_score'), val: '99.2%', delta: '-0.3%', up: false, color: 'text-blue-600 dark:text-blue-400' },
    { label: t('fin.fee_leakage'), val: 'Rp 1.25M', delta: 'Detected', up: false, color: 'text-rose-600 dark:text-rose-400' },
    { label: t('fin.unappropriated'), val: '2', delta: 'Suspense', up: false, color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="max-w-[1600px] w-full mx-auto space-y-8 animate-in fade-in duration-500 flex flex-col flex-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('fin.treasury_active')}
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('fin.liquidity_hub')}</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{t('fin.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{t('fin.subtitle')}</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-card dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-right min-w-[110px]">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
              <p className={`text-[9px] font-bold mt-0.5 ${s.up ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>{s.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Tabs + Copilot */}
      <div className="grid grid-cols-12 gap-6 items-stretch w-full min-w-0 flex-1 overflow-hidden">
        {/* Left: Tabbed Panel */}
        <div className="col-span-12 lg:col-span-8 min-w-0 bg-card dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Tab Bar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-card dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'heatmap' && (
              <div className="space-y-4 animate-in fade-in duration-400">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{t('fin.heatmap')}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">{t('fin.heatmap_subtitle')}</p>
                  </div>
                  <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <BrainCircuit size={12} /> {t('fin.neural_active')}
                  </div>
                </div>
                <LiquidityHeatmap />
              </div>
            )}

            {activeTab === 'reconciliation' && (
              <ERPReconciliationTab triggerRun={triggerRecon} />
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6 animate-in fade-in duration-400">
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{t('fin.revenue_assurance')}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Fee Audit · Rail Matching · OJK Compliance</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Billed', val: 'Rp 892.4B', sub: 'March 2026', color: 'text-slate-800 dark:text-slate-100' },
                    { label: 'Fee Collected', val: 'Rp 4.2B', sub: '0.47% effective rate', color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Leakage Risk', val: 'Rp 1.25M', sub: '1 item flagged', color: 'text-rose-600 dark:text-rose-400' },
                  ].map(c => (
                    <div key={c.label} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
                      <p className={`text-2xl font-black ${c.color}`}>{c.val}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{c.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-4">
                  <Info size={20} className="text-blue-500 shrink-0" />
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                    Use the <strong>Finance Copilot</strong> on the right and ask <em>"Audit Xendit fees"</em> or <em>"Run ERP reconciliation"</em> to trigger a full revenue assurance analysis. Results will auto-populate in the Reconciliation tab.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Finance Copilot */}
        <div className="col-span-12 lg:col-span-4 min-w-0 bg-card dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden" style={{ minHeight: 560 }}>
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                <BrainCircuit size={18} className="text-white" />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">{t('fin.copilot')}</h4>
                <p className="text-[9px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={8} /> {t('fin.neural_intel')}
                </p>
              </div>
            </div>
            <span className="text-[8px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
              {t('fin.active')}
            </span>
          </div>
          <div className="flex-1 p-5 flex flex-col min-h-0">
            <FinanceCopilot onSwitchTab={handleSwitchTab} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
