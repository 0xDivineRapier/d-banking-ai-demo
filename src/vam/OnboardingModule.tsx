
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useI18n } from './i18n';
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Globe,
  Database,
  CreditCard, 
  Zap, 
  ArrowRight, 
  DollarSign, 
  Layers,
  Trash2, 
  RefreshCw, 
  Fingerprint, 
  ShieldAlert, 
  LayoutGrid, 
  Sparkles, 
  ArrowLeft, 
  Scan, 
  ShieldHalf, 
  FileCheck2, 
  Wallet,
  X,
  Building,
  Send,
  Loader2,
  BrainCircuit,
  Activity,
  Key,
  Lock,
  ExternalLink,
  ChevronDown,
  MoreVertical,
  Check,
  FileUp,
  UploadCloud,
  UserCheck,
  Shield
} from 'lucide-react';
import { OnboardingService, CorporateProfile, LimitConfig } from './OnboardingService';
import { OnboardingAgent, ExtractedCorporateData } from './OnboardingAgent';
import { CredentialManager } from './CredentialManager';

// --- Shared Corporate Client Data (same as Operations) ---
const CORPORATE_CLIENTS_DATA = [
  { name: 'PT. Hasjrat Abadi', code: 'HSJ', connection: 'H2H-SOCKET', vol24h: 14820, txMonth: 128450, fee: 385350000, cashback: 19267500, status: 'ACTIVE', va_prefix: '88001', risk_score: 12, industry: 'Automotive', cif: 'CIF-1001' },
  { name: 'Xendit Group', code: 'XND', connection: 'REST-API', vol24h: 9240, txMonth: 89210, fee: 267630000, cashback: 13381500, status: 'ACTIVE', va_prefix: '88002', risk_score: 5, industry: 'Fintech', cif: 'CIF-2002' },
  { name: 'PT. Flip Indonesia', code: 'FLP', connection: 'REST-API', vol24h: 7650, txMonth: 72340, fee: 217020000, cashback: 10851000, status: 'ACTIVE', va_prefix: '88041', risk_score: 8, industry: 'Fintech', cif: 'CIF-3003' },
  { name: 'Modalku Financial', code: 'MDK', connection: 'H2H-SOCKET', vol24h: 6890, txMonth: 61200, fee: 183600000, cashback: 9180000, status: 'ACTIVE', va_prefix: '88042', risk_score: 15, industry: 'P2P Lending', cif: 'CIF-4004' },
  { name: 'PT. Dana Indonesia', code: 'DNA', connection: 'REST-API', vol24h: 5430, txMonth: 52180, fee: 156540000, cashback: 7827000, status: 'ACTIVE', va_prefix: '88043', risk_score: 6, industry: 'E-Wallet', cif: 'CIF-5005' },
  { name: 'OVO (Visionet)', code: 'OVO', connection: 'REST-API', vol24h: 4980, txMonth: 48920, fee: 146760000, cashback: 7338000, status: 'ACTIVE', va_prefix: '88044', risk_score: 4, industry: 'E-Wallet', cif: 'CIF-6006' },
  { name: 'GoPay (Tokopedia)', code: 'GPY', connection: 'H2H-SOCKET', vol24h: 4210, txMonth: 41500, fee: 124500000, cashback: 6225000, status: 'ACTIVE', va_prefix: '88051', risk_score: 7, industry: 'E-Commerce', cif: 'CIF-7007' },
  { name: 'ShopeePay Digital', code: 'SPD', connection: 'REST-API', vol24h: 3890, txMonth: 38900, fee: 116700000, cashback: 5835000, status: 'ACTIVE', va_prefix: '88052', risk_score: 9, industry: 'E-Commerce', cif: 'CIF-8008' },
  { name: 'PT. Akulaku Silvrr', code: 'AKU', connection: 'REST-API', vol24h: 3450, txMonth: 34500, fee: 103500000, cashback: 5175000, status: 'ACTIVE', va_prefix: '88061', risk_score: 18, industry: 'BNPL', cif: 'CIF-9009' },
  { name: 'LinkAja (Fintek)', code: 'LKA', connection: 'H2H-SOCKET', vol24h: 2980, txMonth: 28400, fee: 85200000, cashback: 4260000, status: 'ACTIVE', va_prefix: '88062', risk_score: 5, industry: 'E-Wallet', cif: 'CIF-1010' },
  { name: 'Kredivo Group', code: 'KRD', connection: 'REST-API', vol24h: 2750, txMonth: 26100, fee: 78300000, cashback: 3915000, status: 'ACTIVE', va_prefix: '88071', risk_score: 22, industry: 'BNPL', cif: 'CIF-1111' },
  { name: 'PT. Bukalapak', code: 'BKL', connection: 'REST-API', vol24h: 2340, txMonth: 22800, fee: 68400000, cashback: 3420000, status: 'ACTIVE', va_prefix: '88072', risk_score: 3, industry: 'E-Commerce', cif: 'CIF-1212' },
  { name: 'Blibli (Global Digital)', code: 'BLB', connection: 'H2H-SOCKET', vol24h: 2100, txMonth: 19500, fee: 58500000, cashback: 2925000, status: 'ACTIVE', va_prefix: '88081', risk_score: 4, industry: 'E-Commerce', cif: 'CIF-1313' },
  { name: 'PT. Traveloka', code: 'TVK', connection: 'REST-API', vol24h: 1890, txMonth: 17800, fee: 53400000, cashback: 2670000, status: 'ACTIVE', va_prefix: '88082', risk_score: 6, industry: 'Travel', cif: 'CIF-1414' },
  { name: 'Astra Financial', code: 'ASF', connection: 'H2H-SOCKET', vol24h: 1650, txMonth: 15200, fee: 45600000, cashback: 2280000, status: 'ACTIVE', va_prefix: '88091', risk_score: 2, industry: 'Multi-Finance', cif: 'CIF-1515' },
  { name: 'PT. Pegadaian', code: 'PGD', connection: 'REST-API', vol24h: 1420, txMonth: 13100, fee: 39300000, cashback: 1965000, status: 'ACTIVE', va_prefix: '88092', risk_score: 3, industry: 'Pawnshop', cif: 'CIF-1616' },
  { name: 'Mandiri Sekuritas', code: 'MDS', connection: 'H2H-SOCKET', vol24h: 1280, txMonth: 11800, fee: 35400000, cashback: 1770000, status: 'ACTIVE', va_prefix: '88101', risk_score: 1, industry: 'Securities', cif: 'CIF-1717' },
  { name: 'PT. Indosat Ooredoo', code: 'IDS', connection: 'REST-API', vol24h: 1100, txMonth: 10200, fee: 30600000, cashback: 1530000, status: 'ACTIVE', va_prefix: '88102', risk_score: 4, industry: 'Telco', cif: 'CIF-1818' },
  { name: 'Telkomsel (T-Money)', code: 'TKS', connection: 'H2H-SOCKET', vol24h: 980, txMonth: 9400, fee: 28200000, cashback: 1410000, status: 'ACTIVE', va_prefix: '88103', risk_score: 3, industry: 'Telco', cif: 'CIF-1919' },
  { name: 'PT. Prudential Life', code: 'PRU', connection: 'REST-API', vol24h: 870, txMonth: 8200, fee: 24600000, cashback: 1230000, status: 'ACTIVE', va_prefix: '88104', risk_score: 2, industry: 'Insurance', cif: 'CIF-2020' },
];

