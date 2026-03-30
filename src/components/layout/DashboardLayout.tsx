import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProductTour, TourStep } from '@/components/ProductTour';

// --- Tour Steps Definition ---
const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="sidebar-logo"]',
    title: 'Welcome to Bank XYZ',
    content: 'This is the Bank XYZ Virtual Account Management Control Plane — your AI-powered command center for Bank XYZ operations.',
    placement: 'right',
  },
  {
    target: '[data-tour="nav-operations"]',
    title: 'Operations Desk',
    content: 'Monitor real-time system health with AI Sentinel diagnostics. The AI agent analyzes log patterns, detects anomalies, and recommends circuit breaker actions.',
    placement: 'right',
    route: '/admin',
  },
  {
    target: '[data-tour="nav-onboarding"]',
    title: 'AI-Powered Onboarding',
    content: 'Register merchants using AI chat or document scanning (OCR). The AI agent extracts company details from NPWP documents and business certificates automatically.',
    placement: 'right',
    route: '/config',
  },
  {
    target: '[data-tour="nav-transactions"]',
    title: 'VA Transactions',
    content: 'Real-time inquiry, batch processing, and exception management for Virtual Account payments — all built on SNAP BI standards.',
    placement: 'right',
  },
  {
    target: '[data-tour="nav-treasury"]',
    title: 'Treasury Cockpit',
    content: 'Liquidity heatmaps, ERP reconciliation with AI matching, fee audit detection, and suspense fund resolution — powered by the Finance Copilot AI.',
    placement: 'right',
    route: '/finance/cockpit',
  },
  {
    target: '[data-tour="nav-middleware"]',
    title: 'Middleware Monitoring',
    content: 'SNAP BI development tools, credential management, and a synthetic data sandbox with AI-generated banking telemetry for load testing.',
    placement: 'right',
  },
  {
    target: '[data-tour="status-pill"]',
    title: 'System Health at a Glance',
    content: 'Real-time system status indicator. Green means all SNAP gateways, core banking rails, and settlement engines are operating normally.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-toggle"]',
    title: 'Collapse Sidebar',
    content: 'Toggle the sidebar to icon-only mode for more screen real estate. Perfect for focused dashboard monitoring.',
    placement: 'bottom',
  },
];

const TOUR_STORAGE_KEY = 'zenith-tour-completed';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const navigate = useNavigate();

  // Auto-start tour on first visit
  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Small delay so the page renders first
      const timer = setTimeout(() => {
        setSidebarCollapsed(false); // Ensure sidebar is open for tour
        setTourOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartTour = useCallback(() => {
    setSidebarCollapsed(false);
    setTourOpen(true);
  }, []);

  const handleTourComplete = useCallback(() => {
    setTourOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }, []);

  const handleTourClose = useCallback(() => {
    setTourOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden w-full">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} onStartTour={handleStartTour} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 pb-20 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <ProductTour
        steps={TOUR_STEPS}
        isOpen={tourOpen}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
        navigate={navigate}
      />
    </div>
  );
}
