import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Database } from 'lucide-react';
import { I18nProvider } from '@/vam/i18n';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DevPortal = lazy(() => import('@/vam/DevPortal'));
const FinanceCockpit = lazy(() => import('@/vam/FinanceCockpit'));
const OnboardingModule = lazy(() => import('@/vam/OnboardingModule'));
const OpsDeskModule = lazy(() => import('@/vam/OpsDeskModule'));
const VaTransactionsModule = lazy(() => import('@/vam/VaTransactionsModule'));
const OjkReportingModule = lazy(() => import('@/vam/OjkReportingModule'));
const ApiSandbox = lazy(() => import('@/vam/ApiSandbox'));

const ModuleLoading = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground/30">
    <Database size={48} className="mb-4 animate-pulse" />
    <h2 className="text-lg font-semibold animate-pulse">Module Loading...</h2>
  </div>
);

export default function Index() {
  return (
    <I18nProvider>
      <DashboardLayout>
        <Suspense fallback={<ModuleLoading />}>
          <Routes>
            <Route path="/" element={<OpsDeskModule />} />
            <Route path="/admin" element={<OpsDeskModule />} />
            <Route path="/finance/cockpit" element={<FinanceCockpit />} />
            <Route path="/dev/:tab" element={<DevPortal />} />
            <Route path="/dev" element={<DevPortal />} />
            <Route path="/config" element={<OnboardingModule />} />
            <Route path="/va/ojk" element={<OjkReportingModule />} />
            <Route path="/va/inquiry" element={<VaTransactionsModule />} />
            <Route path="/sandbox" element={<ApiSandbox />} />
            <Route path="*" element={<ModuleLoading />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </I18nProvider>
  );
}
