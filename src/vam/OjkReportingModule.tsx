import React, { useState } from 'react';
import { useI18n } from './i18n';
import {
  FileText, Download, CheckCircle2, Clock, AlertTriangle,
  Shield, Calendar, Send, RefreshCw, FileCheck2, TrendingUp,
  Activity, ChevronRight, Zap, Info, BarChart3, Star
} from 'lucide-react';

// ─── Types & Data ────────────────────────────────────────────────────────────

interface OjkReport {
  id: string;
  nameKey: string;
  period: string;
  deadline: string;
  status: 'SUBMITTED' | 'PENDING' | 'OVERDUE' | 'DRAFT';
  type: string;
  lastGenerated?: string;
  progress?: number;
}

const INITIAL_REPORTS: OjkReport[] = [
  { id: 'OJK-001', nameKey: 'ojk.monthly_va',      period: 'March 2026',   deadline: '2026-04-10', status: 'SUBMITTED', type: 'Monthly',   lastGenerated: '2026-03-28', progress: 100 },
  { id: 'OJK-002', nameKey: 'ojk.quarterly_aml',   period: 'Q1 2026',      deadline: '2026-04-30', status: 'PENDING',   type: 'Quarterly', progress: 60 },
  { id: 'OJK-003', nameKey: 'ojk.daily_liquidity', period: '2026-03-23',   deadline: '2026-03-24', status: 'SUBMITTED', type: 'Daily',     lastGenerated: '2026-03-23', progress: 100 },
  { id: 'OJK-004', nameKey: 'ojk.annual_audit',    period: 'FY 2025',      deadline: '2026-03-31', status: 'DRAFT',     type: 'Annual',    progress: 35 },
  { id: 'OJK-005', nameKey: 'ojk.bi_fast',         period: 'March 2026',   deadline: '2026-04-05', status: 'PENDING',   type: 'Monthly',   progress: 78 },
  { id: 'OJK-006', nameKey: 'ojk.kyc_compliance',  period: 'Q1 2026',      deadline: '2026-04-15', status: 'SUBMITTED', type: 'Quarterly', lastGenerated: '2026-03-20', progress: 100 },
  { id: 'OJK-007', nameKey: 'ojk.fraud_incident',  period: 'March 2026',   deadline: '2026-04-05', status: 'OVERDUE',   type: 'Monthly',   progress: 15 },
  { id: 'OJK-008', nameKey: 'ojk.capital_adequacy',period: 'Q1 2026',      deadline: '2026-04-30', status: 'DRAFT',     type: 'Quarterly', progress: 0 },
];

