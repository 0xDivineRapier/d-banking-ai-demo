
import React, { useState } from 'react';
import { useI18n } from './i18n';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  Calendar,
  BarChart3,
  Send,
  RefreshCw,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface OjkReport {
  id: string;
  nameKey: string;
  period: string;
  deadline: string;
  status: 'SUBMITTED' | 'PENDING' | 'OVERDUE' | 'DRAFT';
  type: string;
  lastGenerated?: string;
}

const INITIAL_REPORTS: OjkReport[] = [
  { id: 'OJK-001', nameKey: 'ojk.monthly_va', period: 'March 2026', deadline: '2026-04-10', status: 'SUBMITTED', type: 'Monthly', lastGenerated: '2026-03-28' },
  { id: 'OJK-002', nameKey: 'ojk.quarterly_aml', period: 'Q1 2026', deadline: '2026-04-30', status: 'PENDING', type: 'Quarterly' },
  { id: 'OJK-003', nameKey: 'ojk.daily_liquidity', period: '2026-03-23', deadline: '2026-03-24', status: 'SUBMITTED', type: 'Daily', lastGenerated: '2026-03-23' },
  { id: 'OJK-004', nameKey: 'ojk.annual_audit', period: 'FY 2025', deadline: '2026-03-31', status: 'DRAFT', type: 'Annual' },
  { id: 'OJK-005', nameKey: 'ojk.bi_fast', period: 'March 2026', deadline: '2026-04-05', status: 'PENDING', type: 'Monthly' },
  { id: 'OJK-006', nameKey: 'ojk.kyc_compliance', period: 'Q1 2026', deadline: '2026-04-15', status: 'SUBMITTED', type: 'Quarterly', lastGenerated: '2026-03-20' },
  { id: 'OJK-007', nameKey: 'ojk.fraud_incident', period: 'March 2026', deadline: '2026-04-05', status: 'OVERDUE', type: 'Monthly' },
  { id: 'OJK-008', nameKey: 'ojk.capital_adequacy', period: 'Q1 2026', deadline: '2026-04-30', status: 'DRAFT', type: 'Quarterly' },
];

export default function OjkReportingModule() {
  const { t } = useI18n();
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'SUBMITTED' as const, lastGenerated: new Date().toISOString().split('T')[0] } : r));
      setGenerating(null);
    }, 2000);
  };

  const handleDownload = (report: OjkReport) => {
    const content = `OTORITAS JASA KEUANGAN (OJK)\n${t(report.nameKey)}\nPeriod: ${report.period}\nBank: Bank XYZ\nGenerated: ${report.lastGenerated || 'N/A'}\n\n--- REPORT DATA ---\nTotal VA Transactions: 48,291\nTotal Volume: IDR 892,450,000,000\nActive VAs: 12,847\nSettlement Rate: 99.7%\nFailed Transactions: 145\nAverage Processing Time: 1.2s`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_${report.period.replace(/\s/g, '_')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const statusConfig: Record<string, { color: string; icon: any; bg: string }> = {
    SUBMITTED: { color: 'text-emerald-700', icon: CheckCircle2, bg: 'bg-emerald-100' },
    PENDING: { color: 'text-amber-700', icon: Clock, bg: 'bg-amber-100' },
    OVERDUE: { color: 'text-red-700', icon: AlertTriangle, bg: 'bg-red-100' },
    DRAFT: { color: 'text-slate-500', icon: FileText, bg: 'bg-slate-100' },
  };

  const submitted = reports.filter(r => r.status === 'SUBMITTED').length;
  const total = reports.length;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{t('ojk.compliance_active')}</div>
          </div>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-none">{t('ojk.title')}</h1>
          <p className="text-slate-500 text-xl max-w-2xl font-medium">{t('ojk.subtitle')}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.total_reports')}</p>
          <p className="text-4xl font-black text-slate-800">{total}</p>
          <p className="text-xs text-slate-500">Q1 2026</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.on_time')}</p>
          <p className="text-4xl font-black text-emerald-600">{((submitted / total) * 100).toFixed(0)}%</p>
          <p className="text-xs text-emerald-500 font-bold">{submitted}/{total} {t('ojk.submitted')}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.next_deadline')}</p>
          <p className="text-4xl font-black text-amber-600">Apr 5</p>
          <p className="text-xs text-amber-500 font-bold">BI-FAST Settlement</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.compliance_score')}</p>
          <p className="text-4xl font-black text-indigo-600">A+</p>
          <p className="text-xs text-indigo-500 font-bold">Bank Indonesia Rating</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('ojk.summary_stats')}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">OJK & Bank Indonesia Regulatory Filings</p>
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.report_name')}</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.period')}</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.deadline')}</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ojk.submission_status')}</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('common.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map(report => {
              const sc = statusConfig[report.status];
              const StatusIcon = sc.icon;
              return (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <FileCheck2 size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{t(report.nameKey)}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{report.id} • {report.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">{report.period}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="font-bold text-slate-600">{report.deadline}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase ${sc.bg} ${sc.color}`}>
                      <StatusIcon size={12} />
                      {t(`ojk.${report.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {report.status !== 'SUBMITTED' && (
                        <button
                          onClick={() => handleGenerate(report.id)}
                          disabled={generating === report.id}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {generating === report.id ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                          {t('ojk.generate')}
                        </button>
                      )}
                      {report.status === 'SUBMITTED' && (
                        <button
                          onClick={() => handleDownload(report)}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                          <Download size={12} />
                          {t('ojk.download')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
