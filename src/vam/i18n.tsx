
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface Translations {
  [key: string]: { en: string; ko: string };
}

const TRANSLATIONS: Translations = {
  // Navigation
  'nav.operations': { en: 'Operations', ko: '운영' },
  'nav.onboarding': { en: 'Corporate Clients', ko: '기업 고객' },
  'nav.transactions': { en: 'Transactions', ko: '거래' },
  'nav.treasury': { en: 'Treasury', ko: '재무' },
  'nav.middleware': { en: 'Middleware', ko: '미들웨어' },
  'nav.monitoring': { en: 'Monitoring & Diagnostics', ko: '모니터링 및 진단' },
  'nav.merchant_registry': { en: 'Client Registry & Onboarding', ko: '고객 등록 및 온보딩' },
  'nav.va_payment': { en: 'VA & Payment Rails', ko: 'VA 및 결제 레일' },
  'nav.liquidity': { en: 'Liquidity & Recon', ko: '유동성 및 대사' },
  'nav.snap_security': { en: 'SNAP BI & Security', ko: 'SNAP BI 및 보안' },
  'nav.all_transactions': { en: 'All Transactions', ko: '전체 거래' },
  'nav.batch_processing': { en: 'Batch Processing', ko: '일괄 처리' },
  'nav.exception_manager': { en: 'Exception Manager', ko: '예외 관리자' },
  'nav.liquidity_heatmap': { en: 'Liquidity Heatmap', ko: '유동성 히트맵' },
  'nav.erp_reconciliation': { en: 'ERP Reconciliation', ko: 'ERP 대사' },
  'nav.ojk_reporting': { en: 'OJK Reporting', ko: 'OJK 보고' },
  'nav.snap_tools': { en: 'SNAP BI Tools', ko: 'SNAP BI 도구' },
  'nav.credential_guard': { en: 'Credential Guard', ko: '자격 증명 가드' },
  'nav.sentinel_monitor': { en: 'Sentinel Monitor', ko: '센티넬 모니터' },
  'nav.navigation': { en: 'Navigation', ko: '내비게이션' },

  // Header
  'header.control_plane': { en: 'Control Plane', ko: '컨트롤 플레인' },
  'header.search': { en: 'Search...', ko: '검색...' },
  'header.all_systems': { en: 'ALL SYSTEMS NOMINAL', ko: '모든 시스템 정상' },
  'header.admin': { en: 'Admin', ko: '관리자' },
  'header.level': { en: 'Level', ko: '레벨' },

  // Sidebar
  'sidebar.core_engine': { en: 'CORE_ENGINE: ACTIVE', ko: 'CORE_ENGINE: 활성' },
  'sidebar.sec_lvl': { en: 'SEC_LVL: 4 • H2H_ACTIVE', ko: 'SEC_LVL: 4 • H2H_활성' },
  'sidebar.control_plane': { en: 'CONTROL PLANE v4.8', ko: '컨트롤 플레인 v4.8' },

  // Operations Desk
  'ops.title': { en: 'Operations Desk', ko: '운영 데스크' },
  'ops.subtitle': { en: 'Bank XYZ Sentinel AI • Proactive Monitoring & Troubleshooting', ko: 'Bank XYZ 센티넬 AI • 사전 모니터링 및 문제 해결' },
  'ops.gateway_healthy': { en: 'Gateway Healthy', ko: '게이트웨이 정상' },
  'ops.predictive_monitor': { en: 'Predictive Capacity Monitor', ko: '예측 용량 모니터' },
  'ops.ai_recommendation': { en: 'AI Recommendation', ko: 'AI 추천' },
  'ops.apply_limit': { en: 'Apply Limit Override', ko: '한도 오버라이드 적용' },
  'ops.override_applied': { en: 'Override Applied', ko: '오버라이드 적용됨' },
  'ops.override_active': { en: 'Override Active', ko: '오버라이드 활성' },
  'ops.support_copilot': { en: 'Support Copilot', ko: '지원 코파일럿' },
  'ops.notifications': { en: 'Notifications', ko: '알림' },
  'ops.mark_all_read': { en: 'Mark All Read', ko: '모두 읽음 표시' },
  'ops.diagnostic_feed': { en: 'Bank XYZ Sentinel AI Diagnostic Feed', ko: 'Bank XYZ 센티넬 AI 진단 피드' },
  'ops.live_trace': { en: 'Live Trace', ko: '실시간 추적' },
  'ops.ai_analysis': { en: 'AI Analysis', ko: 'AI 분석' },
  'ops.issue_detected': { en: 'Issue Detected', ko: '문제 감지됨' },
  'ops.root_cause': { en: 'Root Cause Hypothesis', ko: '근본 원인 가설' },
  'ops.awaiting_command': { en: 'Awaiting Command...', ko: '명령 대기 중...' },
  'ops.translate_nlp': { en: 'Translate natural language to SQL instantly.', ko: '자연어를 SQL로 즉시 변환합니다.' },
  'ops.analyzing': { en: 'Analyzing traffic patterns...', ko: '트래픽 패턴 분석 중...' },
  'ops.limit_breach': { en: 'Limit Breach Projected', ko: '한도 초과 예상' },
  'ops.quota_exceeded': { en: 'AI Service Quota Exceeded', ko: 'AI 서비스 할당량 초과' },
  'ops.quota_fallback': { en: 'Real-time proactive diagnostics are temporarily running in fallback mode.', ko: '실시간 사전 진단이 일시적으로 대체 모드로 실행 중입니다.' },
  'ops.corporate_clients': { en: 'Corporate Clients', ko: '기업 고객' },
  'ops.total_tx_month': { en: 'Total Tx This Month', ko: '이번 달 총 거래' },
  'ops.fee': { en: 'Fee (IDR)', ko: '수수료 (IDR)' },
  'ops.cashback': { en: 'Cashback (IDR)', ko: '캐시백 (IDR)' },
  'ops.client_name': { en: 'Client Name', ko: '고객명' },
  'ops.connection': { en: 'Connection', ko: '연결' },
  'ops.vol_24h': { en: 'Vol 24h', ko: '24시간 거래량' },

  // Onboarding / Corporate Clients
  'onb.title': { en: 'Corporate Clients', ko: '기업 고객' },
  'onb.subtitle': { en: 'Unified lifecycle management for corporate clients. Onboard, configure VA rails, and manage credentials in one plane.', ko: '기업 고객을 위한 통합 수명주기 관리. 온보딩, VA 레일 구성, 자격 증명 관리를 한 곳에서.' },
  'onb.new_merchant': { en: 'New Corporate Client', ko: '새 기업 고객' },
  'onb.search': { en: 'Search corporate clients...', ko: '기업 고객 검색...' },
  'onb.partner_entity': { en: 'Corporate Entity', ko: '기업 엔티티' },
  'onb.va_prefix': { en: 'VA Prefix', ko: 'VA 접두사' },
  'onb.risk_index': { en: 'Risk Index', ko: '위험 지수' },
  'onb.master_registry': { en: 'Corporate Registry', ko: '기업 등록부' },
  'onb.corporate_clients': { en: 'Corporate Clients', ko: '기업 고객' },
  'onb.import_csv': { en: 'Import CSV Template', ko: 'CSV 템플릿 가져오기' },
  'onb.import_doc': { en: 'Import Document', ko: '문서 가져오기' },
  'onb.submit': { en: 'Finalize & Provision', ko: '최종 확정 및 프로비전' },
  'onb.one_step': { en: 'One-Step Onboarding', ko: '원스텝 온보딩' },
  'onb.partner_registry': { en: 'Corporate Registry', ko: '기업 등록부' },
  'onb.sync_t24': { en: 'Sync with T24 or upload template.', ko: 'T24과 동기화하거나 템플릿을 업로드하세요.' },
  'onb.core_sync': { en: 'Core Sync', ko: '코어 동기화' },
  'onb.manual': { en: 'Manual', ko: '수동' },
  'onb.ops_accelerator': { en: 'Operations Accelerator', ko: '운영 가속기' },
  'onb.extracting': { en: 'Extracting Data...', ko: '데이터 추출 중...' },
  'onb.legal_entity': { en: 'Legal Entity Name', ko: '법인명' },
  'onb.tax_id': { en: 'Tax Identification (NPWP)', ko: '납세자 번호 (NPWP)' },
  'onb.hq_address': { en: 'Registered HQ Address', ko: '등록 본사 주소' },
  'onb.next_docs': { en: 'Next: Docs & KYB', ko: '다음: 문서 및 KYB' },
  'onb.kyb_vault': { en: 'KYB Vault', ko: 'KYB 금고' },
  'onb.kyb_desc': { en: 'Upload institutional documents for OJK audit.', ko: 'OJK 감사를 위한 기관 문서를 업로드하세요.' },
  'onb.operational_rails': { en: 'Operational Rails', ko: '운영 레일' },
  'onb.rails_desc': { en: 'Configure technical VA parameters & whitelisting.', ko: 'VA 기술 매개변수 및 화이트리스트를 구성하세요.' },
  'onb.suggested_prefix': { en: 'Suggested VA Prefix', ko: '추천 VA 접두사' },
  'onb.validated_for': { en: 'Validated for', ko: '유효 대상' },
  'onb.sector': { en: 'Sector', ko: '부문' },
  'onb.h2h_whitelist': { en: 'H2H Ingress Whitelist', ko: 'H2H 수신 화이트리스트' },
  'onb.update_profile': { en: 'Update Profile', ko: '프로필 업데이트' },
  'onb.va_technical': { en: 'VA Technical Rails', ko: 'VA 기술 레일' },
  'onb.compliance': { en: 'Compliance & KYB', ko: '컴플라이언스 및 KYB' },
  'onb.h2h_credentials': { en: 'H2H & Credentials', ko: 'H2H 및 자격 증명' },
  'onb.active_rail': { en: 'Active Virtual Rail', ko: '활성 가상 레일' },
  'onb.mother_account': { en: 'Mother Account', ko: '모계좌' },
  'onb.max_daily': { en: 'Max Daily Limit', ko: '일일 최대 한도' },
  'onb.create_subprefix': { en: 'Create New Sub-Prefix', ko: '새 서브 접두사 생성' },
  'onb.whitelisted_ips': { en: 'Whitelisted Ingress IPs', ko: '화이트리스트 수신 IP' },
  'onb.add_h2h': { en: 'Add H2H Entry', ko: 'H2H 항목 추가' },
  'onb.view_document': { en: 'View Document', ko: '문서 보기' },
  'onb.credential_guard': { en: 'Credential Guard', ko: '자격 증명 가드' },
  'onb.rotate_secret': { en: 'Rotate Secret', ko: '시크릿 갱신' },
  'onb.merchant_rsa': { en: 'Corporate RSA Public Key', ko: '기업 RSA 공개 키' },
  'onb.copilot': { en: 'Copilot', ko: '코파일럿' },
  'onb.back': { en: 'Back', ko: '뒤로' },
  'onb.next_va_rails': { en: 'Next: VA Rails', ko: '다음: VA 레일' },
  'onb.total_tx': { en: 'Total Tx', ko: '총 거래' },
  'onb.fee': { en: 'Fee', ko: '수수료' },
  'onb.cashback': { en: 'Cashback', ko: '캐시백' },
  'onb.connection': { en: 'Connection', ko: '연결' },

  // Transactions
  'tx.title': { en: 'Transactions', ko: '거래' },
  'tx.subtitle': { en: 'Complete VA transaction ledger, batch processing, and exception resolution.', ko: 'VA 거래 원장, 일괄 처리, 예외 해결.' },
  'tx.all': { en: 'All Transactions', ko: '전체 거래' },
  'tx.all_desc': { en: 'Complete ledger of VA payment activity across all rails.', ko: '모든 레일에 걸친 VA 결제 활동 전체 원장.' },
  'tx.batch': { en: 'Batch Processing', ko: '일괄 처리' },
  'tx.batch_desc': { en: 'Bulk VA creation and settlement processing.', ko: '대량 VA 생성 및 정산 처리.' },
  'tx.exceptions': { en: 'Exception Manager', ko: '예외 관리' },
  'tx.exception_desc': { en: 'Sentinel flagged anomalies requiring appropriation.', ko: '센티넬이 표시한 이상 항목 처리 필요.' },
  'tx.resolve_all': { en: 'Resolve All Automagically', ko: '자동으로 모두 해결' },
  'tx.all_resolved': { en: 'All Resolved', ko: '모두 해결됨' },
  'tx.live_rails': { en: 'Live Rails Active', ko: '실시간 레일 활성' },
  'tx.reference': { en: 'Reference', ko: '참조' },
  'tx.client': { en: 'Client', ko: '고객' },
  'tx.va_number': { en: 'VA Number', ko: 'VA 번호' },
  'tx.sender': { en: 'Sender', ko: '송신자' },
  'tx.amount': { en: 'Amount', ko: '금액' },
  'tx.type': { en: 'Type', ko: '유형' },
  'tx.status': { en: 'Status', ko: '상태' },
  'tx.date': { en: 'Date', ko: '날짜' },
  'tx.description': { en: 'Description', ko: '설명' },
  'tx.action': { en: 'Action', ko: '작업' },
  'tx.new_batch': { en: 'New Batch', ko: '새 배치' },
  'tx.filename': { en: 'Filename', ko: '파일명' },
  'tx.count': { en: 'Count', ko: '건수' },
  'tx.download': { en: 'Download', ko: '다운로드' },
  'tx.exception_mgmt': { en: 'Exception Management', ko: '예외 관리' },
  'tx.recommended': { en: 'Recommended', ko: '추천' },
  'tx.appropriate_suspense': { en: 'Appropriate to Suspense Pool', ko: '보류 풀에 적정' },
  'tx.cleared': { en: 'Cleared', ko: '정리 완료' },
  'tx.inbound': { en: 'Inbound', ko: '수신' },
  'tx.receipt': { en: 'Bank XYZ Core Receipt', ko: 'Bank XYZ 코어 영수증' },
  'tx.settled': { en: 'Transaction Settled Successfully', ko: '거래가 성공적으로 정산되었습니다' },
  'tx.failed': { en: 'Transaction Failed', ko: '거래 실패' },
  'tx.channel': { en: 'Channel', ko: '채널' },
  'tx.protocol': { en: 'Protocol', ko: '프로토콜' },
  'tx.print': { en: 'Print', ko: '인쇄' },
  'tx.trace': { en: 'Trace', ko: '추적' },
  'tx.expiry': { en: 'Expiry', ko: '만료일' },
  'tx.node': { en: 'Node', ko: '노드' },
  'tx.ojk_tier': { en: 'OJK Tier', ko: 'OJK 등급' },
  'tx.total_amount': { en: 'Total Amount', ko: '총 금액' },
  'tx.success_rate': { en: 'Success Rate', ko: '성공률' },
  'tx.fee_collected': { en: 'Fee Collected', ko: '수수료 징수' },

  // Treasury / Finance Cockpit
  'fin.title': { en: 'Finance Cockpit', ko: '재무 콕핏' },
  'fin.subtitle': { en: 'Bank XYZ Treasury Intelligence — Real-time Liquidity & Settlement Verification', ko: 'Bank XYZ 재무 인텔리전스 — 실시간 유동성 및 정산 검증' },
  'fin.treasury_active': { en: 'Treasury Node Active', ko: '재무 노드 활성' },
  'fin.liquidity_hub': { en: 'Bank XYZ Liquidity Hub', ko: 'Bank XYZ 유동성 허브' },
  'fin.heatmap': { en: 'Liquidity Stress Forecast', ko: '유동성 스트레스 예측' },
  'fin.heatmap_subtitle': { en: 'Bank-Wide Treasury Health • Unit: IDR (Billions)', ko: '은행 전체 재무 건전성 • 단위: IDR (십억)' },
  'fin.reconciliation': { en: 'Reconciliation & Fee Audit', ko: '대사 및 수수료 감사' },
  'fin.recon_subtitle': { en: 'Bank XYZ Operations Control Desk • Automated Rail Verification', ko: 'Bank XYZ 운영 관제 데스크 • 자동 레일 검증' },
  'fin.copilot': { en: 'Finance Copilot', ko: '재무 코파일럿' },
  'fin.execute_tally': { en: 'Execute Bank XYZ Tally Engine', ko: 'Bank XYZ 대조 엔진 실행' },
  'fin.recon_mcs': { en: 'Reconciliation MCS', ko: '대사 MCS' },
  'fin.from_yesterday': { en: 'from yesterday', ko: '어제 대비' },
  'fin.revenue_assurance': { en: 'Revenue Assurance', ko: '수익 보장' },
  'fin.fee_leakage': { en: 'Potential Fee Leakage Detected', ko: '수수료 유출 가능성 감지' },
  'fin.fees_correct': { en: 'All Fees Correctly Billed', ko: '모든 수수료 정확히 청구됨' },
  'fin.unappropriated': { en: 'Unappropriated Funds', ko: '미배분 자금' },
  'fin.ai_resolutions': { en: 'AI Resolutions Ready', ko: 'AI 해결 준비 완료' },
  'fin.awaiting_clearing': { en: 'Awaiting Clearing Cycle', ko: '청산 주기 대기 중' },
  'fin.review_suspense': { en: 'Review Suspense', ko: '보류 검토' },
  'fin.daily_rail': { en: 'Daily Rail Matching', ko: '일일 레일 매칭' },
  'fin.institution': { en: 'Institution / Narrative', ko: '기관 / 설명' },
  'fin.amount_idr': { en: 'Amount (IDR)', ko: '금액 (IDR)' },
  'fin.mcs_score': { en: 'MCS Score', ko: 'MCS 점수' },
  'fin.suspense_resolver': { en: 'Suspense Resolver', ko: '보류 해결자' },
  'fin.ai_beneficiary': { en: 'AI-Assisted Beneficiary Mapping', ko: 'AI 지원 수익자 매핑' },
  'fin.resolution_ready': { en: 'Resolution Ready', ko: '해결 준비 완료' },
  'fin.unidentified': { en: 'Unidentified Sender', ko: '미확인 송신자' },
  'fin.suggested_target': { en: 'Suggested Target', ko: '추천 대상' },
  'fin.resolve_match': { en: 'Resolve Match', ko: '매칭 해결' },
  'fin.scanning': { en: 'Scanning Patterns...', ko: '패턴 스캔 중...' },
  'fin.revenue_audit': { en: 'Revenue Assurance Audit', ko: '수익 보장 감사' },
  'fin.awaiting_fee': { en: 'Awaiting Fee Engine Trace...', ko: '수수료 엔진 추적 대기 중...' },
  'fin.billed_via': { en: 'Billed via Bank XYZ Engine', ko: 'Bank XYZ 엔진 청구' },
  'fin.neural_calc': { en: 'Neural Calculation', ko: '뉴럴 계산' },
  'fin.leakage_id': { en: 'Leakage Identified', ko: '유출 확인됨' },
  'fin.action_required': { en: 'Action Required', ko: '조치 필요' },
  'fin.patch_fee': { en: 'Patch Fee Engine', ko: '수수료 엔진 패치' },
  'fin.copilot_init': { en: 'Bank XYZ Intelligence initialized. I can execute reconciliation matching, detect fee leakage, or resolve unappropriated suspense funds. How can I help today?', ko: 'Bank XYZ 인텔리전스가 초기화되었습니다. 대사 매칭, 수수료 유출 감지, 미배분 보류 자금 해결을 수행할 수 있습니다. 오늘 무엇을 도와드릴까요?' },
  'fin.neural_active': { en: 'Neural Layer Active', ko: '뉴럴 레이어 활성' },
  'fin.action_proposed': { en: 'Action Proposed', ko: '조치 제안' },
  'fin.confirm_action': { en: 'Confirm Action', ko: '조치 확인' },
  'fin.thinking': { en: 'Thinking...', ko: '생각 중...' },
  'fin.ask_recon': { en: 'Ask for reconciliation or fee audit...', ko: '대사 또는 수수료 감사를 요청하세요...' },
  'fin.normal': { en: 'Normal', ko: '정상' },
  'fin.caution': { en: 'Caution', ko: '주의' },
  'fin.critical': { en: 'Critical Settlement', ko: '심각한 정산' },
  'fin.balance': { en: 'Balance', ko: '잔액' },
  'fin.proj_inflow': { en: 'Proj. Inflow', ko: '예상 유입' },
  'fin.settlement_out': { en: 'Settlement Out', ko: '정산 유출' },
  'fin.treasury_view': { en: 'Bank XYZ Treasury View', ko: 'Bank XYZ 재무 뷰' },
  'fin.account_pool': { en: 'Bank XYZ Account Pool', ko: 'Bank XYZ 계정 풀' },

  // Developer Portal
  'dev.title': { en: 'Developer Portal', ko: '개발자 포털' },
  'dev.subtitle': { en: 'Bank XYZ SNAP BI Open Banking — Dev Studio for Resilience & Compliance', ko: 'Bank XYZ SNAP BI 오픈 뱅킹 — 복원력 및 컴플라이언스 개발 스튜디오' },
  'dev.ecosystem': { en: 'Developer Ecosystem Active', ko: '개발자 에코시스템 활성' },
  'dev.simulation': { en: 'Simulation', ko: '시뮬레이션' },
  'dev.sdk': { en: 'Resilient SDK', ko: '복원력 SDK' },
  'dev.architect': { en: 'AI Architect', ko: 'AI 아키텍트' },
  'dev.healer': { en: 'Payload Healer', ko: '페이로드 힐러' },
  'dev.credential': { en: 'Credential Guard', ko: '자격 증명 가드' },
  'dev.sentinel': { en: 'Sentinel Monitor', ko: '센티넬 모니터' },

  // Simulation
  'sim.control': { en: 'Simulation Control', ko: '시뮬레이션 제어' },
  'sim.persona': { en: 'Active Persona', ko: '활성 페르소나' },
  'sim.entropy': { en: 'Entropy Level', ko: '엔트로피 수준' },
  'sim.generate': { en: 'Generate Synthetic Stream', ko: '합성 스트림 생성' },
  'sim.telemetry': { en: 'Telemetry Stream', ko: '텔레메트리 스트림' },
  'sim.clear': { en: 'Clear Buffer', ko: '버퍼 초기화' },
  'sim.awaiting': { en: 'Awaiting Stream Data...', ko: '스트림 데이터 대기 중...' },

  // SDK
  'sdk.config': { en: 'SDK Node Configuration', ko: 'SDK 노드 구성' },
  'sdk.sandbox': { en: 'Sandbox', ko: '샌드박스' },
  'sdk.production': { en: 'Production', ko: '프로덕션' },
  'sdk.resilience': { en: 'Resilience Features', ko: '복원력 기능' },
  'sdk.auto_token': { en: 'Auto Token Refresh', ko: '자동 토큰 갱신' },
  'sdk.clock_drift': { en: 'Clock Drift Correction', ko: '시간 편차 보정' },
  'sdk.antasena': { en: 'Antasena Compliance Guard', ko: 'Antasena 컴플라이언스 가드' },
  'sdk.idempotency': { en: 'Idempotency Auto-Retry', ko: '멱등성 자동 재시도' },
  'sdk.execute': { en: 'Execute Resilient Request', ko: '복원력 요청 실행' },
  'sdk.event_log': { en: 'SDK Event Log', ko: 'SDK 이벤트 로그' },
  'sdk.awaiting': { en: 'Awaiting SDK Activity...', ko: 'SDK 활동 대기 중...' },

  // AI Architect
  'ai.brain': { en: 'AI Architect Brain', ko: 'AI 아키텍트 브레인' },
  'ai.active_session': { en: 'Active Session', ko: '활성 세션' },
  'ai.neural_stable': { en: 'Neural Link Stable', ko: '뉴럴 링크 안정' },
  'ai.placeholder': { en: 'Ask about SNAP BI, SDK resilience, or Antasena compliance...', ko: 'SNAP BI, SDK 복원력, Antasena 컴플라이언스에 대해 질문하세요...' },

  // Payload Healer
  'heal.title': { en: 'Payload Healer', ko: '페이로드 힐러' },
  'heal.diagnose': { en: 'Diagnose & Heal Payload', ko: '페이로드 진단 및 치료' },
  'heal.fixes': { en: 'Required Fixes', ko: '필수 수정 사항' },
  'heal.healed': { en: 'Healed Payload', ko: '치료된 페이로드' },
  'heal.input_desc': { en: 'Input corrupted JSON payload to trigger AI-assisted remediation.', ko: '손상된 JSON 페이로드를 입력하여 AI 지원 복구를 트리거하세요.' },

  // Credential Guard
  'cred.registry': { en: 'SNAP BI Credential Registry', ko: 'SNAP BI 자격 증명 레지스트리' },
  'cred.partner': { en: 'Corporate Entity', ko: '기업 엔티티' },
  'cred.client_id': { en: 'Client ID', ko: '클라이언트 ID' },
  'cred.expires': { en: 'Expires In', ko: '만료' },
  'cred.actions': { en: 'Actions', ko: '작업' },
  'cred.rotate': { en: 'Rotate', ko: '갱신' },
  'cred.rsa_validator': { en: 'RSA Key Validator', ko: 'RSA 키 검증기' },
  'cred.paste_rsa': { en: 'Paste RSA-2048 Public Key in PEM format...', ko: 'RSA-2048 공개 키를 PEM 형식으로 붙여넣기...' },
  'cred.validate': { en: 'Validate Key Compliance', ko: '키 컴플라이언스 검증' },
  'cred.ip_risk': { en: 'IP Risk Intelligence', ko: 'IP 위험 인텔리전스' },
  'cred.enter_ip': { en: 'Enter IP address to analyze...', ko: '분석할 IP 주소를 입력하세요...' },
  'cred.analyze_ip': { en: 'Analyze IP Threat Level', ko: 'IP 위협 수준 분석' },
  'cred.audit_trail': { en: 'Security Audit Trail', ko: '보안 감사 추적' },

  // Sentinel Monitor
  'sent.nodes_online': { en: 'Nodes Online', ko: '온라인 노드' },
  'sent.avg_latency': { en: 'Avg Latency', ko: '평균 지연 시간' },
  'sent.active_alerts': { en: 'Active Alerts', ko: '활성 알림' },
  'sent.uptime_sla': { en: 'Uptime SLA', ko: '가동 시간 SLA' },
  'sent.uptime': { en: 'Uptime', ko: '가동 시간' },
  'sent.latency': { en: 'Latency', ko: '지연 시간' },
  'sent.alert_feed': { en: 'Alert Feed', ko: '알림 피드' },

  // OJK Reporting
  'ojk.title': { en: 'OJK Regulatory Reporting', ko: 'OJK 규제 보고' },
  'ojk.subtitle': { en: 'Bank XYZ Compliance Dashboard — OJK / Bank Indonesia Regulatory Submissions', ko: 'Bank XYZ 컴플라이언스 대시보드 — OJK / Bank Indonesia 규제 제출' },
  'ojk.compliance_active': { en: 'Compliance Engine Active', ko: '컴플라이언스 엔진 활성' },
  'ojk.report_name': { en: 'Report Name', ko: '보고서명' },
  'ojk.period': { en: 'Period', ko: '기간' },
  'ojk.deadline': { en: 'Deadline', ko: '마감일' },
  'ojk.submission_status': { en: 'Submission Status', ko: '제출 상태' },
  'ojk.generate': { en: 'Generate Report', ko: '보고서 생성' },
  'ojk.download': { en: 'Download', ko: '다운로드' },
  'ojk.submitted': { en: 'Submitted', ko: '제출 완료' },
  'ojk.pending': { en: 'Pending', ko: '보류 중' },
  'ojk.overdue': { en: 'Overdue', ko: '기한 초과' },
  'ojk.draft': { en: 'Draft', ko: '초안' },
  'ojk.monthly_va': { en: 'Monthly VA Transaction Summary', ko: '월간 VA 거래 요약' },
  'ojk.quarterly_aml': { en: 'Quarterly AML/CFT Report', ko: '분기별 AML/CFT 보고서' },
  'ojk.daily_liquidity': { en: 'Daily Liquidity Position Report', ko: '일일 유동성 포지션 보고서' },
  'ojk.annual_audit': { en: 'Annual IT Audit Report', ko: '연간 IT 감사 보고서' },
  'ojk.bi_fast': { en: 'BI-FAST Settlement Report', ko: 'BI-FAST 정산 보고서' },
  'ojk.kyc_compliance': { en: 'KYC Compliance Summary', ko: 'KYC 컴플라이언스 요약' },
  'ojk.fraud_incident': { en: 'Fraud Incident Report', ko: '사기 사건 보고서' },
  'ojk.capital_adequacy': { en: 'Capital Adequacy Report', ko: '자본 적정성 보고서' },
  'ojk.summary_stats': { en: 'Summary Statistics', ko: '요약 통계' },
  'ojk.total_reports': { en: 'Total Reports', ko: '총 보고서' },
  'ojk.on_time': { en: 'On-Time Rate', ko: '정시 제출률' },
  'ojk.next_deadline': { en: 'Next Deadline', ko: '다음 마감일' },
  'ojk.compliance_score': { en: 'Compliance Score', ko: '컴플라이언스 점수' },

  // Approver System
  'approver.title': { en: 'Approval Queue', ko: '승인 대기열' },
  'approver.pending': { en: 'Pending Approval', ko: '승인 대기' },
  'approver.approved': { en: 'Approved', ko: '승인됨' },
  'approver.rejected': { en: 'Rejected', ko: '거부됨' },
  'approver.approve': { en: 'Approve', ko: '승인' },
  'approver.reject': { en: 'Reject', ko: '거부' },
  'approver.approver': { en: 'Approver', ko: '승인자' },
  'approver.submitted_by': { en: 'Submitted by', ko: '제출자' },
  'approver.role': { en: 'Approver Role', ko: '승인자 역할' },
  'approver.queue': { en: 'Items Pending Review', ko: '검토 대기 항목' },
  'approver.onboarding': { en: 'Onboarding Approval', ko: '온보딩 승인' },
  'approver.transaction': { en: 'Transaction Approval', ko: '거래 승인' },
  'approver.treasury': { en: 'Treasury Approval', ko: '재무 승인' },
  'approver.limit_override': { en: 'Limit Override Approval', ko: '한도 오버라이드 승인' },

  // Common
  'common.status': { en: 'Status', ko: '상태' },
  'common.amount': { en: 'Amount', ko: '금액' },
  'common.date': { en: 'Date', ko: '날짜' },
  'common.action': { en: 'Action', ko: '작업' },
  'common.search': { en: 'Search...', ko: '검색...' },
  'common.all_systems': { en: 'ALL SYSTEMS NOMINAL', ko: '모든 시스템 정상' },
  'common.control_plane': { en: 'Control Plane', ko: '컨트롤 플레인' },
  'common.inbound': { en: 'Inbound', ko: '인바운드' },
  'common.outbound': { en: 'Outbound', ko: '아웃바운드' },
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
