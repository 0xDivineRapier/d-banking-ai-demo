import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Bell, 
  LogOut, 
  Database,
  Lock,
  RefreshCcw,
  RotateCw,
  ShieldCheck,
  Filter,
  TrendingUp,
  ArrowUpRight,
  Terminal,
  Zap,
  Layout,
  ListFilter,
  Layers,
  FileText
} from 'lucide-react';

import DevPortal from '@/vam/DevPortal';
import FinanceCockpit from '@/vam/FinanceCockpit';
import OnboardingModule from '@/vam/OnboardingModule';
import OpsDeskModule from '@/vam/OpsDeskModule';
import VaTransactionsModule from '@/vam/VaTransactionsModule';

const Header = () => (
  <header className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-6 shrink-0 z-50 shadow-md border-b border-blue-500/30">
    <div className="flex items-center gap-4">
      <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
        <ArrowUpRight className="text-white" size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-black tracking-tighter uppercase leading-none text-white">Bank XYZ</span>
        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Zenith Banking VAM Control Plane</span>
      </div>
    </div>
    
    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl">
      <Link to="/admin" className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 text-white rounded-lg transition-all">
        Operations Desk
      </Link>
      <Link to="/finance/cockpit" className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 text-white rounded-lg transition-all">
        Treasury Cockpit
      </Link>
      <Link to="/dev/ai" className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
        Middleware Monitoring
      </Link>
    </div>

    <div className="flex items-center gap-6">
      <div className="hidden lg:flex flex-col items-end">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Core Engine Status</span>
        <span className="text-[10px] font-mono font-bold text-emerald-400">XYZ_H2H_ACTIVE</span>
      </div>
      <div className="h-8 w-px bg-white/10"></div>
      <div className="relative cursor-pointer hover:bg-white/10 p-2 rounded-full">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 group">
        <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Sign Out</span>
      </button>
    </div>
  </header>
);

function SidebarItem({ item }: { item: any }) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  
  const isChildActive = useMemo(() => {
    return item.subItems?.some((sub: any) => {
      if (sub.to.includes('?')) {
        return currentPath === sub.to;
      }
      return location.pathname === sub.to || location.pathname.startsWith(sub.to + '/');
    }) ?? false;
  }, [currentPath, location.pathname, item.subItems]);

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const hasSubItems = !!item.subItems;
  const isActive = item.to ? location.pathname === item.to : false;
  
  const parentActiveClass = isChildActive 
    ? 'text-blue-600 bg-blue-50/80 border-blue-600 shadow-sm' 
    : 'text-slate-500 hover:bg-slate-50 border-transparent';

  return (
    <div className="mb-1 px-3">
      {hasSubItems ? (
        <div className="flex flex-col">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border-l-2 font-bold ${parentActiveClass}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className={isChildActive ? 'text-blue-600' : 'text-slate-400'} />
              <span className="text-sm">{item.label}</span>
            </div>
            <ChevronRight 
              size={14} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''} ${isChildActive ? 'text-blue-600' : 'text-slate-300'}`} 
            />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1 py-1">
              {item.subItems.map((sub: any, i: number) => {
                const subActive = sub.to.includes('?') ? currentPath === sub.to : location.pathname === sub.to;
                return (
                  <Link 
                    key={i} 
                    to={sub.to} 
                    className={`block ml-11 px-4 py-2 text-[11px] font-bold tracking-tight transition-all rounded-lg relative ${
                      subActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {subActive && (
                      <div className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                    )}
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Link 
          to={item.to || '#'} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-l-2 font-bold ${
            isActive 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 border-blue-700' 
              : 'text-slate-500 hover:bg-slate-50 border-transparent'
          }`}
        >
          <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
          <span className="text-sm">{item.label}</span>
        </Link>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { label: 'Bank Ops Dashboard', icon: Home, to: '/admin' },
  { label: 'Onboarding Desk', icon: Users, to: '/config' },
  { 
    label: 'VA Transactions', icon: CreditCard,
    subItems: [
      { label: 'Real-time Inquiry', to: '/va/inquiry?tab=inquiry' },
      { label: 'Batch Processing', to: '/va/inquiry?tab=batch' },
      { label: 'Exception Manager', to: '/va/inquiry?tab=exceptions' },
    ]
  },
  { 
    label: 'Treasury Cockpit', icon: Layout,
    subItems: [
      { label: 'Liquidity Heatmap', to: '/finance/cockpit?tab=heatmap' },
      { label: 'ERP Reconciliation', to: '/finance/cockpit?tab=reconciliation' },
      { label: 'OJK Reporting Hub', to: '/va/ojk' },
    ]
  },
  { 
    label: 'Middleware Monitoring', icon: Terminal,
    subItems: [
      { label: 'SNAP BI Tools', to: '/dev/ai' },
      { label: 'Credential Guard', to: '/dev/security' },
      { label: 'Sentinel Monitor', to: '/dev/monitor' },
    ]
  },
];

const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0 z-40">
    <div className="p-6">
      <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl text-white">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl">X</div>
        <div className="overflow-hidden">
          <p className="text-xs font-black truncate">Bank XYZ Administrator</p>
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Security Level 4</p>
        </div>
      </div>
    </div>
    <nav className="flex-1 overflow-y-auto">
      {NAV_ITEMS.map((item, i) => <SidebarItem key={i} item={item} />)}
    </nav>
    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
      <div className="text-[10px] font-mono text-slate-400 space-y-1">
        <p>XYZ_CORE_VER: 4.8.2</p>
        <p>GATEWAY_IP: 10.94.1.250</p>
      </div>
    </div>
  </aside>
);

export default function Index() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10 pb-20">
          <Routes>
            <Route path="/" element={<OpsDeskModule />} />
            <Route path="/admin" element={<OpsDeskModule />} />
            <Route path="/finance/cockpit" element={<FinanceCockpit />} />
            <Route path="/dev/:tab" element={<DevPortal />} />
            <Route path="/dev" element={<DevPortal />} />
            <Route path="/config" element={<OnboardingModule />} />
            <Route path="/va/inquiry" element={<VaTransactionsModule />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <Database size={64} className="mb-4 opacity-20" />
                <h2 className="text-2xl font-black">Module Loading...</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}
