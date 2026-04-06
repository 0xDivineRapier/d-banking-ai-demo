export interface AssistantAction {
  type: 'RECONCILE' | 'FEE_AUDIT' | 'RESOLVE_SUSPENSE' | 'NONE';
  summary: string;
  targetTab?: 'reconciliation' | 'heatmap';
  parameters?: Record<string, any>;
}

export interface AssistantResponse {
  message: string;
  action?: AssistantAction;
  suggested_prompts: string[];
}

export class FinanceAssistantAgent {
  async processQuery(query: string): Promise<AssistantResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const q = query.toLowerCase();

    // --- SNAP Settlement Buffer + day-specific queries ---
    const isSnapQuery     = q.includes('snap') || q.includes('settlement buffer');
    const isDayQuery      = q.includes('sat') || q.includes('saturday') || q.includes('weekend') || q.includes('토요일') || q.includes('주말');
    const isLiquidityQ   = q.includes('liquidity') || q.includes('heatmap') || q.includes('유동성') || q.includes('buffer') || q.includes('forecast');

    if (isSnapQuery && isDayQuery) {
      return {
        message: `📊 **SNAP Settlement Buffer — Saturday Outlook**\n\nBased on the current 7-day Liquidity Stress Index (LSI) forecast:\n\n• **Saturday (Day+3):** LSI Score is projected at **103.2%** — a **Settlement Shortfall** condition. Projected outflows exceed the current balance by approximately **Rp 1.8B**.\n\n• **Root cause:** Weekend batch settlement volume from H2H partners exceeds the pre-funded buffer.\n\n• **Recommended action:** Pre-fund the SNAP Settlement Buffer by Friday EOD to absorb Saturday's net settlement obligations.\n\nYou can see the full breakdown highlighted in red in the **Liquidity Heatmap** on the left — look for the SNAP row, Day+3 column.`,
        action: { type: 'NONE', summary: '' },
        suggested_prompts: ['Show full 7-day forecast', 'Audit all settlement accounts', 'Run reconciliation']
      };
    }

    if (isLiquidityQ && !isSnapQuery) {
      return {
        message: `The Liquidity Heatmap on the left shows your 7-day stress projection across **6 account pools**.\n\nCurrently:\n• 🔴 **SNAP Settlement Buffer** — high utilization Saturday (Day+3)\n• 🟡 **BI-RTGS Reserve** — caution on Day+5\n• 🟢 All other accounts — within normal range\n\nHover over any cell for balance, inflow, and outflow detail.`,
        action: { type: 'NONE', summary: '' },
        suggested_prompts: ['SNAP settlement buffer on Sat?', 'Run fee audit', 'Resolve suspense funds']
      };
    }

    // --- Fee audit ---
    if (q.includes('audit') || q.includes('fee') || q.includes('leakage') || q.includes('수수료') || q.includes('감사')) {
      return {
        message: "I've analyzed your recent Virtual Account settlements. I detect a potential fee leakage in the **P2P lending segment** (Modalku). Would you like me to run a full fee audit against your SNAP contracts?\n\n✅ **Results will load in the Reconciliation tab** (Revenue Assurance panel on the right).",
        action: {
          type: 'FEE_AUDIT',
          summary: 'Institutional Fee Audit — P2P lending segment',
          targetTab: 'reconciliation'
        },
        suggested_prompts: ['Run full audit', 'Show leakage details', 'Export report']
      };
    }

    // --- ERP Reconciliation ---
    if (q.includes('recon') || q.includes('match') || q.includes('erp') || q.includes('대사') || q.includes('매칭')) {
      return {
        message: "I see **4 unmapped settlement files** from the last 24 hours. My probabilistic engine suggests a **98% match rate** for 3 of them. Should we proceed with automated ERP reconciliation?\n\n✅ **Results will load in the Reconciliation tab** — Daily Rail Matching table.",
        action: {
          type: 'RECONCILE',
          summary: 'Smart ERP Reconciliation — 4 pending files',
          targetTab: 'reconciliation'
        },
        suggested_prompts: ['Start reconciliation', 'View unmatched files', 'Manual override']
      };
    }

    // --- Suspense resolution ---
    if (q.includes('suspense') || q.includes('unknown') || q.includes('resolve') || q.includes('미확인') || q.includes('보류')) {
      return {
        message: "There are currently **2 transactions** in the suspense account requiring beneficiary identification. Based on past behavior patterns, I've identified probable targets with high confidence. Shall we resolve them?\n\n✅ **Results will load in the Reconciliation tab** — Suspense Resolver section at the bottom.",
        action: {
          type: 'RESOLVE_SUSPENSE',
          summary: 'Suspense Account Resolution — 2 items',
          targetTab: 'reconciliation'
        },
        suggested_prompts: ['Identify targets', 'View rationale', 'Hold transactions']
      };
    }

    // --- Default greeting ---
    return {
      message: "I am your **Dozn Global Finance Copilot**. Here's what I can help with:\n\n• 📊 **Liquidity** — Ask about specific accounts or days (e.g. \"SNAP settlement buffer on Sat?\")\n• 💰 **Fee Audits** — Detect and recover fee leakage across rails\n• 🔁 **ERP Reconciliation** — Auto-match settlement files to invoices\n• 🔍 **Suspense Resolution** — Identify and clear uncleared funds\n\nHow can I assist your treasury operations today?",
      suggested_prompts: ['SNAP settlement buffer on Sat?', 'Audit Xendit fees', 'Resolve suspense funds']
    };
  }
}