interface OnboardingApplication {
  id: string;
  cif: string;
  merchant_name: string;
  industry: string;
  status: 'DRAFT' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING_APPROVAL';
  applied_at: string;
  type: 'AUTO' | 'MANUAL';
  risk_score: number;
  va_prefix?: string;
  ips?: string[];
  connection?: string;
  txMonth?: number;
  fee?: number;
  cashback?: number;
  documents: { type: string; status: 'VERIFIED' | 'PENDING' | 'REJECTED' }[];
  approver?: string;
  approval_date?: string;
}

// Build initial applications from corporate client data
const INITIAL_APPLICATIONS: OnboardingApplication[] = CORPORATE_CLIENTS_DATA.map((client, i) => ({
  id: `APP-${String(i + 1).padStart(3, '0')}`,
  cif: client.cif,
  merchant_name: client.name,
  industry: client.industry,
  status: 'APPROVED' as const,
  applied_at: '2026-03-05',
  type: 'AUTO' as const,
  risk_score: client.risk_score,
  va_prefix: client.va_prefix,
  ips: ['10.94.1.25', '10.94.1.26'],
  connection: client.connection,
  txMonth: client.txMonth,
  fee: client.fee,
  cashback: client.cashback,
  documents: [
    { type: 'NIB', status: 'VERIFIED' as const },
    { type: 'NPWP', status: 'VERIFIED' as const },
    { type: 'Deed', status: 'VERIFIED' as const }
  ],
  approver: 'Kim Seung-ho',
  approval_date: '2026-03-04',
}));

