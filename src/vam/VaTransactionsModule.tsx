
import React, { useState, useMemo } from 'react';
import { useI18n } from './i18n';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Plus, 
  Zap,
  Layers,
  FileText,
  Loader2,
  RefreshCw,
  ShieldAlert,
  X,
  FileSearch,
  Printer,
  List,
  Check,
  UserCheck,
  Clock
} from 'lucide-react';

// --- Mock Data ---

const MOCK_ALL_TRANSACTIONS = [
  { id: 'TXN-20260305-001', client: 'PT. Hasjrat Abadi', va: '88001123456', sender: 'Budiono Siregar', amount: 500000, status: 'SUCCESS', date: '2026-03-05 14:20' },
  { id: 'TXN-20260305-002', client: 'Xendit Group', va: '88001123457', sender: 'Siti Aminah', amount: 1000000, status: 'SUCCESS', date: '2026-03-04 09:10' },
  { id: 'TXN-20260305-003', client: 'PT. Flip Indonesia', va: '88041001001', sender: 'Andi Wijaya', amount: 2500000, status: 'SUCCESS', date: '2026-03-05 11:30' },
  { id: 'TXN-20260305-004', client: 'Modalku Financial', va: '88001777888', sender: 'System Admin', amount: 12500000, status: 'FAILED', date: '2026-02-15 10:00' },
  { id: 'TXN-20260305-005', client: 'PT. Dana Indonesia', va: '88042000101', sender: 'PT. Maju Bersama', amount: 750000, status: 'SUCCESS', date: '2026-03-05 16:45' },
  { id: 'TXN-20260305-006', client: 'OVO (Visionet)', va: '88001123456', sender: 'Dewi Sartika', amount: 150000, status: 'PENDING', date: '2026-03-05 17:00' },
  { id: 'TXN-20260305-007', client: 'GoPay (Tokopedia)', va: '88041001002', sender: 'Budi Santoso', amount: 3200000, status: 'SUCCESS', date: '2026-03-04 08:15' },
  { id: 'TXN-20260305-008', client: 'ShopeePay Digital', va: '88042000201', sender: 'PT. Global Corp', amount: 45000000, status: 'SUCCESS', date: '2026-03-03 14:00' },
  { id: 'TXN-20260305-009', client: 'PT. Akulaku Silvrr', va: '88051001001', sender: 'Rizky Pratama', amount: 2800000, status: 'SUCCESS', date: '2026-03-05 10:30' },
  { id: 'TXN-20260305-010', client: 'LinkAja (Fintek)', va: '88051002003', sender: 'Lina Susanti', amount: 890000, status: 'PENDING', date: '2026-03-05 18:20' },
  { id: 'TXN-20260305-011', client: 'Kredivo Group', va: '88061001001', sender: 'Hendra Gunawan', amount: 1750000, status: 'SUCCESS', date: '2026-03-05 09:15' },
  { id: 'TXN-20260305-012', client: 'PT. Bukalapak', va: '88061002004', sender: 'Agus Setiawan', amount: 650000, status: 'FAILED', date: '2026-03-04 16:40' },
  { id: 'TXN-20260305-013', client: 'Blibli (Global Digital)', va: '88071001002', sender: 'Maya Anggraini', amount: 4200000, status: 'SUCCESS', date: '2026-03-05 12:00' },
  { id: 'TXN-20260305-014', client: 'PT. Traveloka', va: '88071003001', sender: 'Dian Purnama', amount: 320000, status: 'SUCCESS', date: '2026-03-05 13:45' },
  { id: 'TXN-20260305-015', client: 'Astra Financial', va: '88081001001', sender: 'Wahyu Hidayat', amount: 5600000, status: 'SUCCESS', date: '2026-03-04 11:20' },
  { id: 'TXN-20260305-016', client: 'PT. Pegadaian', va: '88081002001', sender: 'Fitri Rahayu', amount: 1250000, status: 'PENDING', date: '2026-03-05 19:00' },
  { id: 'TXN-20260305-017', client: 'Mandiri Sekuritas', va: '88091001001', sender: 'PT. Sentosa Jaya', amount: 18500000, status: 'SUCCESS', date: '2026-03-03 10:00' },
  { id: 'TXN-20260305-018', client: 'PT. Indosat Ooredoo', va: '88091002001', sender: 'Bambang Suryadi', amount: 950000, status: 'SUCCESS', date: '2026-03-05 15:30' },
  { id: 'TXN-20260305-019', client: 'Telkomsel (T-Money)', va: '88101001001', sender: 'Indra Kusuma', amount: 7800000, status: 'SUCCESS', date: '2026-03-04 14:50' },
  { id: 'TXN-20260305-020', client: 'PT. Prudential Life', va: '88101002003', sender: 'Rini Wulandari', amount: 2100000, status: 'FAILED', date: '2026-03-05 08:30' },
];

