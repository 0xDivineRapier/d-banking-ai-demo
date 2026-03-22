
import React, { useState, useMemo } from 'react';
import { useI18n } from './i18n';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  CreditCard, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Filter, 
  Download, 
  Plus, 
  User, 
  Wallet,
  Zap,
  Layers,
  FileText,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Database,
  X,
  ArrowUpRight,
  Fingerprint,
  FileSearch,
  Printer,
  List,
  Check
} from 'lucide-react';

// --- Mock Data ---

const MOCK_VA_RESULTS: Record<string, any> = {
  "88001123456": {
    va_number: "88001123456",
    customer_name: "Xendit User 99",
    status: "ACTIVE",
    expiry: "2026-12-31",
    shadow_balance: 1500000,
    core_balance: 1500000,
    mother_account: "10940001",
    institution: "Xendit Group",
    history: [
      { id: 'tx-1', date: '2026-03-05 14:20', amount: 500000, type: 'SNAP_BI_CREDIT', status: 'SUCCESS', sender_name: 'Budiono Siregar', bank_source: 'Bank Mandiri', external_id: 'X-EXT-992100411', channel: 'MOBILE_BANKING' },
      { id: 'tx-2', date: '2026-03-04 09:10', amount: 1000000, type: 'SNAP_BI_CREDIT', status: 'SUCCESS', sender_name: 'Siti Aminah', bank_source: 'BCA', external_id: 'X-EXT-992100412', channel: 'ATM' },
    ]
  },
  "88001777888": {
    va_number: "88001777888",
    customer_name: "ABC Corp Finance Client A",
    status: "FROZEN",
    expiry: "2026-06-15",
    shadow_balance: 0,
    core_balance: 12500000,
    mother_account: "10940001",
    institution: "ABC Corp",
    history: [
      { id: 'tx-3', date: '2026-02-15 10:00', amount: 12500000, type: 'MANUAL_ADJ', status: 'FAILED', sender_name: 'Bank XYZ System Admin', bank_source: 'Internal Bank XYZ', external_id: 'ADJ-10293', channel: 'BACKOFFICE' },
    ]
  }
};

const MOCK_ALL_TRANSACTIONS = [
  { id: 'TXN-001', va: '88001123456', amount: 500000, type: 'SNAP_BI_CREDIT', status: 'SUCCESS', date: '2026-03-05 14:20', sender: 'Budiono Siregar', institution: 'Xendit' },
  { id: 'TXN-002', va: '88001123456', amount: 1000000, type: 'SNAP_BI_CREDIT', status: 'SUCCESS', date: '2026-03-04 09:10', sender: 'Siti Aminah', institution: 'Xendit' },
  { id: 'TXN-003', va: '88041001001', amount: 2500000, type: 'SNAP_BI_CREDIT', status: 'SUCCESS', date: '2026-03-05 11:30', sender: 'Andi Wijaya', institution: 'DEF Payment' },
  { id: 'TXN-004', va: '88001777888', amount: 12500000, type: 'MANUAL_ADJ', status: 'FAILED', date: '2026-02-15 10:00', sender: 'System Admin', institution: 'ABC Corp' },
  { id: 'TXN-005', va: '88042000101', amount: 750000, type: 'BI_FAST', status: 'SUCCESS', date: '2026-03-05 16:45', sender: 'PT. Maju Bersama', institution: 'Modalku' },
  { id: 'TXN-006', va: '88001123456', amount: 150000, type: 'SNAP_BI_CREDIT', status: 'PENDING', date: '2026-03-05 17:00', sender: 'Dewi Sartika', institution: 'Xendit' },
  { id: 'TXN-007', va: '88041001002', amount: 3200000, type: 'SNAP_BI_CREDIT', status: 'SUCCESS', date: '2026-03-04 08:15', sender: 'Budi Santoso', institution: 'DEF Payment' },
  { id: 'TXN-008', va: '88042000201', amount: 45000000, type: 'RTGS', status: 'SUCCESS', date: '2026-03-03 14:00', sender: 'PT. Global Corp', institution: 'Internal' },
];

