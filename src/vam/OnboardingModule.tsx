
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
  UploadCloud
} from 'lucide-react';
import { OnboardingService, CorporateProfile, LimitConfig } from './OnboardingService';
import { OnboardingAgent, ExtractedCorporateData } from './OnboardingAgent';
import { CredentialManager } from './CredentialManager';

interface OnboardingApplication {
  id: string;
  cif: string;
  merchant_name: string;
  industry: string;
  status: 'DRAFT' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  applied_at: string;
  type: 'AUTO' | 'MANUAL';
  risk_score: number;
  va_prefix?: string;
  ips?: string[];
  documents: { type: string; status: 'VERIFIED' | 'PENDING' | 'REJECTED' }[];
}

const INITIAL_APPLICATIONS: OnboardingApplication[] = [
  {
    id: 'APP-001',
    cif: 'CIF-1001',
    merchant_name: 'PT. ABC Corp',
    industry: 'Automotive',
    status: 'APPROVED',
    applied_at: '2026-03-05',
    type: 'AUTO',
    risk_score: 12,
    va_prefix: '88001',
    ips: ['10.94.1.25', '10.94.1.26'],
    documents: [
      { type: 'NIB', status: 'VERIFIED' },
      { type: 'NPWP', status: 'VERIFIED' },
      { type: 'Deed', status: 'VERIFIED' }
    ]
  },
  {
    id: 'APP-002',
    cif: 'CIF-2002',
    merchant_name: 'DEF Payment Gateway',
    industry: 'E-Commerce',
    status: 'UNDER_REVIEW',
    applied_at: '2026-03-06',
    type: 'AUTO',
    risk_score: 5,
    va_prefix: '88041',
    documents: [
      { type: 'NIB', status: 'PENDING' },
      { type: 'NPWP', status: 'PENDING' }
    ]
  }
];

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
    { role: 'ai', content: 'Ready to onboard or configure. Paste merchant details or document scans, and I will automate the registration.' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiAgent = useRef(new OnboardingAgent());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const filteredMerchants = useMemo(() => {
    return INITIAL_APPLICATIONS.filter(m => 
      m.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) || m.cif.includes(searchTerm)
    );
  }, [searchTerm]);

  const selectedMerchant = useMemo(() => 
    INITIAL_APPLICATIONS.find(m => m.id === selectedMerchantId),
  [selectedMerchantId]);

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
      // Simple CSV parser for demo purposes
      const rows = text.split('\n');
      if (rows.length < 2) {
        alert("Invalid CSV format. Please include headers.");
        setIsCsvProcessing(false);
        return;
      }

      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      const data = rows[1].split(',').map(v => v.trim());

      const mapped: any = {};
      headers.forEach((h, i) => mapped[h] = data[i]);

      // Map to state
      setTimeout(() => {
        setCorporateData({
          cif_name: mapped.name || mapped.merchant_name || '',
          legal_id: mapped.tax_id || mapped.npwp || '',
          corporate_address: mapped.address || '',
          phone: mapped.phone || '',
        });
        if (mapped.cif) {
          setCifInput(mapped.cif);
          setOnboardingType('AUTO');
        } else {
          setOnboardingType('MANUAL');
        }
        if (mapped.industry) setIndustry(mapped.industry);
        if (mapped.ip_whitelist) setIps(mapped.ip_whitelist.split(';'));
        
        setIsCsvProcessing(false);
        setChatMessages(prev => [...prev, { 
          role: 'ai', 
          content: `Bulk Import Successful: Parsed details for "${mapped.name || 'New Merchant'}". I've populated the Legal Profile and Technical Rails.` 
        }]);
      }, 1200);
    };
    reader.readAsText(file);
  };

  const handleAddIp = () => {
    if (OnboardingService.validate_ip(newIp)) {
      setIps([...ips, newIp]);
      setNewIp('');
    }
  };

  const startNewOnboarding = () => {
    setActiveView('WIZARD');
    setStep(1);
    setSelectedMerchantId(null);
    setCorporateData({ cif_name: '', legal_id: '', corporate_address: '' });
    setUploadedDocs({ nib: false, npwp: false, deed: false });
    setIsAiPanelOpen(true);
  };

  const handleAiChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const { updatedData, aiResponse } = await aiAgent.current.processOnboardingChat(userMsg, corporateData);
      setCorporateData(prev => ({
        ...prev,
        cif_name: updatedData.cif_name || prev.cif_name,
        legal_id: updatedData.legal_id || prev.legal_id,
        corporate_address: updatedData.corporate_address || prev.corporate_address,
      }));
      if (updatedData.industry) setIndustry(updatedData.industry);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble syncing. Please verify the fields manually." }]);
    } finally {
      setIsAiLoading(false);
    }
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
        setCorporateData(prev => ({
          ...prev,
          cif_name: extracted.cif_name || prev.cif_name,
          legal_id: extracted.legal_id || prev.legal_id,
          corporate_address: extracted.corporate_address || prev.corporate_address,
        }));
        setChatMessages(prev => [...prev, { role: 'ai', content: `AI Vision: Detected ${docId.toUpperCase()} for "${extracted.cif_name}". Synced to Registry.` }]);
      } catch (err) { console.error(err); } finally { setIsAiLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  // Views
  const MerchantListView = () => (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
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
               <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('onb.institutional_partners')}</h3>
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
        </div>
        <table className="w-full text-sm">
           <thead className="bg-slate-50 text-left">
              <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('onb.partner_entity')}</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('onb.va_prefix')}</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('onb.risk_index')}</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('common.status')}</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {filteredMerchants.map(m => (
                <tr 
                  key={m.id} 
                  onClick={() => { setSelectedMerchantId(m.id); setActiveView('MANAGE'); }}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">
                            {m.merchant_name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{m.merchant_name}</p>
                            <p className="text-[10px] font-mono text-slate-400">{m.cif || 'REG-PENDING'}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6 font-black text-slate-700">{m.va_prefix || '---'}</td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${m.risk_score > 10 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                         <span className="text-xs font-bold text-slate-700">{m.risk_score} / 100</span>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
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
                 </div>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                 Update Profile
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-12 pb-40">
           <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
              {[
                { id: 'RAILS', label: 'VA Technical Rails', icon: LayoutGrid },
                { id: 'DOCS', label: 'Compliance & KYB', icon: ShieldHalf },
                { id: 'SECURITY', label: 'H2H & Credentials', icon: Lock },
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
                         <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Virtual Rail</p>
                         <h4 className="text-5xl font-black tracking-tighter mt-2">{selectedMerchant.va_prefix}</h4>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Mother Account</span>
                            <span className="text-xs font-mono font-bold">10940001 (IDR)</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Max Daily Limit</span>
                            <span className="text-xs font-black">Rp 5.000.000.000</span>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                         Create New Sub-Prefix
                      </button>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                   <div className="flex items-center gap-3">
                      <Globe size={20} className="text-blue-600" />
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">Whitelisted Ingress IPs</h4>
                   </div>
                   <div className="space-y-4">
                      {selectedMerchant.ips?.map(ip => (
                        <div key={ip} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <span className="text-xs font-mono font-bold text-slate-700">{ip}</span>
                           <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase">ACTIVE</span>
                        </div>
                      ))}
                      <button className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-300">
                         Add H2H Entry
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
                     <button className="mt-4 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Document</button>
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
                         <h4 className="text-xl font-black text-slate-800 tracking-tight">Credential Guard</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SNAP BI HMAC-SHA512 Registry</p>
                      </div>
                   </div>
                   <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                      Rotate Secret
                   </button>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Merchant RSA Public Key</p>
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
                         <h2 className="text-2xl font-black text-slate-800 tracking-tight">One-Step Onboarding</h2>
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
                         <BrainCircuit size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Copilot</span>
                      </button>
                       <button onClick={() => { alert('Application Submitted'); setActiveView('LIST'); }} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2">
                          {t('onb.submit')} <Zap size={16} />
                      </button>
                   </div>
                </div>

                <div className="p-10 space-y-12 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
                   {step === 1 && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-4">
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter">1. Partner Registry</h3>
                           <p className="text-xs text-slate-500 font-medium">Sync with T24 or upload template.</p>
                           <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                             <button onClick={() => setOnboardingType('AUTO')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase ${onboardingType === 'AUTO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Core Sync</button>
                             <button onClick={() => setOnboardingType('MANUAL')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase ${onboardingType === 'MANUAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Manual</button>
                           </div>

                           <div className="mt-8 pt-8 border-t border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operations Accelerator</p>
                              <div className="relative group">
                                 <input 
                                   type="file" 
                                   accept=".csv"
                                   onChange={handleCsvUpload}
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                 />
                                 <div className={`p-6 border-2 border-dashed rounded-3xl text-center transition-all ${isCsvProcessing ? 'bg-blue-50 border-blue-400' : 'border-slate-200 hover:border-blue-400 bg-slate-50'}`}>
                                    {isCsvProcessing ? (
                                      <div className="space-y-2">
                                         <Loader2 className="animate-spin text-blue-600 mx-auto" />
                                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Extracting Data...</p>
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                         <UploadCloud className="text-slate-400 mx-auto group-hover:text-blue-500 transition-colors" />
                                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600">Import CSV Template</p>
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
                                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Legal Entity Name</label>
                                 <input value={corporateData.cif_name} onChange={(e) => setCorporateData({...corporateData, cif_name: e.target.value})} placeholder="Legal Entity Name" className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tax Identification (NPWP)</label>
                                 <input value={corporateData.legal_id} onChange={(e) => setCorporateData({...corporateData, legal_id: e.target.value})} placeholder="NPWP ID" className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold" />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Registered HQ Address</label>
                                 <textarea value={corporateData.corporate_address} onChange={(e) => setCorporateData({...corporateData, corporate_address: e.target.value})} placeholder="HQ Address" className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold h-24" />
                              </div>
                           </div>
                           <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4">Next: Docs & KYB</button>
                        </div>
                     </div>
                   )}

                   {step === 2 && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-4">
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter">2. KYB Vault</h3>
                           <p className="text-xs text-slate-500 font-medium">Upload institutional documents for OJK audit.</p>
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
                              <button onClick={() => setStep(1)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase">Back</button>
                              <button onClick={() => setStep(3)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase">Next: VA Rails</button>
                           </div>
                        </div>
                     </div>
                   )}

                   {step === 3 && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-4">
                           <h3 className="text-2xl font-black text-slate-800 tracking-tighter">3. Operational Rails</h3>
                           <p className="text-xs text-slate-500 font-medium">Configure technical VA parameters & whitelisting.</p>
                        </div>
                        <div className="lg:col-span-8 space-y-6">
                           <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-4 shadow-2xl">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Suggested VA Prefix</p>
                              <h4 className="text-5xl font-black tracking-tighter">{industry === 'E-Commerce' ? '88041' : '88042'}</h4>
                              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Validated for {industry} Sector</p>
                           </div>
                           <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">H2H Ingress Whitelist</label>
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
                        <button onClick={handleAiChat} className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg"><Send size={14} /></button>
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
