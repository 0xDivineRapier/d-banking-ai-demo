import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Users, 
  ChevronRight, 
  Bell, 
  LogOut, 
  Database,
  Terminal,
  ArrowUpRight,
  Layout,
  Activity,
  Shield,
  Cpu,
  Menu,
  X,
  Search,
  Command
} from 'lucide-react';

import DevPortal from '@/vam/DevPortal';
import FinanceCockpit from '@/vam/FinanceCockpit';
import OnboardingModule from '@/vam/OnboardingModule';
import OpsDeskModule from '@/vam/OpsDeskModule';
import VaTransactionsModule from '@/vam/VaTransactionsModule';

// --- Navigation Data ---
const NAV_ITEMS = [
  { label: 'Operations', icon: Activity, to: '/admin', description: 'Monitoring & Diagnostics' },
  { label: 'Onboarding', icon: Users, to: '/config', description: 'Merchant Registry' },
  { 
    label: 'Transactions', icon: CreditCard,
    description: 'VA & Payment Rails',
    subItems: [
      { label: 'Real-time Inquiry', to: '/va/inquiry?tab=inquiry' },
      { label: 'Batch Processing', to: '/va/inquiry?tab=batch' },
      { label: 'Exception Manager', to: '/va/inquiry?tab=exceptions' },
    ]
  },
  { 
    label: 'Treasury', icon: Layout,
    description: 'Liquidity & Recon',
    subItems: [
      { label: 'Liquidity Heatmap', to: '/finance/cockpit?tab=heatmap' },
      { label: 'ERP Reconciliation', to: '/finance/cockpit?tab=reconciliation' },
      { label: 'OJK Reporting', to: '/va/ojk' },
    ]
  },
  { 
    label: 'Middleware', icon: Terminal,
    description: 'SNAP BI & Security',
    subItems: [
      { label: 'SNAP BI Tools', to: '/dev/ai' },
      { label: 'Credential Guard', to: '/dev/security' },
      { label: 'Sentinel Monitor', to: '/dev/monitor' },
    ]
  },
];

// --- Sidebar Navigation Item ---
function SidebarNavItem({ item, collapsed }: { item: any; collapsed: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isChildActive = useMemo(() => {
    return item.subItems?.some((sub: any) => {
      if (sub.to.includes('?')) return currentPath === sub.to;
      return location.pathname === sub.to || location.pathname.startsWith(sub.to + '/');
    }) ?? false;
  }, [currentPath, location.pathname, item.subItems]);

  const isDirectActive = item.to ? location.pathname === item.to : false;
  const isActive = isDirectActive || isChildActive;
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const hasSubItems = !!item.subItems;

  if (collapsed) {
    return (
      <div className="px-2 mb-1">
        <Link
          to={item.to || item.subItems?.[0]?.to || '#'}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group relative ${
            isActive
              ? 'bg-primary text-primary-foreground shadow-md glow-primary'
              : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
          }`}
          title={item.label}
        >
          <item.icon size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-3 mb-0.5">
      {hasSubItems ? (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              isActive ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70'
            }`}>
              <item.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold block">{item.label}</span>
              <span className="text-[10px] text-sidebar-foreground/40 block truncate">{item.description}</span>
            </div>
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 text-sidebar-foreground/30 ${isOpen ? 'rotate-90' : ''}`}
            />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="ml-[22px] pl-4 border-l border-sidebar-border/60 mt-1 space-y-0.5">
              {item.subItems.map((sub: any, i: number) => {
                const subActive = sub.to.includes('?') ? currentPath === sub.to : location.pathname === sub.to;
                return (
                  <Link
                    key={i}
                    to={sub.to}
                    className={`block px-3 py-1.5 text-[12px] rounded-lg transition-all duration-150 ${
                      subActive
                        ? 'text-primary font-semibold bg-primary/5'
                        : 'text-sidebar-foreground/45 hover:text-sidebar-foreground/80 hover:bg-sidebar-accent/30'
                    }`}
                  >
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
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            isActive
              ? 'bg-primary text-primary-foreground shadow-md glow-primary'
              : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
          }`}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            isActive ? 'bg-white/10' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70'
          }`}>
            <item.icon size={16} />
          </div>
          <div className="min-w-0">
            <span className="text-[13px] font-semibold block">{item.label}</span>
            <span className={`text-[10px] block truncate ${isActive ? 'text-primary-foreground/70' : 'text-sidebar-foreground/40'}`}>{item.description}</span>
          </div>
        </Link>
      )}
    </div>
  );
}

// --- Sidebar ---
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={`zenith-gradient flex flex-col h-full shrink-0 transition-all duration-300 overflow-hidden ${
      collapsed ? 'w-[60px]' : 'w-[260px]'
    }`}>
      {/* Logo */}
      <div className={`p-4 ${collapsed ? 'px-2.5' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'}`}>
          <div className="w-9 h-9 zenith-gradient-accent rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Cpu size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-slide-in">
              <p className="text-[13px] font-bold text-white tracking-tight leading-none">Zenith VAM</p>
              <p className="text-[9px] font-mono text-sidebar-foreground/40 mt-0.5 tracking-wider">CONTROL PLANE v4.8</p>
            </div>
          )}
        </div>
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-6 mb-2">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-sidebar-foreground/25">Navigation</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-1">
        {NAV_ITEMS.map((item, i) => (
          <SidebarNavItem key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-sidebar-border/40 ${collapsed ? 'p-2' : 'p-4'}`}>
        {!collapsed ? (
          <div className="px-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="status-dot-healthy" />
              <span className="text-[10px] font-mono text-sidebar-foreground/50">CORE_ENGINE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-sidebar-foreground/30" />
              <span className="text-[10px] font-mono text-sidebar-foreground/35">SEC_LVL: 4 • H2H_ACTIVE</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="status-dot-healthy" />
          </div>
        )}
      </div>
    </aside>
  );
}

// --- Header ---
function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="h-14 bg-card border-b border-border/60 flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb-like location */}
        <div className="hidden md:flex items-center gap-1.5 ml-2">
          <span className="text-[11px] font-semibold text-muted-foreground/60">Bank XYZ</span>
          <ChevronRight size={12} className="text-muted-foreground/30" />
          <span className="text-[11px] font-semibold text-foreground">Control Plane</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground text-[11px] transition-colors border border-border/50">
          <Search size={13} />
          <span>Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-mono">⌘K</kbd>
        </button>

        {/* Status pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="status-dot-healthy" />
          <span className="text-[10px] font-semibold text-accent font-mono">ALL SYSTEMS NOMINAL</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/50">
          <div className="w-8 h-8 rounded-xl zenith-gradient-accent flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-foreground leading-none">Admin</p>
            <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Level 4</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Main Layout ---
export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 pb-20 max-w-[1600px] mx-auto">
            <Routes>
              <Route path="/" element={<OpsDeskModule />} />
              <Route path="/admin" element={<OpsDeskModule />} />
              <Route path="/finance/cockpit" element={<FinanceCockpit />} />
              <Route path="/dev/:tab" element={<DevPortal />} />
              <Route path="/dev" element={<DevPortal />} />
              <Route path="/config" element={<OnboardingModule />} />
              <Route path="/va/inquiry" element={<VaTransactionsModule />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground/30">
                  <Database size={48} className="mb-4" />
                  <h2 className="text-lg font-semibold">Module Loading...</h2>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
