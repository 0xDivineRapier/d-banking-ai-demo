import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher, useI18n } from '@/vam/i18n';
import { ChevronRight, Bell, LogOut, Menu, Search } from 'lucide-react';
import { TourTriggerButton } from '@/components/ProductTour';

export function Header({ onToggleSidebar, onStartTour }: { onToggleSidebar: () => void; onStartTour: () => void }) {
  const { t } = useI18n();
  const { signOut } = useAuth();
  
  return (
    <header className="h-14 bg-card border-b border-border/60 flex items-center justify-between px-4 shrink-0 z-50" data-tour="header">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          data-tour="sidebar-toggle"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb-like location */}
        <div className="hidden md:flex items-center gap-1.5 ml-2">
          <span className="text-[11px] font-semibold text-muted-foreground/60">Bank XYZ</span>
          <ChevronRight size={12} className="text-muted-foreground/30" />
          <span className="text-[11px] font-semibold text-foreground">{t('header.control_plane')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground text-[11px] transition-colors border border-border/50" data-tour="search">
          <Search size={13} />
          <span>{t('header.search')}</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-mono">⌘K</kbd>
        </button>

        {/* Tour Button */}
        <TourTriggerButton onClick={onStartTour} />

        {/* Status pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20" data-tour="status-pill">
          <div className="status-dot-healthy" />
          <span className="text-[10px] font-semibold text-accent font-mono">{t('header.all_systems')}</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground" data-tour="notifications">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
        </button>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          title="Sign Out"
        >
          <LogOut size={17} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/50">
          <div className="w-8 h-8 rounded-xl zenith-gradient-accent flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-foreground leading-none">{t('header.admin')}</p>
            <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{t('header.level')} 4</p>
          </div>
        </div>
      </div>
    </header>
  );
}
