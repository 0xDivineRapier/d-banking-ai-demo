import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher, useI18n } from '@/vam/i18n';
import { ChevronRight, LogOut, Menu, Search, CreditCard, Building, Monitor, ShieldCheck, PieChart } from 'lucide-react';
import { TourTriggerButton } from '@/components/ProductTour';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export function Header({ onToggleSidebar, onStartTour }: { onToggleSidebar: () => void; onStartTour: () => void }) {
  const { t } = useI18n();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };
  
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
          <span className="text-[11px] font-semibold text-muted-foreground/60">Dozn Global</span>
          <ChevronRight size={12} className="text-muted-foreground/30" />
          <span className="text-[11px] font-semibold text-foreground">{t('header.control_plane')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Search */}
        <button 
          onClick={() => setOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground text-[11px] transition-colors border border-border/50" 
          data-tour="search"
        >
          <Search size={13} />
          <span>{t('header.search')}</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-mono shadow-sm">⌘K</kbd>
        </button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="scrollbar-thin">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Dashboard Operations</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/config'))}>
                <Building className="mr-2 h-4 w-4" />
                <span>Corporate Clients</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/finance/cockpit'))}>
                <PieChart className="mr-2 h-4 w-4" />
                <span>Finance Cockpit</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => runCommand(() => onStartTour())}>
                <Search className="mr-2 h-4 w-4" />
                <span>Start AI Tour</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => signOut())}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Tour Button */}
        <TourTriggerButton onClick={onStartTour} />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 border-l border-border/50 outline-none hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl dozn-gradient-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
                A
              </div>
              <div className="hidden sm:inline-flex flex-col items-start text-left">
                <p className="text-[11px] font-semibold text-foreground leading-none">{t('header.admin')}</p>
                <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{t('header.level')} 4</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 border border-border/50 shadow-xl bg-card">
            <DropdownMenuLabel className="font-bold text-xs">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs rounded-xl cursor-pointer hover:bg-muted py-2">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs rounded-xl cursor-pointer hover:bg-muted py-2">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-xs rounded-xl cursor-pointer hover:bg-destructive/10 text-destructive py-2 focus:bg-destructive/10 focus:text-destructive">
              <LogOut size={14} className="mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