const TIMELINE = [
  { date: 'Apr 5',  label: 'BI-FAST Settlement', urgency: 'high' },
  { date: 'Apr 10', label: 'Monthly VA Summary',  urgency: 'medium' },
  { date: 'Apr 15', label: 'KYC Compliance',      urgency: 'medium' },
  { date: 'Apr 30', label: 'Q1 AML + Capital Adequacy', urgency: 'low' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { color: string; dark: string; bg: string; darkBg: string; icon: any; border: string }> = {
  SUBMITTED: { color: 'text-emerald-700', dark: 'dark:text-emerald-400', bg: 'bg-emerald-100', darkBg: 'dark:bg-emerald-900/30', icon: CheckCircle2, border: 'border-emerald-200 dark:border-emerald-800/40' },
  PENDING:   { color: 'text-amber-700',   dark: 'dark:text-amber-400',   bg: 'bg-amber-100',   darkBg: 'dark:bg-amber-900/30',  icon: Clock,        border: 'border-amber-200 dark:border-amber-800/40' },
  OVERDUE:   { color: 'text-red-700',     dark: 'dark:text-red-400',     bg: 'bg-red-100',     darkBg: 'dark:bg-red-900/30',    icon: AlertTriangle,border: 'border-red-200 dark:border-red-800/40' },
  DRAFT:     { color: 'text-slate-500',   dark: 'dark:text-slate-400',   bg: 'bg-slate-100',   darkBg: 'dark:bg-slate-800',     icon: FileText,     border: 'border-slate-200 dark:border-slate-700' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OjkReportingModule() {
  const { t } = useI18n();
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [generating, setGenerating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'OVERDUE' | 'SUBMITTED'>('ALL');

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setReports(prev => prev.map(r => r.id === id ? { ...r, progress: 0 } : r));
    // Simulate progress
    let p = 0;
    const timer = setInterval(() => {
      p += 20 + Math.random() * 25;
      if (p >= 100) {
        clearInterval(timer);
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'SUBMITTED' as const, lastGenerated: new Date().toISOString().split('T')[0], progress: 100 } : r));
        setGenerating(null);
      } else {
        setReports(prev => prev.map(r => r.id === id ? { ...r, progress: Math.min(95, p) } : r));
      }
    }, 400);
  };

  const handleDownload = (report: OjkReport) => {
    const content = `OTORITAS JASA KEUANGAN (OJK)\n${t(report.nameKey)}\nPeriod: ${report.period}\nInstitution: Dozn Global\nGenerated: ${report.lastGenerated || 'N/A'}\n\n--- REPORT DATA ---\nTotal VA Transactions: 48,291\nTotal Volume: IDR 892,450,000,000\nActive VAs: 12,847\nSettlement Rate: 99.7%\nFailed Transactions: 145\nAverage Processing Time: 1.2s`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_${report.period.replace(/\s/g, '_')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.status === filter);
  const submitted = reports.filter(r => r.status === 'SUBMITTED').length;
  const total = reports.length;
  const overdue = reports.filter(r => r.status === 'OVERDUE').length;
  const pending = reports.filter(r => r.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 space-y-10 animate-in fade-in duration-700">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {t('ojk.compliance_active')}
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tighter leading-none">{t('ojk.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl font-medium">{t('ojk.subtitle')}</p>
        </div>

        {/* AI summary badge */}
        <div className="flex items-start gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-[28px] border border-indigo-100 dark:border-indigo-800/40 max-w-xs">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">AI Compliance Score</p>
            <p className="text-3xl font-black text-indigo-700 dark:text-indigo-300 mt-0.5">A+</p>
            <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold mt-0.5">Bank Indonesia Rating · Q1 2026</p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('ojk.total_reports'),   val: total,                           sub: 'Q1 2026',             color: 'text-slate-800 dark:text-slate-100', icon: FileText,      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
          { label: t('ojk.on_time'),         val: `${((submitted/total)*100).toFixed(0)}%`, sub: `${submitted}/${total} submitted`, color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2,  iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
          { label: t('ojk.overdue'),         val: overdue,                          sub: 'Requires immediate action', color: 'text-red-600 dark:text-red-400',     icon: AlertTriangle, iconBg: 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400' },
          { label: t('ojk.next_deadline'),   val: 'Apr 5',                          sub: 'BI-FAST Settlement',  color: 'text-amber-600 dark:text-amber-400',  icon: Calendar,      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
        ].map(c => (
          <div key={c.label} className="bg-card dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
              <c.icon size={22} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{c.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${c.color}`}>{c.val}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Deadline Timeline + Reports Table ─────────────────────── */}
      <div className="grid grid-cols-12 gap-6 w-full min-w-0">

        {/* Timeline */}
        <div className="col-span-12 lg:col-span-4 min-w-0 bg-card dark:bg-slate-900 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">Compliance Calendar</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Upcoming deadlines</p>
            </div>
          </div>

          <div className="space-y-3">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${
                item.urgency === 'high'   ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' :
                item.urgency === 'medium' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30' :
                'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                  item.urgency === 'high'   ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  item.urgency === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                  'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  <span className="text-[8px] font-black leading-none">APR</span>
                  <span className="text-sm font-black leading-tight">{item.date.split(' ')[1]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate">{item.label}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${
                    item.urgency === 'high' ? 'text-red-500 dark:text-red-400' :
                    item.urgency === 'medium' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
                  }`}>{item.urgency === 'high' ? 'Urgent' : item.urgency === 'medium' ? 'Upcoming' : 'On track'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Overall progress */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Q1 Completion</p>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-300">{((submitted/total)*100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${(submitted/total)*100}%` }} />
            </div>
            <p className="text-[9px] text-indigo-500 dark:text-indigo-400 font-bold">{submitted} of {total} filings submitted</p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="col-span-12 lg:col-span-8 min-w-0 bg-card dark:bg-slate-900 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">{t('ojk.summary_stats')}</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">OJK &amp; Bank Indonesia Regulatory Filings</p>
              </div>
            </div>
            {/* Filter pills */}
            <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['ALL', 'PENDING', 'OVERDUE', 'SUBMITTED'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-card dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 dark:text-slate-500'
                }`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[520px] overflow-y-auto overflow-x-hidden">
            {filtered.map(report => {
              const sc = statusConfig[report.status];
              const StatusIcon = sc.icon;
              const isGenerating = generating === report.id;
              return (
                <div key={report.id} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${sc.bg} ${sc.darkBg}`}>
                      <FileCheck2 size={18} className={`${sc.color} ${sc.dark}`} />
                    </div>

                    {/* Name + Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate">{t(report.nameKey)}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase ${sc.bg} ${sc.darkBg} ${sc.color} ${sc.dark}`}>
                          <StatusIcon size={10} />
                          {t(`ojk.${report.status.toLowerCase()}`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                        <span className="font-mono">{report.id} · {report.type}</span>
                        <span>{report.period}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {report.deadline}</span>
                      </div>

                      {/* Progress bar (for non-submitted) */}
                      {report.status !== 'SUBMITTED' && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isGenerating ? 'bg-indigo-400 animate-pulse' :
                                report.status === 'OVERDUE' ? 'bg-red-400' :
                                report.status === 'PENDING' ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'
                              }`}
                              style={{ width: `${report.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 w-8 text-right">{report.progress || 0}%</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {report.status !== 'SUBMITTED' && (
                        <button
                          onClick={() => handleGenerate(report.id)}
                          disabled={isGenerating}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
                        >
                          {isGenerating ? <RefreshCw size={11} className="animate-spin" /> : <Send size={11} />}
                          {isGenerating ? 'Generating…' : t('ojk.generate')}
                        </button>
                      )}
                      {report.status === 'SUBMITTED' && (
                        <button
                          onClick={() => handleDownload(report)}
                          className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/40"
                        >
                          <Download size={11} /> {t('ojk.download')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
