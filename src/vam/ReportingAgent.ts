export interface ReportResult {
  sql: string;
  explanation: string;
  data: any[];
  chartConfig: {
    type: 'bar' | 'line' | 'pie' | 'table';
    xAxis?: string;
    yAxis?: string;
    label?: string;
    visualization_hint?: string;
  };
}

export class ReportingAgent {
  async queryInsights(userQuery: string, language: 'en' | 'ko' = 'en'): Promise<ReportResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const q = userQuery.toLowerCase();
    const isKo = language === 'ko';

    // Failed / error queries
    if (q.includes('failed') || q.includes('error') || q.includes('실패') || q.includes('오류')) {
      return {
        sql: "SELECT trx_id, status_code, error_message FROM transactions WHERE status_code != '00' LIMIT 5;",
        explanation: isKo
          ? "최근 가상 계좌 거래 실패 5건을 조회했습니다. 서명 오류 및 게이트웨이 타임아웃 항목이 식별되었습니다."
          : "Retrieving the 5 most recent failed Virtual Account transactions.",
        data: [
          { trx_id: 'TX-9901', status_code: '4017300', error_message: isKo ? '서명 오류' : 'Invalid Signature', institution: 'Xendit' },
          { trx_id: 'TX-9904', status_code: '5047300', error_message: isKo ? '게이트웨이 타임아웃' : 'Gateway Timeout', institution: 'Flip' },
          { trx_id: 'TX-9912', status_code: '4017301', error_message: isKo ? '토큰 만료' : 'Token Expired', institution: 'Modalku' }
        ],
        chartConfig: { type: 'table', visualization_hint: isKo ? '실패 로그' : 'Failure Log' }
      };
    }

    // Reconcile / Xendit pending
    if (q.includes('reconcile') || q.includes('대사') || q.includes('xendit') || q.includes('pending')) {
      return {
        sql: "SELECT trx_id, amount, status, matched_invoice FROM transactions WHERE client_id = 'XND' AND status = 'PENDING' LIMIT 5;",
        explanation: isKo
          ? "Xendit의 미처리 거래 3건을 조회했습니다. ERP 인보이스와 자동 대사가 가능합니다."
          : "Found 3 pending transactions for Xendit. Auto-matching to ERP invoices is available.",
        data: [
          { trx_id: 'TX-XND-1201', amount: 'Rp 4,500,000,000', status: isKo ? '대기 중' : 'PENDING', matched_invoice: 'DOZN-INV-101' },
          { trx_id: 'TX-XND-1202', amount: 'Rp 1,200,000,000', status: isKo ? '대기 중' : 'PENDING', matched_invoice: isKo ? '없음' : 'NONE' },
          { trx_id: 'TX-XND-1203', amount: 'Rp 890,000,000',   status: isKo ? '대기 중' : 'PENDING', matched_invoice: 'DOZN-INV-103' },
        ],
        chartConfig: { type: 'table', visualization_hint: isKo ? '대사 대기 항목' : 'Pending Reconciliation' }
      };
    }

    // Fee leakage / H2H
    if (q.includes('fee') || q.includes('leakage') || q.includes('수수료') || q.includes('누수') || q.includes('h2h')) {
      return {
        sql: "SELECT client_id, SUM(billed_fee) as billed, SUM(calculated_fee) as correct, (SUM(billed_fee)-SUM(calculated_fee)) as leakage FROM fee_audit GROUP BY client_id ORDER BY leakage ASC;",
        explanation: isKo
          ? "H2H 레일 전체의 수수료 징수를 분석했습니다. Modalku P2P 레일에서 이상이 감지되었습니다."
          : "Analyzed fee collection across H2H rails. A discrepancy was detected in the Modalku P2P segment.",
        data: [
          { client_id: 'MDK', billed: 'Rp 1,250,000', correct: 'Rp 1,500,000', leakage: isKo ? 'Rp -250,000 ⚠️' : 'Rp -250,000 ⚠️' },
          { client_id: 'XND', billed: 'Rp 2,500', correct: 'Rp 2,500', leakage: isKo ? '✅ 정상' : '✅ OK' },
          { client_id: 'FLP', billed: 'Rp 2,500', correct: 'Rp 2,500', leakage: isKo ? '✅ 정상' : '✅ OK' },
        ],
        chartConfig: { type: 'table', visualization_hint: isKo ? '수수료 감사 결과' : 'Fee Audit Results' }
      };
    }

    // Security / limit audit / Flip
    if (q.includes('security') || q.includes('limit') || q.includes('flip') || q.includes('보안') || q.includes('한도')) {
      return {
        sql: "SELECT client_id, daily_limit, current_usage, ROUND(current_usage/daily_limit*100,1) as util_pct FROM limits WHERE client_id = 'FLP';",
        explanation: isKo
          ? "PT. Flip Indonesia의 보안 한도를 감사했습니다. 일일 한도의 78%가 사용 중입니다."
          : "Audited security limits for PT. Flip Indonesia. Current utilization is at 78% of the daily cap.",
        data: [
          { client_id: 'FLP', daily_limit: 'Rp 5,000,000,000', current_usage: 'Rp 3,900,000,000', util_pct: '78%' },
        ],
        chartConfig: { type: 'table', visualization_hint: isKo ? '한도 감사' : 'Limit Audit' }
      };
    }

    // Default — volume overview
    return {
      sql: "SELECT institution_name, COUNT(*) as volume FROM transactions JOIN clients USING(client_id) GROUP BY 1 ORDER BY volume DESC;",
      explanation: isKo
        ? "오늘 기준 전체 기관 파트너의 거래량 분포를 표시합니다."
        : "Showing volume distribution across all institutional partners for today.",
      data: [
        { institution_name: 'Hasjrat Abadi', volume: 1402 },
        { institution_name: 'Xendit', volume: 890 },
        { institution_name: 'Flip', volume: 450 }
      ],
      chartConfig: { type: 'bar', xAxis: 'institution_name', yAxis: 'volume' }
    };
  }
}