// --- Approver Panel ---
const ApproverPanel = ({ applications, onApprove, onReject }: { applications: OnboardingApplication[], onApprove: (id: string) => void, onReject: (id: string) => void }) => {
  const { t } = useI18n();
  const pendingApps = applications.filter(a => a.status === 'PENDING_APPROVAL');
  
  if (pendingApps.length === 0) return null;
  
  return (
    <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 mb-8 animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">{t('approver.title')}</h4>
            <p className="text-[10px] text-amber-600 font-bold">{pendingApps.length} {t('approver.queue')}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {pendingApps.map(app => (
          <div key={app.id} className="bg-white p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center font-black text-amber-600 text-sm">{app.merchant_name.charAt(0)}</div>
              <div>
                <p className="font-black text-slate-800 text-sm">{app.merchant_name}</p>
                <p className="text-[10px] text-slate-400 font-bold">{app.industry} • {app.cif}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onReject(app.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                {t('approver.reject')}
              </button>
              <button onClick={() => onApprove(app.id)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                {t('approver.approve')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function OnboardingModule() {
  const { t } = useI18n();
  const [activeView, setActiveView] = useState<'LIST' | 'WIZARD' | 'MANAGE'>('LIST');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form & Wizard State
  const [step, setStep] = useState(1);
  const [onboardingType, setOnboardingType] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [cifInput, setCifInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCsvProcessing, setIsCsvProcessing] = useState(false);
  const [corporateData, setCorporateData] = useState<Partial<CorporateProfile>>({
    cif_name: '',
    legal_id: '',
    corporate_address: '',
    phone: '',
  });
  const [industry, setIndustry] = useState('General');
  const [limitConfig, setLimitConfig] = useState<LimitConfig>({ 
    daily_transfer_limit: 5_000_000_000, 
    per_transaction_limit: 100_000_000 
  });
  const [ips, setIps] = useState<string[]>(['10.94.1.25']);
  const [newIp, setNewIp] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({ nib: false, npwp: false, deed: false });

  // AI Copilot State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Ready to onboard corporate clients. Paste details or document scans, and I will automate the registration.' },
    { role: 'ai', content: '💡 Recommendation: Connect to ChatHub to enable one-step onboarding. This allows corporate clients to submit their registration data directly through the chat interface, auto-populating the registry and triggering KYB verification instantly.' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiAgent = useRef(new OnboardingAgent());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  
  const filteredMerchants = useMemo(() => {
    return applications.filter(m => 
      m.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) || m.cif.includes(searchTerm)
    );
  }, [searchTerm, applications]);

  const selectedMerchant = useMemo(() => 
    applications.find(m => m.id === selectedMerchantId),
  [selectedMerchantId, applications]);

  const handleApprove = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' as const, approver: 'Kim Seung-ho', approval_date: new Date().toISOString().split('T')[0] } : a));
  };

  const handleReject = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' as const, approver: 'Kim Seung-ho' } : a));
  };

  const handleCifSync = async () => {
    if (!cifInput) return;
    setIsSyncing(true);
    try {
      const profile = await OnboardingService.fetch_corporate_profile(cifInput);
      setCorporateData(profile);
      setOnboardingType('AUTO');
    } catch (e) {
      alert("CIF not found. Continuing in manual mode.");
      setOnboardingType('MANUAL');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCsvProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      if (rows.length < 2) { alert("Invalid CSV format."); setIsCsvProcessing(false); return; }
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const data = rows[1].split(',').map(v => v.trim());
      const mapped: any = {};
      headers.forEach((h, i) => mapped[h] = data[i]);
      setTimeout(() => {
        setCorporateData({ cif_name: mapped.name || mapped.merchant_name || '', legal_id: mapped.tax_id || mapped.npwp || '', corporate_address: mapped.address || '', phone: mapped.phone || '' });
        if (mapped.cif) { setCifInput(mapped.cif); setOnboardingType('AUTO'); } else { setOnboardingType('MANUAL'); }
        if (mapped.industry) setIndustry(mapped.industry);
        if (mapped.ip_whitelist) setIps(mapped.ip_whitelist.split(';'));
        setIsCsvProcessing(false);
        setChatMessages(prev => [...prev, { role: 'ai', content: `Bulk Import Successful: Parsed details for "${mapped.name || 'New Client'}". Populated Legal Profile and Technical Rails.` }]);
      }, 1200);
    };
    reader.readAsText(file);
  };

  const handleAddIp = () => {
    if (OnboardingService.validate_ip(newIp)) { setIps([...ips, newIp]); setNewIp(''); }
  };

  const startNewOnboarding = () => {
    setActiveView('WIZARD');
    setStep(1);
    setSelectedMerchantId(null);
    setCorporateData({ cif_name: '', legal_id: '', corporate_address: '' });
    setUploadedDocs({ nib: false, npwp: false, deed: false });
    setIsAiPanelOpen(true);
  };

  const handleSubmitApplication = () => {
    const newApp: OnboardingApplication = {
      id: `APP-${String(applications.length + 1).padStart(3, '0')}`,
      cif: cifInput || `CIF-NEW-${Date.now()}`,
      merchant_name: corporateData.cif_name || 'New Corporate Client',
      industry: industry,
      status: 'PENDING_APPROVAL',
      applied_at: new Date().toISOString().split('T')[0],
      type: onboardingType,
      risk_score: Math.floor(Math.random() * 25),
      va_prefix: industry === 'E-Commerce' ? '88041' : '88042',
      documents: Object.entries(uploadedDocs).filter(([_, v]) => v).map(([k]) => ({ type: k.toUpperCase(), status: 'PENDING' as const })),
    };
    setApplications(prev => [newApp, ...prev]);
    setActiveView('LIST');
  };

  const handleAiChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsAiLoading(true);
    try {
      const { updatedData, aiResponse } = await aiAgent.current.processOnboardingChat(userMsg, corporateData);
      setCorporateData(prev => ({ ...prev, cif_name: updatedData.cif_name || prev.cif_name, legal_id: updatedData.legal_id || prev.legal_id, corporate_address: updatedData.corporate_address || prev.corporate_address }));
      if (updatedData.industry) setIndustry(updatedData.industry);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble syncing. Please verify the fields manually." }]);
    } finally { setIsAiLoading(false); }
  };

  const handleFileUpload = async (docId: string, file: File) => {
    if (!file) return;
    setIsAiLoading(true);
    setUploadedDocs(prev => ({ ...prev, [docId]: true }));
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const extracted = await aiAgent.current.processDocumentScan(base64, file.type);
        setCorporateData(prev => ({ ...prev, cif_name: extracted.cif_name || prev.cif_name, legal_id: extracted.legal_id || prev.legal_id, corporate_address: extracted.corporate_address || prev.corporate_address }));
        setChatMessages(prev => [...prev, { role: 'ai', content: `AI Vision: Detected ${docId.toUpperCase()} for "${extracted.cif_name}". Synced to Registry.` }]);
      } catch (err) { console.error(err); } finally { setIsAiLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  // Views
  const MerchantListView = () => (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <ApproverPanel applications={applications} onApprove={handleApprove} onReject={handleReject} />
      
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-widest">{t('onb.master_registry')}</div>
          </div>
           <h1 className="text-6xl font-black text-slate-800 tracking-tighter">{t('onb.title')}</h1>
           <p className="text-xl text-slate-500 font-medium max-w-xl">{t('onb.subtitle')}</p>
        </div>
        <button 
          onClick={startNewOnboarding}
          className="px-8 py-5 bg-blue-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 hover:scale-105 transition-all flex items-center gap-3"
        >
           <Plus size={20} /> {t('onb.new_merchant')}
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('onb.corporate_clients')}</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder={t('onb.search')}
                   className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-blue-500 w-64"
                 />
              </div>
           </div>
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{applications.length} Corporate Clients</div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm">
           <thead className="bg-slate-50 text-left sticky top-0">
              <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('onb.partner_entity')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('onb.va_prefix')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('onb.connection')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('onb.total_tx')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('onb.fee')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('onb.cashback')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('onb.risk_index')}</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('common.status')}</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {filteredMerchants.map(m => (
                <tr 
                  key={m.id} 
                  onClick={() => { setSelectedMerchantId(m.id); setActiveView('MANAGE'); }}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                            {m.merchant_name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors text-xs">{m.merchant_name}</p>
                            <p className="text-[9px] font-mono text-slate-400">{m.cif}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-6 py-4 font-black text-slate-700 text-xs">{m.va_prefix || '---'}</td>
                   <td className="px-6 py-4">
                     {m.connection && (
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black ${m.connection?.includes('SOCKET') ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{m.connection}</span>
                     )}
                   </td>
                   <td className="px-6 py-4 text-right font-black text-slate-800 text-xs">{m.txMonth?.toLocaleString() || '---'}</td>
                   <td className="px-6 py-4 text-right text-xs font-bold text-slate-600">{m.fee ? `${(m.fee / 1000000).toFixed(0)}M` : '---'}</td>
                   <td className="px-6 py-4 text-right text-xs font-bold text-emerald-600">{m.cashback ? `${(m.cashback / 1000000).toFixed(1)}M` : '---'}</td>
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${m.risk_score > 10 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                         <span className="text-xs font-bold text-slate-700">{m.risk_score} / 100</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                        m.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                        m.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                         {m.status}
                      </span>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
        </div>
      </div>
    </div>
  );

  const MerchantManageView = () => {
    const [tab, setTab] = useState<'RAILS' | 'DOCS' | 'SECURITY'>('RAILS');
    if (!selectedMerchant) return null;

    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right duration-500">
        <div className="px-10 py-10 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-8">
              <button onClick={() => setActiveView('LIST')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                 <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-2xl shadow-blue-200">
                    {selectedMerchant.merchant_name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{selectedMerchant.merchant_name}</h2>
                    <p className="text-lg font-medium text-slate-500">VA Pool: {selectedMerchant.va_prefix} • CIF: {selectedMerchant.cif}</p>
                    {selectedMerchant.approver && (
                      <p className="text-[10px] text-emerald-600 font-bold mt-1">
                        <UserCheck size={12} className="inline mr-1" /> {t('approver.approved')} by {selectedMerchant.approver} on {selectedMerchant.approval_date}
                      </p>
                    )}
                 </div>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                 {t('onb.update_profile')}
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-12 pb-40">
           <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
              {[
                { id: 'RAILS', label: t('onb.va_technical'), icon: LayoutGrid },
                { id: 'DOCS', label: t('onb.compliance'), icon: ShieldHalf },
                { id: 'SECURITY', label: t('onb.h2h_credentials'), icon: Lock },
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${tab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
           </div>

           {tab === 'RAILS' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                   <Sparkles className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform" size={200} />
                   <div className="relative z-10 space-y-8">
                      <div>
                         <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t('onb.active_rail')}</p>
                         <h4 className="text-5xl font-black tracking-tighter mt-2">{selectedMerchant.va_prefix}</h4>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{t('onb.mother_account')}</span>
                            <span className="text-xs font-mono font-bold">10940001 (IDR)</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{t('onb.max_daily')}</span>
                            <span className="text-xs font-black">Rp 5.000.000.000</span>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                         {t('onb.create_subprefix')}
                      </button>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                   <div className="flex items-center gap-3">
                      <Globe size={20} className="text-blue-600" />
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">{t('onb.whitelisted_ips')}</h4>
                   </div>
                   <div className="space-y-4">
                      {selectedMerchant.ips?.map(ip => (
                        <div key={ip} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <span className="text-xs font-mono font-bold text-slate-700">{ip}</span>
                           <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase">ACTIVE</span>
                        </div>
                      ))}
                      <button className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-300">
                         {t('onb.add_h2h')}
                      </button>
                   </div>
                </div>
             </div>
           )}

           {tab === 'DOCS' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedMerchant.documents.map(doc => (
                  <div key={doc.type} className="bg-white p-8 rounded-[40px] border border-slate-200 flex flex-col items-center text-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        <FileCheck2 size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.type}</p>
                        <p className="text-xs font-black text-slate-800 mt-1">{doc.status}</p>
                     </div>
                     <button className="mt-4 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">{t('onb.view_document')}</button>
                  </div>
                ))}
             </div>
           )}

           {tab === 'SECURITY' && (
             <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                         <Key size={24} />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-800 tracking-tight">{t('onb.credential_guard')}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SNAP BI HMAC-SHA512 Registry</p>
                      </div>
                   </div>
                   <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                      {t('onb.rotate_secret')}
                   </button>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('onb.merchant_rsa')}</p>
                   <pre className="text-[10px] font-mono text-slate-500 break-all bg-white p-6 rounded-2xl border border-slate-100 leading-relaxed">
                      -----BEGIN PUBLIC KEY-----
                      MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7V...
                      -----END PUBLIC KEY-----
                   </pre>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] -m-10 bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-hidden relative flex flex-col bg-white">
        {activeView === 'LIST' && <MerchantListView />}
        {activeView === 'MANAGE' && <MerchantManageView />}
        
        {activeView === 'WIZARD' && (
          <div className="flex flex-1 overflow-hidden">
             <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-10 py-6 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setActiveView('LIST')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                         <ArrowLeft size={20} />
                      </button>
                      <div>
                         <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('onb.one_step')}</h2>
                         <div className="flex items-center gap-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={`flex items-center gap-1.5`}>
                                 <div className={`w-2 h-2 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? 'text-blue-600' : 'text-slate-400'}`}>Step {i}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <button onClick={() => setIsAiPanelOpen(!isAiPanelOpen)} className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all ${isAiPanelOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                         <BrainCircuit size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">{t('onb.copilot')}</span>
                      </button>
                       <button onClick={handleSubmitApplication} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2">
                          {t('onb.submit')} <Zap size={16} />
                      </button>
                   </div>
                </div>

                <div className="p-10 space-y-12 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
                   {step === 1 && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-4">
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter">1. {t('onb.partner_registry')}</h3>
                           <p className="text-xs text-slate-500 font-medium">{t('onb.sync_t24')}</p>
                           <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                             <button onClick={() => setOnboardingType('AUTO')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase ${onboardingType === 'AUTO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{t('onb.core_sync')}</button>
                             <button onClick={() => setOnboardingType('MANUAL')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase ${onboardingType === 'MANUAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{t('onb.manual')}</button>
                           </div>

                           <div className="mt-8 pt-8 border-t border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('onb.ops_accelerator')}</p>
                              <div className="relative group">
                                 <input type="file" accept=".csv" onChange={handleCsvUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                 <div className={`p-6 border-2 border-dashed rounded-3xl text-center transition-all ${isCsvProcessing ? 'bg-blue-50 border-blue-400' : 'border-slate-200 hover:border-blue-400 bg-slate-50'}`}>
                                    {isCsvProcessing ? (
                                      <div className="space-y-2">
                                         <Loader2 className="animate-spin text-blue-600 mx-auto" />
                                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('onb.extracting')}</p>
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                         <UploadCloud className="text-slate-400 mx-auto group-hover:text-blue-500 transition-colors" />
                                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600">{t('onb.import_csv')}</p>
                                      </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="lg:col-span-8 p-8 bg-slate-50 border border-slate-100 rounded-[40px] space-y-6">
                           {onboardingType === 'AUTO' && (
                             <div className="flex gap-2 mb-6">
                                <input value={cifInput} onChange={(e) => setCifInput(e.target.value)} placeholder="Enter T24 CIF..." className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-blue-500" />
                                <button onClick={handleCifSync} className="px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">{isSyncing ? <RefreshCw className="animate-spin" /> : <Database />} Sync</button>
                             </div>
                           )}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('onb.legal_entity')}</label>
                                 <input value={corporateData.cif_name} onChange={(e) => setCorporateData({...corporateData, cif_name: e.target.value})} placeholder={t('onb.legal_entity')} className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('onb.tax_id')}</label>
                                 <input value={corporateData.legal_id} onChange={(e) => setCorporateData({...corporateData, legal_id: e.target.value})} placeholder="NPWP ID" className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold" />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">{t('onb.hq_address')}</label>
                                 <textarea value={corporateData.corporate_address} onChange={(e) => setCorporateData({...corporateData, corporate_address: e.target.value})} placeholder="HQ Address" className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold h-24" />
                              </div>
                           </div>
                           <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4">{t('onb.next_docs')}</button>
                        </div>
                     </div>
                   )}

                   {step === 2 && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-4">
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter">2. {t('onb.kyb_vault')}</h3>
                           <p className="text-xs text-slate-500 font-medium">{t('onb.kyb_desc')}</p>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-2 gap-4">
                           {['nib', 'npwp', 'deed', 'ident'].map(doc => (
                             <div key={doc} className="relative bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center space-y-2 group overflow-hidden">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => e.target.files && handleFileUpload(doc, e.target.files[0])} />
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${uploadedDocs[doc] ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border'}`}>
                                   {uploadedDocs[doc] ? <CheckCircle2 /> : <Scan />}
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc}</p>
                             </div>
                           ))}
                           <div className="col-span-2 flex justify-between pt-8">
                              <button onClick={() => setStep(1)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase">{t('onb.back')}</button>
                              <button onClick={() => setStep(3)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase">{t('onb.next_va_rails')}</button>
                           </div>
                        </div>
                     </div>
                   )}

                   {step === 3 && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-4">
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter">3. {t('onb.operational_rails')}</h3>
                           <p className="text-xs text-slate-500 font-medium">{t('onb.rails_desc')}</p>
                        </div>
                        <div className="lg:col-span-8 space-y-6">
                           <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-4 shadow-2xl">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t('onb.suggested_prefix')}</p>
                              <h4 className="text-5xl font-black tracking-tighter">{industry === 'E-Commerce' ? '88041' : '88042'}</h4>
                              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{t('onb.validated_for')} {industry} {t('onb.sector')}</p>
                           </div>
                           <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('onb.h2h_whitelist')}</label>
                              <div className="flex gap-2">
                                 <input value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="Enter IP..." className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono" />
                                 <button onClick={handleAddIp} className="px-4 bg-slate-900 text-white rounded-xl"><Plus size={16} /></button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {ips.map(ip => <span key={ip} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-600">{ip}</span>)}
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>

             {/* CO-PILOT SIDEBAR */}
             {isAiPanelOpen && (
               <div className="w-80 border-l border-slate-100 flex flex-col bg-slate-50/50">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3 text-blue-600">
                        <BrainCircuit size={20} /> <h3 className="text-sm font-black uppercase tracking-widest">Bank XYZ Intelligence</h3>
                     </div>
                     <button onClick={() => setIsAiPanelOpen(false)} className="text-slate-400"><X size={16} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                     {chatMessages.map((msg, i) => (
                       <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] font-bold ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none'}`}>{msg.content}</div>
                       </div>
                     ))}
                     {isAiLoading && <div className="px-4 text-[10px] font-black text-slate-400 uppercase animate-pulse">Neural Processing...</div>}
                     <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-100">
                     <div className="relative">
                        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiChat()} placeholder="Sync registry..." className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                        <button onClick={handleAiChat} className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg"><Send size={16} /></button>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
