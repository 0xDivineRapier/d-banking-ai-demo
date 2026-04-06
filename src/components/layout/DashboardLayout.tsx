import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProductTour, TourStep } from '@/components/ProductTour';

// --- Tour Steps Definition ---
const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="sidebar-logo"]',
    title: 'Dozn AI Command Center',
    content: 'Welcome to the future of agentic banking. Dozn is your AI-powered control plane for autonomous virtual account management and real-time risk mitigation.',
    placement: 'right',
  },
  {
    target: '[data-tour="nav-operations"]',
    title: 'AI Sentinel Monitoring',
    content: 'The AI Sentinel continuously analyzes log telemetry and transaction flows, detecting anomalies and executing automated circuit breaker protocols when threats emerge.',
    placement: 'right',
    route: '/admin',
  },
  {
    target: '[data-tour="nav-onboarding"]',
    title: 'Intelligent AI Copilot',
    content: 'Onboard corporate clients in seconds. Our AI Copilot handles real-time document OCR extraction, sanity checks, and automated KYB verification workflows.',
    placement: 'right',
    route: '/config',
  },
  {
    target: '[data-tour="nav-risk"]',
    title: 'Sentinel Shield 3-in-1 Risk Model',
    content: 'Powered by Dozn Global, this module provides world-class fraud protection using the SHIELD risk engine to secure every digital touchpoint.',
    placement: 'right',
    route: '/risk',
  },
  {
    target: '[data-tour="rain-score"]',
    title: 'RAIN Score Engine',
    content: 'Real-time Adaptive Intelligence Network (RAIN) scoring. This dynamic dial visualizes the current security posture of your entire ecosystem.',
    placement: 'bottom',
    route: '/risk',
  },
  {
    target: '[data-tour="nav-treasury"]',
    title: 'Finance AI Workspace',
    content: 'Optimize liquidity with AI-driven ERP reconciliation, fee audit detection, and intelligent suspense fund resolution.',
    placement: 'right',
    route: '/finance/cockpit',
  },
  {
    target: '[data-tour="finance-copilot"]',
    title: 'Dozn Cloud Intelligent Support',
    content: 'Interact with our Dozn AI-powered LLM assistant for real-time operations support, from freezing cards to generating complex treasury reports via natural language.',
    placement: 'left',
    route: '/finance/cockpit',
  },
  {
    target: '[data-tour="nav-sandbox"]',
    title: 'Synthetic Data AI Sandbox',
    content: 'Generate realistic banking telemetry and stress-test your SNAP BI integrations using our AI-driven synthetic data factory.',
    placement: 'right',
    route: '/sandbox',
  },
];

const TOUR_STORAGE_KEY = 'dozn-tour-completed';

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
    <div className="flex h-screen bg-background relative w-full overflow-hidden selection:bg-primary/20">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/10 blur-[130px] rounded-full pointer-events-none mix-blend-screen" />

      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10 relative">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} onStartTour={handleStartTour} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background scrollbar-thin scroll-smooth relative flex flex-col">
          <div className="flex-1 p-6 lg:p-10 pb-10 max-w-[1600px] w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-full">
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
