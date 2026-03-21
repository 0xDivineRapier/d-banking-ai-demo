


export interface BankTransaction {
  trx_id: string;
  amount: number;
  date: string;
  narrative: string;
  billed_fee: number;
}

export interface ERPInvoice {
  invoice_id: string;
  amount: number;
  date: string;
  vendorName: string;
}

export interface SuspenseItem {
  trx_id: string;
  sender_name: string;
  amount: number;
  timestamp: string;
}

export interface ReconciliationResult {
  bank_trx_id: string;
  invoice_id: string;
  confidence_score: number;
  match_type: 'AUTO' | 'SUGGESTED' | 'EXCEPTION';
  antasena_sector: {
    name: string;
    code: string;
  };
  reasoning: string;
}

export interface FeeAuditResult {
  trx_id: string;
  billed_fee: number;
  calculated_fee: number;
  discrepancy: number;
  status: 'MATCH' | 'LEAKAGE' | 'OVERCHARGE';
  reason: string;
}

export interface SuspenseResolution {
  trx_id: string;
  suggested_beneficiary: string;
  confidence: number;
  rationale: string;
}

export class ReconciliationAgent {
  async reconcile(bankTrxs: BankTransaction[], invoices: ERPInvoice[]): Promise<ReconciliationResult[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mocking the complex matching logic for BSS demo
    return [
      {
        bank_trx_id: 'BSS-BT-001',
        invoice_id: 'BSS-INV-101',
        confidence_score: 0.99,
        match_type: 'AUTO',
        antasena_sector: { name: 'Technology', code: '7020' },
        reasoning: "Exact amount match and vendor name 'Xendit' matches narrative 'XENDIT SETTLEMENT'."
      },
      {
        bank_trx_id: 'BSS-BT-002',
        invoice_id: 'BSS-INV-102',
        confidence_score: 0.95,
        match_type: 'AUTO',
        antasena_sector: { name: 'Finance', code: '6010' },
        reasoning: "Matched by narrative entity extraction and past settlement history."
      },
      {
        bank_trx_id: 'BSS-BT-004',
        invoice_id: 'BSS-INV-104',
        confidence_score: 0.82,
        match_type: 'SUGGESTED',
        antasena_sector: { name: 'Finance', code: '6010' },
        reasoning: "Amount match found, but narrative date has 2-day variance from ERP invoice."
      }
    ];
  }

  async auditFees(transactions: BankTransaction[]): Promise<FeeAuditResult[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        trx_id: 'BSS-BT-001',
        billed_fee: 2500,
        calculated_fee: 2500,
        discrepancy: 0,
        status: 'MATCH',
        reason: "Institutional flat fee standard applied correctly."
      },
      {
        trx_id: 'BSS-BT-004',
        billed_fee: 1250000,
        calculated_fee: 2500000,
        discrepancy: 1250000,
        status: 'LEAKAGE',
        reason: "P2P Settlement rule requires 0.5% (2.5M IDR), but only 0.25% was charged."
      }
    ];
  }

  async resolveSuspense(items: SuspenseItem[]): Promise<SuspenseResolution[]> {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    return [
      {
        trx_id: 'SUS-001',
        suggested_beneficiary: "E-Commerce Escrow Pool",
        confidence: 0.92,
        rationale: "Sender 'Jokul' is a known sub-aggregator for E-Commerce collections."
      },
      {
        trx_id: 'SUS-002',
        suggested_beneficiary: "Hasjrat Multifinance",
        confidence: 0.88,
        rationale: "Entity 'AS-SEDAYA' matches parent group ID for PT. Hasjrat Abadi."
      }
    ];
  }
}