const BATCH_HISTORY = [
  { id: 'BCH-991', name: 'ABC_Corp_Settlement_Mar05.csv', status: 'COMPLETED', count: 1402, date: '2026-03-05' },
  { id: 'BCH-990', name: 'DEF_Payment_Gateway_Merchant_VA_Create.xls', status: 'PROCESSING', count: 450, date: '2026-03-05' },
  { id: 'BCH-989', name: 'Xendit_Refund_Batch_A.csv', status: 'FAILED', count: 12, date: '2026-03-04' },
];

const EXCEPTIONS = [
  { id: 'EX-001', va: '88001...999', amount: 1250000, error: 'SIGNATURE_MISMATCH', date: '2026-03-05 16:10', status: 'UNAPPROPRIATED' },
  { id: 'EX-002', va: 'Unknown', amount: 450000, error: 'MOTHER_ACC_CLOSED', date: '2026-03-05 16:15', status: 'FAILED' },
  { id: 'EX-003', va: '88041...001', amount: 500000, error: 'AMOUNT_UNDER_MINIMUM', date: '2026-03-05 15:45', status: 'PENDING' },
];

// --- Sub-Components ---

const TransactionDetailOverlay = ({ tx, onClose }: { tx: any; onClose: () => void }) => {
  if (!tx) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-8 duration-500" onClick={(e) => e.stopPropagation()}>
        <div className={`p-10 text-white relative ${tx.status === 'SUCCESS' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-all"><X size={20} /></button>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg"><ShieldCheck size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Bank XYZ Core Receipt</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black tracking-tighter">Rp {tx.amount?.toLocaleString()}</p>
              <p className="text-xs font-bold opacity-80">{tx.status === 'SUCCESS' ? 'Transaction Settled Successfully' : 'Transaction Failed'}</p>
            </div>
          </div>
          <div className="absolute -bottom-3 left-0 right-0 flex justify-around px-4">
             {Array.from({ length: 15 }).map((_, i) => (<div key={i} className="w-6 h-6 rounded-full bg-white"></div>))}
          </div>
        </div>
        <div className="p-10 pt-12 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender</p>
              <p className="text-sm font-black text-slate-800">{tx.sender_name || tx.sender || 'Anonymous'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{tx.bank_source || tx.institution || 'Unknown'}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</p>
              <p className="text-sm font-black text-slate-800">{tx.channel || tx.type}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{tx.date}</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-[32px] space-y-4 border border-slate-100">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                <span className="text-[10px] font-mono font-bold text-blue-600">{tx.type}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</span>
                <span className="text-[10px] font-mono font-bold text-slate-800">{tx.external_id || tx.id}</span>
             </div>
          </div>
          <div className="flex gap-4 pt-4">
             <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Printer size={16} /> Print</button>
             <button className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><FileSearch size={16} /> Trace</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InquiryTab = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(MOCK_VA_RESULTS[query] || null);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {selectedTx && <TransactionDetailOverlay tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-[24px] flex items-center justify-center"><Search size={28} /></div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Real-time VA Inquiry</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-Reference Bank XYZ Core vs Shadow Rails</p>
          </div>
        </div>
        <div className="flex gap-4">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter VA Number (e.g. 88001123456)" className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 rounded-[20px] text-xl font-black text-slate-800 outline-none focus:border-blue-500 shadow-inner" />
          <button onClick={handleSearch} className="px-10 py-5 bg-slate-900 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-200">
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />} Query
          </button>
        </div>
      </div>

      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom duration-500">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-white font-black text-4xl shadow-lg ${result.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}>{result.customer_name.charAt(0)}</div>
                  <div>
                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter">{result.customer_name}</h4>
                    <p className="text-lg font-medium text-slate-500">VA: {result.va_number} • {result.institution}</p>
                  </div>
                </div>
                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${result.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{result.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                <div className="p-8 bg-slate-50 rounded-[32px] space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shadow Balance</p>
                  <p className="text-3xl font-black text-blue-600">Rp {result.shadow_balance.toLocaleString()}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Balance</p>
                  <p className="text-3xl font-black text-slate-800">Rp {result.core_balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100"><h5 className="text-xl font-black text-slate-800">Recent Activity</h5></div>
               <table className="w-full text-sm">
                  <thead className="bg-slate-50"><tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Date</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Description</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.history.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50 group">
                        <td className="px-8 py-6 text-slate-500 font-mono text-xs">{tx.date}</td>
                        <td className="px-8 py-6"><p className="font-black text-slate-800">{tx.type === 'SNAP_BI_CREDIT' ? 'SNAP BI Credit' : 'Manual Adjustment'}</p></td>
                        <td className="px-8 py-6 font-black text-slate-800">Rp {tx.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => setSelectedTx(tx)} className="p-2 bg-slate-100 rounded-xl hover:bg-blue-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"><ArrowRight size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl space-y-6">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Metadata</p>
              {[{ label: 'Expiry', val: result.expiry }, { label: 'Node', val: 'XYZ-JKT-PRIMARY' }, { label: 'OJK Tier', val: 'Tier 1' }].map((it, i) => (
                <div key={i} className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{it.label}</span>
                  <span className="text-xs font-black">{it.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : query && !loading && (
        <div className="bg-white p-20 rounded-[40px] border border-slate-200 text-center space-y-4">
           <AlertCircle size={48} className="text-slate-200 mx-auto" />
           <p className="text-slate-400 font-bold">No VA found for "{query}".</p>
        </div>
      )}
    </div>
  );
};

const TransactionListTab = () => {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = useMemo(() => {
    if (filterStatus === 'ALL') return MOCK_ALL_TRANSACTIONS;
    return MOCK_ALL_TRANSACTIONS.filter(t => t.status === filterStatus);
  }, [filterStatus]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {selectedTx && <TransactionDetailOverlay tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter">All Transactions</h3>
          <p className="text-slate-500 font-medium mt-1">Complete ledger of VA payment activity across all rails.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">VA Number</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(tx => (
              <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <td className="px-8 py-5 font-mono text-xs font-bold text-blue-600">{tx.id}</td>
                <td className="px-8 py-5 font-mono text-xs text-slate-600">{tx.va}</td>
                <td className="px-8 py-5">
                  <p className="font-black text-slate-800 text-xs">{tx.sender}</p>
                  <p className="text-[10px] text-slate-400">{tx.institution}</p>
                </td>
                <td className="px-8 py-5 font-black text-slate-800">Rp {tx.amount.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black">{tx.type}</span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                    tx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>{tx.status}</span>
                </td>
                <td className="px-8 py-5 text-right text-xs text-slate-500 font-medium">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BatchTab = () => {
  const handleDownload = (batch: any) => {
    const csvContent = "DATE,INST_CODE,TX_COUNT,GROSS_VOL,TOTAL_FEE,BANK_SHARE,EPAY_SHARE\n" + 
                       `${batch.date},XYZ_INST_99,${batch.count},${(batch.count * 150000).toFixed(2)},${(batch.count * 2500).toFixed(2)},${(batch.count * 1750).toFixed(2)},${(batch.count * 750).toFixed(2)}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Settlement_Billing_${batch.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Batch Operations</h3>
          <p className="text-slate-500 font-medium mt-1">Bulk VA creation and settlement processing.</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"><Plus size={16} /> New Batch</button>
      </div>
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Filename</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Count</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {BATCH_HISTORY.map(it => (
              <tr key={it.id} className="hover:bg-slate-50">
                <td className="px-8 py-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      <div><p className="font-black text-slate-800">{it.name}</p><p className="text-[10px] font-mono text-slate-400">{it.id}</p></div>
                    </div>
                    {it.status === 'COMPLETED' && (
                      <button onClick={() => handleDownload(it)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase flex items-center gap-2">
                        <Download size={14} /> Download
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase ${
                    it.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : it.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{it.status === 'PROCESSING' && <Loader2 size={10} className="inline mr-1 animate-spin" />}{it.status}</span>
                </td>
                <td className="px-8 py-6 text-center font-black text-slate-800">{it.count}</td>
                <td className="px-8 py-6 text-right text-slate-500 font-bold">{it.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExceptionTab = () => {
  const { t } = useI18n();
  const [exceptions, setExceptions] = useState(EXCEPTIONS.map(e => ({ ...e, resolved: false })));
  const [resolving, setResolving] = useState(false);

  const handleResolveAll = () => {
    setResolving(true);
    setTimeout(() => {
      setExceptions(prev => prev.map(e => ({ ...e, resolved: true, status: 'RESOLVED' })));
      setResolving(false);
    }, 2000);
  };

  const handleResolveSingle = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, resolved: true, status: 'RESOLVED' } : e));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-[28px] flex items-center justify-center text-amber-500 shadow-sm"><ShieldAlert size={32} /></div>
            <div>
               <h3 className="text-2xl font-black text-amber-900 tracking-tight">{t('tx.exception_mgmt')}</h3>
               <p className="text-amber-700 font-medium">Sentinel flagged {exceptions.filter(e => !e.resolved).length} anomalies requiring appropriation.</p>
            </div>
         </div>
         <button 
           onClick={handleResolveAll}
           disabled={resolving || exceptions.every(e => e.resolved)}
           className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 ${
             exceptions.every(e => e.resolved) ? 'bg-emerald-500 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'
           }`}
         >
            {resolving ? <RefreshCw size={16} className="animate-spin" /> : exceptions.every(e => e.resolved) ? <Check size={16} /> : <Zap size={16} />}
            {exceptions.every(e => e.resolved) ? 'All Resolved' : t('tx.resolve_all')}
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {exceptions.map(ex => (
           <div key={ex.id} className={`bg-white p-8 rounded-[40px] border shadow-sm flex items-center justify-between group transition-all ${
             ex.resolved ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-amber-500'
           }`}>
              <div className="flex items-center gap-8">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
                   ex.resolved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'
                 }`}>
                    {ex.resolved ? <CheckCircle2 size={24} /> : ex.error.charAt(0)}
                 </div>
                 <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${ex.resolved ? 'text-emerald-500' : 'text-red-500'}`}>
                      {ex.resolved ? 'RESOLVED' : ex.error.replace('_', ' ')}
                    </p>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">Rp {ex.amount.toLocaleString()} Inbound</h4>
                    <p className="text-xs text-slate-400 font-bold">VA: {ex.va} • {ex.date}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                 {!ex.resolved && (
                   <>
                     <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended</p>
                       <p className="text-xs font-bold text-slate-700">Appropriate to Suspense Pool</p>
                     </div>
                     <button onClick={() => handleResolveSingle(ex.id)} className="p-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                        <ArrowRight size={20} />
                     </button>
                   </>
                 )}
                 {ex.resolved && (
                   <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">Cleared</span>
                 )}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

// --- Main Module ---

export default function VaTransactionsModule() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'inquiry';

  const TABS = [
    { id: 'inquiry', label: t('tx.inquiry'), icon: Search },
    { id: 'transactions', label: t('tx.all'), icon: List },
    { id: 'batch', label: t('tx.batch'), icon: Layers },
    { id: 'exceptions', label: t('tx.exceptions'), icon: ShieldAlert },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{t('tx.live_rails')}</div>
          </div>
           <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-none">{t('tx.title')}</h1>
           <p className="text-slate-500 text-xl max-w-2xl font-medium">{t('tx.subtitle')}</p>
        </div>

        <div className="flex bg-white p-2 rounded-[40px] border border-slate-200 shadow-xl overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setSearchParams({ tab: tab.id })} 
              className={`flex items-center gap-3 px-8 py-5 rounded-[30px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'text-slate-400 hover:text-slate-800'}`}>
              <tab.icon size={18} />{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {activeTab === 'inquiry' && <InquiryTab />}
        {activeTab === 'transactions' && <TransactionListTab />}
        {activeTab === 'batch' && <BatchTab />}
        {activeTab === 'exceptions' && <ExceptionTab />}
      </div>
    </div>
  );
}
