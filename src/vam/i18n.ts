
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface Translations {
  [key: string]: { en: string; ko: string };
}

const TRANSLATIONS: Translations = {
  // Navigation
  'nav.operations': { en: 'Operations', ko: '운영' },
  'nav.onboarding': { en: 'Onboarding', ko: '온보딩' },
  'nav.transactions': { en: 'Transactions', ko: '거래' },
  'nav.treasury': { en: 'Treasury', ko: '재무' },
  'nav.middleware': { en: 'Middleware', ko: '미들웨어' },
  'nav.monitoring': { en: 'Monitoring & Diagnostics', ko: '모니터링 및 진단' },
  'nav.merchant_registry': { en: 'Merchant Registry', ko: '가맹점 등록' },
  'nav.va_payment': { en: 'VA & Payment Rails', ko: 'VA 및 결제 레일' },
  'nav.liquidity': { en: 'Liquidity & Recon', ko: '유동성 및 대사' },
  'nav.snap_security': { en: 'SNAP BI & Security', ko: 'SNAP BI 및 보안' },
  
  // Operations
  'ops.title': { en: 'Operations Desk', ko: '운영 데스크' },
  'ops.subtitle': { en: 'Bank XYZ Sentinel AI • Proactive Monitoring & Troubleshooting', ko: 'Bank XYZ 센티넬 AI • 사전 모니터링 및 문제 해결' },
  'ops.gateway_healthy': { en: 'Gateway Healthy', ko: '게이트웨이 정상' },
  'ops.predictive_monitor': { en: 'Predictive Capacity Monitor', ko: '예측 용량 모니터' },
  'ops.ai_recommendation': { en: 'AI Recommendation', ko: 'AI 추천' },
  'ops.apply_limit': { en: 'Apply Limit Override', ko: '한도 오버라이드 적용' },
  'ops.override_applied': { en: 'Override Applied', ko: '오버라이드 적용됨' },
  'ops.support_copilot': { en: 'Support Copilot', ko: '지원 코파일럿' },
  'ops.notifications': { en: 'Notifications', ko: '알림' },
  'ops.mark_all_read': { en: 'Mark All Read', ko: '모두 읽음 표시' },
  
  // Onboarding
  'onb.client_list': { en: 'Client List', ko: '고객 목록' },
  'onb.title': { en: 'Client List', ko: '고객 목록' },
  'onb.subtitle': { en: 'Unified lifecycle management for institutional partners.', ko: '기관 파트너를 위한 통합 수명주기 관리.' },
  'onb.new_merchant': { en: 'New Merchant & VA Pool', ko: '새 가맹점 및 VA 풀' },
  'onb.search': { en: 'Search registry...', ko: '등록부 검색...' },
  'onb.partner_entity': { en: 'Partner Entity', ko: '파트너 엔티티' },
  'onb.va_prefix': { en: 'VA Prefix', ko: 'VA 접두사' },
  'onb.risk_index': { en: 'Risk Index', ko: '위험 지수' },
  'onb.import_csv': { en: 'Import CSV Template', ko: 'CSV 템플릿 가져오기' },
  'onb.import_doc': { en: 'Import Document', ko: '문서 가져오기' },
  'onb.submit': { en: 'Finalize & Provision', ko: '최종 확정 및 프로비전' },
  
  // Transactions
  'tx.title': { en: 'Transactions', ko: '거래' },
  'tx.inquiry': { en: 'Inquiry', ko: '조회' },
  'tx.all': { en: 'All Transactions', ko: '전체 거래' },
  'tx.batch': { en: 'Batch Processing', ko: '일괄 처리' },
  'tx.exceptions': { en: 'Exception Manager', ko: '예외 관리' },
  'tx.resolve_all': { en: 'Resolve All Automagically', ko: '자동으로 모두 해결' },
  'tx.all_resolved': { en: 'All Resolved', ko: '모두 해결됨' },
  
  // Treasury
  'fin.title': { en: 'Finance Cockpit', ko: '재무 콕핏' },
  'fin.heatmap': { en: 'Liquidity Stress Forecast', ko: '유동성 스트레스 예측' },
  'fin.reconciliation': { en: 'Reconciliation & Fee Audit', ko: '대사 및 수수료 감사' },
  'fin.copilot': { en: 'Finance Copilot', ko: '재무 코파일럿' },
  
  // Middleware
  'dev.title': { en: 'Developer Portal', ko: '개발자 포털' },
  'dev.simulation': { en: 'Simulation', ko: '시뮬레이션' },
  'dev.sdk': { en: 'Resilient SDK', ko: '복원력 SDK' },
  'dev.architect': { en: 'AI Architect', ko: 'AI 아키텍트' },
  'dev.healer': { en: 'Payload Healer', ko: '페이로드 힐러' },
  'dev.credential': { en: 'Credential Guard', ko: '자격 증명 가드' },
  'dev.sentinel': { en: 'Sentinel Monitor', ko: '센티넬 모니터' },
  
  // Common
  'common.status': { en: 'Status', ko: '상태' },
  'common.amount': { en: 'Amount', ko: '금액' },
  'common.date': { en: 'Date', ko: '날짜' },
  'common.action': { en: 'Action', ko: '작업' },
  'common.search': { en: 'Search...', ko: '검색...' },
  'common.all_systems': { en: 'ALL SYSTEMS NOMINAL', ko: '모든 시스템 정상' },
  'common.control_plane': { en: 'Control Plane', ko: '컨트롤 플레인' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string) => {
    const translation = TRANSLATIONS[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  
  return (
    <div className="flex p-0.5 bg-muted/50 rounded-lg border border-border/50">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
      >EN</button>
      <button 
        onClick={() => setLanguage('ko')}
        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'ko' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
      >한국어</button>
    </div>
  );
}