const BATCH_HISTORY = [
  { id: 'BCH-1001', name: 'Hasjrat_Abadi_Settlement_Mar05.csv', status: 'COMPLETED', count: 3420, totalAmount: 513000000, successRate: 99.7, feeCollected: 8550000, client: 'PT. Hasjrat Abadi', date: '2026-03-05' },
  { id: 'BCH-1000', name: 'Xendit_VA_Bulk_Creation_Mar05.csv', status: 'COMPLETED', count: 2180, totalAmount: 327000000, successRate: 99.2, feeCollected: 5450000, client: 'Xendit Group', date: '2026-03-05' },
  { id: 'BCH-999', name: 'Flip_Refund_Batch_Mar05.csv', status: 'PROCESSING', count: 890, totalAmount: 133500000, successRate: 0, feeCollected: 0, client: 'PT. Flip Indonesia', date: '2026-03-05' },
  { id: 'BCH-998', name: 'Modalku_Disbursement_Mar04.csv', status: 'COMPLETED', count: 1560, totalAmount: 234000000, successRate: 98.9, feeCollected: 3900000, client: 'Modalku Financial', date: '2026-03-04' },
  { id: 'BCH-997', name: 'Dana_TopUp_VA_Mar04.csv', status: 'COMPLETED', count: 4200, totalAmount: 630000000, successRate: 99.8, feeCollected: 10500000, client: 'PT. Dana Indonesia', date: '2026-03-04' },
  { id: 'BCH-996', name: 'OVO_Settlement_Clearing_Mar04.csv', status: 'COMPLETED', count: 2890, totalAmount: 433500000, successRate: 99.5, feeCollected: 7225000, client: 'OVO (Visionet)', date: '2026-03-04' },
  { id: 'BCH-995', name: 'GoPay_Merchant_Payout_Mar03.csv', status: 'COMPLETED', count: 1840, totalAmount: 276000000, successRate: 99.1, feeCollected: 4600000, client: 'GoPay (Tokopedia)', date: '2026-03-03' },
  { id: 'BCH-994', name: 'ShopeePay_Cashback_Dist_Mar03.csv', status: 'FAILED', count: 420, totalAmount: 63000000, successRate: 0, feeCollected: 0, client: 'ShopeePay Digital', date: '2026-03-03' },
  { id: 'BCH-993', name: 'Akulaku_BNPL_Collection_Mar03.csv', status: 'COMPLETED', count: 3100, totalAmount: 465000000, successRate: 97.8, feeCollected: 7750000, client: 'PT. Akulaku Silvrr', date: '2026-03-03' },
  { id: 'BCH-992', name: 'LinkAja_Mass_Transfer_Mar02.csv', status: 'COMPLETED', count: 1280, totalAmount: 192000000, successRate: 99.6, feeCollected: 3200000, client: 'LinkAja (Fintek)', date: '2026-03-02' },
  { id: 'BCH-991', name: 'Kredivo_Installment_Mar02.csv', status: 'COMPLETED', count: 2450, totalAmount: 367500000, successRate: 98.5, feeCollected: 6125000, client: 'Kredivo Group', date: '2026-03-02' },
  { id: 'BCH-990', name: 'Bukalapak_Seller_Payout_Mar01.csv', status: 'COMPLETED', count: 980, totalAmount: 147000000, successRate: 99.9, feeCollected: 2450000, client: 'PT. Bukalapak', date: '2026-03-01' },
];

