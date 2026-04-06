import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Shield, Cpu, Bell } from 'lucide-react';
import { useI18n } from '@/vam/i18n';
import { getNavItems, NavItem } from '@/config/navigation';

// --- Sidebar Navigation Item ---
function SidebarNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isChildActive = useMemo(() => {
    return item.subItems?.some((sub) => {
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
      <div className="px-2 mb-1" data-tour={item.tourId}>
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
    <div className="px-3 mb-0.5" data-tour={item.tourId}>
      {hasSubItems && item.subItems ? (
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
              {item.subItems.map((sub, i) => {
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

// --- Sidebar Component ---
export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { t } = useI18n();
  const NAV_ITEMS = useMemo(() => getNavItems(t), [t]);

  return (
    <aside
      data-tour="sidebar"
      className={`dozn-gradient flex flex-col h-full shrink-0 transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className={`p-4 ${collapsed ? 'px-2.5' : ''}`} data-tour="sidebar-logo">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'}`}>
          <div className="w-9 h-9 dozn-gradient-accent rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Cpu size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-slide-in">
              <p className="text-[13px] font-bold text-white tracking-tight leading-none">Dozn Global</p>
              <p className="text-[9px] font-mono text-sidebar-foreground/40 mt-0.5 tracking-wider">{t('sidebar.control_plane')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-6 mb-2">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-sidebar-foreground/25">{t('nav.navigation')}</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-1">
        {NAV_ITEMS.map((item, i) => (
          <SidebarNavItem key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Notifications Side Bar Panel */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border/40 mt-auto shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)] bg-sidebar-background">
          <button className="w-full flex items-center justify-between group cursor-pointer hover:bg-sidebar-accent p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                 <Bell size={16} className="text-sidebar-foreground/60 group-hover:text-sidebar-foreground" />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              </div>
              <span className="text-xs font-semibold text-sidebar-foreground/80 group-hover:text-sidebar-foreground transition-colors">{t('nav.notifications')}</span>
            </div>
            <span className="text-[9px] font-black bg-destructive text-white px-1.5 py-0.5 rounded-md shadow-sm">3</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={`border-t border-sidebar-border/40 ${collapsed ? 'p-2 mt-auto' : 'p-4'} bg-sidebar-accent/30`} data-tour="system-status">
        {!collapsed ? (
          <div className="px-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="status-dot-healthy" />
               <span className="text-[10px] font-mono text-sidebar-foreground/50">{t('sidebar.core_engine')}</span>
             </div>
             <div className="flex items-center gap-2">
               <Shield size={12} className="text-sidebar-foreground/30" />
               <span className="text-[10px] font-mono text-sidebar-foreground/35">{t('sidebar.sec_lvl')}</span>
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
