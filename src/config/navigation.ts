import { 
  CreditCard, 
  Users, 
  Layout,
  Activity,
  Terminal,
  Code,
  PieChart,
  ShieldAlert
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

export interface NavSubItem {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  description: string;
  tourId: string;
  subItems?: NavSubItem[];
}

// --- Navigation Data (uses translation keys) ---
export const getNavItems = (t: (key: string) => string): NavItem[] => [
  { label: t('nav.overview'), icon: PieChart, to: '/overview', description: t('nav.dashboard_stats'), tourId: 'nav-overview' },
  { label: t('nav.operations'), icon: Activity, to: '/admin', description: t('nav.monitoring'), tourId: 'nav-operations' },
  { label: t('nav.onboarding'), icon: Users, to: '/config', description: t('nav.merchant_registry'), tourId: 'nav-onboarding' },
  { 
    label: t('nav.transactions'), icon: CreditCard,
    description: t('nav.va_payment'),
    tourId: 'nav-transactions',
    subItems: [
      { label: t('nav.all_transactions'), to: '/va/inquiry?tab=transactions' },
      { label: t('nav.batch_processing'), to: '/va/inquiry?tab=batch' },
      { label: t('nav.exception_manager'), to: '/va/inquiry?tab=exceptions' },
    ]
  },
  { 
    label: t('nav.treasury'), icon: Layout,
    description: t('nav.liquidity'),
    tourId: 'nav-treasury',
    subItems: [
      { label: t('nav.liquidity_heatmap'), to: '/finance/cockpit?tab=heatmap' },
      { label: t('nav.erp_reconciliation'), to: '/finance/cockpit?tab=reconciliation' },
      { label: t('nav.ojk_reporting'), to: '/va/ojk' },
    ]
  },
  { 
    label: t('nav.middleware'), icon: Terminal,
    description: t('nav.snap_security'),
    tourId: 'nav-middleware',
    subItems: [
      { label: t('nav.snap_tools'), to: '/dev/ai' },
      { label: t('nav.credential_guard'), to: '/dev/security' },
      { label: t('nav.sentinel_monitor'), to: '/dev/monitor' },
    ]
  },
  {
    label: t('nav.api_sandbox'), icon: Code,
    description: t('nav.snap_api_ref'),
    tourId: 'nav-sandbox',
    to: '/sandbox',
  },
  {
    label: t('nav.risk_mgmt'), icon: ShieldAlert,
    description: t('nav.sentinel_shield'),
    tourId: 'nav-risk',
    to: '/risk',
  },
];