const EXCEPTIONS = [
  { id: 'EX-001', va: '88001...999', amount: 1250000, error: 'SIGNATURE_MISMATCH', date: '2026-03-05 16:10', status: 'UNAPPROPRIATED' },
  { id: 'EX-002', va: 'Unknown', amount: 450000, error: 'MOTHER_ACC_CLOSED', date: '2026-03-05 16:15', status: 'FAILED' },
  { id: 'EX-003', va: '88041...001', amount: 500000, error: 'AMOUNT_UNDER_MINIMUM', date: '2026-03-05 15:45', status: 'PENDING' },
];

// Approver state for transactions
interface ApprovalItem {
  id: string;
  type: string;
  description: string;
  amount: number;
  submittedBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// --- Sub-Components ---

const TransactionDetailOverlay = ({ tx, onClose }: { tx: any; onClose: () => void }) => {
  if (!tx) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card dark:bg-slate-900 w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-transparent dark:border-slate-800" onClick={(e) => e.stopPropagation()}>

        <div className={`p-10 text-white relative ${tx.status === 'SUCCESS' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-all"><X size={20} /></button>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card/20 rounded-lg"><ShieldCheck size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Dozn Global Core Receipt</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-black tracking-tighter">Rp {tx.amount?.toLocaleString()}</p>
              <p className="text-xs font-bold opacity-80">{tx.status === 'SUCCESS' ? 'Transaction Settled Successfully' : 'Transaction Failed'}</p>
            </div>
          </div>
          <div className="absolute -bottom-3 left-0 right-0 flex justify-around px-4">
             {Array.from({ length: 15 }).map((_, i) => (<div key={i} className="w-6 h-6 rounded-full bg-card"></div>))}
          </div>
        </div>
        <div className="p-10 pt-12 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sender</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">{tx.sender || 'Anonymous'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{tx.client || 'Unknown'}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">VA Number</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">{tx.va}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{tx.date}</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] space-y-4 border border-slate-100 dark:border-slate-700/50">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client</span>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">{tx.client}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Reference</span>
                <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200">{tx.id}</span>
             </div>
          </div>
          <div className="flex gap-4 pt-4">
             <button className="flex-1 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"><Printer size={16} /> Print</button>
             <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"><FileSearch size={16} /> Trace</button>
          </div>

        </div>
      </div>
    </div>
  );
};

const TransactionListTab = () => {
  const { t } = useI18n();
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    let result = MOCK_ALL_TRANSACTIONS;
    if (filterStatus !== 'ALL') result = result.filter(tx => tx.status === filterStatus);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.id.toLowerCase().includes(term) || 
        tx.client.toLowerCase().includes(term) || 
        tx.va.includes(term) || 
        tx.sender.toLowerCase().includes(term)
      );
    }
    return result;
  }, [filterStatus, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {selectedTx && <TransactionDetailOverlay tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{t('tx.all')}</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{t('tx.all_desc')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2.5 bg-card dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:border-blue-500 w-64 dark:text-slate-200 transition-all"
            />
          </div>
          <div className="flex bg-card dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
            {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
              >{s}</button>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-card dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-left">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.reference')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.client')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.va_number')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.sender')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('tx.amount')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.status')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('tx.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-all">

            {filtered.map(tx => (
              <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group uppercase">
                <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{tx.id}</td>
                <td className="px-6 py-4">
                  <p className="font-black text-slate-800 dark:text-slate-100 text-xs">{tx.client}</p>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{tx.va}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300">{tx.sender}</td>
                <td className="px-6 py-4 font-black text-slate-800 dark:text-slate-100 text-right">Rp {tx.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                    tx.status === 'SUCCESS' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : tx.status === 'FAILED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>{tx.status}</span>
                </td>
                <td className="px-6 py-4 text-right text-xs text-slate-500 dark:text-slate-500 font-medium">{tx.date}</td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

const BatchTab = () => {
  const { t } = useI18n();
  const [approvalQueue, setApprovalQueue] = useState<ApprovalItem[]>([
    { id: 'BA-001', type: 'BATCH_RELEASE', description: 'ShopeePay_Cashback_Dist_Mar03.csv — Retry failed batch', amount: 63000000, submittedBy: 'Operator A', status: 'PENDING' },
  ]);

  const handleApproveBatch = (id: string) => {
    setApprovalQueue(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
  };

  const handleDownload = (batch: any) => {
    const csvContent = "DATE,INST_CODE,CLIENT,TX_COUNT,GROSS_VOL,TOTAL_FEE,SUCCESS_RATE\n" + 
                       `${batch.date},XYZ_INST_99,${batch.client},${batch.count},${batch.totalAmount},${batch.feeCollected},${batch.successRate}%`;
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
      {/* Approver Queue */}
      {approvalQueue.some(a => a.status === 'PENDING') && (
        <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-[32px] border border-amber-100 dark:border-amber-900/30 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck size={20} className="text-amber-600 dark:text-amber-400" />
            <h4 className="text-sm font-black text-amber-900 dark:text-amber-100 uppercase tracking-widest">{t('approver.title')}</h4>
          </div>
          {approvalQueue.filter(a => a.status === 'PENDING').map(item => (
            <div key={item.id} className="bg-card dark:bg-slate-900/60 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-black text-slate-800 dark:text-slate-100 text-sm">{item.description}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('approver.submitted_by')}: {item.submittedBy} • Rp {item.amount.toLocaleString()}</p>
              </div>
              <button onClick={() => handleApproveBatch(item.id)} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                {t('approver.approve')}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">{t('tx.batch')}</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{t('tx.batch_desc')}</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center gap-2 hover:scale-105 transition-all"><Plus size={16} /> {t('tx.new_batch')}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.count')}</p>
          <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{BATCH_HISTORY.reduce((a, b) => a + b.count, 0).toLocaleString()}</p>
          <p className="text-xs text-emerald-500 font-bold mt-1 uppercase">Total Records</p>
        </div>
        <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.total_amount')}</p>
          <p className="text-3xl font-black text-slate-800 dark:text-slate-100">Rp {(BATCH_HISTORY.reduce((a, b) => a + b.totalAmount, 0) / 1000000000).toFixed(1)}B</p>
        </div>
        <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.success_rate')}</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">99.2%</p>
        </div>
        <div className="bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.fee_collected')}</p>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">Rp {(BATCH_HISTORY.reduce((a, b) => a + b.feeCollected, 0) / 1000000).toFixed(0)}M</p>
        </div>
      </div>

      <div className="bg-card dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-left">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.filename')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.client')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.status')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">{t('tx.count')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('tx.total_amount')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('tx.fee_collected')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">{t('tx.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-all">

            {BATCH_HISTORY.map(it => (
              <tr key={it.id} className="hover:bg-slate-50">
                <td className="px-6 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-400" />
                      <div><p className="font-black text-slate-800 text-xs">{it.name}</p><p className="text-[9px] font-mono text-slate-400">{it.id}</p></div>
                    </div>
                    {it.status === 'COMPLETED' && (
                      <button onClick={() => handleDownload(it)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase flex items-center gap-1">
                        <Download size={12} /> {t('tx.download')}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-700">{it.client}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                    it.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : it.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{it.status === 'PROCESSING' && <Loader2 size={10} className="inline mr-1 animate-spin" />}{it.status}</span>
                </td>
                <td className="px-6 py-5 text-center font-black text-slate-800 text-xs">{it.count.toLocaleString()}</td>
                <td className="px-6 py-5 text-right font-bold text-slate-700 text-xs">Rp {(it.totalAmount / 1000000).toFixed(0)}M</td>
                <td className="px-6 py-5 text-right text-xs font-bold text-emerald-600">{it.feeCollected > 0 ? `Rp ${(it.feeCollected / 1000000).toFixed(1)}M` : '---'}</td>
                <td className="px-6 py-5 text-right text-slate-500 font-bold text-xs">{it.date}</td>
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
      <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-[40px] border border-amber-100 dark:border-amber-900/30 flex items-center justify-between transition-all duration-300">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-card dark:bg-slate-900 rounded-[28px] flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-sm border border-transparent dark:border-amber-900/30"><ShieldAlert size={32} /></div>
            <div>
               <h3 className="text-2xl font-black text-amber-900 dark:text-amber-100 tracking-tight">{t('tx.exception_mgmt')}</h3>
               <p className="text-amber-700 dark:text-amber-400/80 font-medium">Sentinel flagged {exceptions.filter(e => !e.resolved).length} anomalies requiring appropriation.</p>
            </div>
         </div>
         <button 
           onClick={handleResolveAll}
           disabled={resolving || exceptions.every(e => e.resolved)}
           className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 ${
             exceptions.every(e => e.resolved) ? 'bg-emerald-500 text-white' : 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600/80 dark:hover:bg-amber-600'
           }`}
         >
            {resolving ? <RefreshCw size={16} className="animate-spin" /> : exceptions.every(e => e.resolved) ? <Check size={16} /> : <Zap size={16} />}
            {exceptions.every(e => e.resolved) ? t('tx.all_resolved') : t('tx.resolve_all')}
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {exceptions.map(ex => (
           <div key={ex.id} className={`bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[40px] border shadow-sm flex items-center justify-between group transition-all duration-300 ${
             ex.resolved ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400'
           }`}>
              <div className="flex items-center gap-8">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                   ex.resolved ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-transparent dark:border-slate-700'
                 }`}>
                    {ex.resolved ? <CheckCircle2 size={24} /> : ex.error.charAt(0)}
                 </div>
                 <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${ex.resolved ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {ex.resolved ? 'RESOLVED' : ex.error.replace('_', ' ')}
                    </p>
                    <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Rp {ex.amount.toLocaleString()} {t('tx.inbound')}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">VA: {ex.va} • {ex.date}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                 {!ex.resolved && (
                   <>
                     <div className="text-right hidden md:block">
                       <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('tx.recommended')}</p>
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('tx.appropriate_suspense')}</p>
                     </div>
                     <button onClick={() => handleResolveSingle(ex.id)} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all">
                        <ArrowRight size={20} />
                     </button>
                   </>
                 )}
                 {ex.resolved && (
                   <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">{t('tx.cleared')}</span>
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
  const activeTab = searchParams.get('tab') || 'transactions';

  const TABS = [
    { id: 'transactions', label: t('tx.all'), icon: List },
    { id: 'batch', label: t('tx.batch'), icon: Layers },
    { id: 'exceptions', label: t('tx.exceptions'), icon: ShieldAlert },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">{t('tx.live_rails')}</div>
          </div>
           <h1 className="text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter leading-none">{t('tx.title')}</h1>
           <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl font-medium">{t('tx.subtitle')}</p>
        </div>

        <div className="flex bg-card/50 dark:bg-slate-900/40 p-2 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl overflow-x-auto no-scrollbar transition-all duration-300">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setSearchParams({ tab: tab.id })} 
              className={`flex items-center gap-3 px-8 py-5 rounded-[30px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20' : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
              <tab.icon size={18} />{tab.label}
            </button>
          ))}
        </div>
      </div>


      <div className="pt-4">
        {activeTab === 'transactions' && <TransactionListTab />}
        {activeTab === 'batch' && <BatchTab />}
        {activeTab === 'exceptions' && <ExceptionTab />}
      </div>
    </div>
  );
}
