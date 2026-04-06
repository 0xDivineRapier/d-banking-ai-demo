import { describe, it, expect, beforeEach } from 'vitest';
import { FinanceAssistantAgent } from '../vam/FinanceAssistantAgent';

describe('FinanceAssistantAgent', () => {
  let agent: FinanceAssistantAgent;

  beforeEach(() => {
    agent = new FinanceAssistantAgent();
  });

  // ─────────────────────────────────────────────────────────────────
  // SNAP Settlement Buffer — day-specific queries (the reported bug)
  // ─────────────────────────────────────────────────────────────────
  describe('SNAP Settlement Buffer — Saturday query', () => {
    it('responds with a direct informational answer (no action card) for "snap settlement buffer on sat"', async () => {
      const res = await agent.processQuery('what about the snap settlement buffer on sat?');
      // Must NOT trigger an action — user wants info, not a function
      expect(res.action?.type).toBe('NONE');
      expect(res.message).toContain('Saturday');
    });

    it('recognises "saturday" in full as a day match', async () => {
      const res = await agent.processQuery('snap settlement buffer on saturday?');
      expect(res.action?.type).toBe('NONE');
      expect(res.message).toContain('LSI');
    });

    it('recognises "weekend" as a day match', async () => {
      const res = await agent.processQuery('snap weekend settlement buffer');
      expect(res.action?.type).toBe('NONE');
    });

    it('includes a concrete LSI score so the user knows the risk level', async () => {
      const res = await agent.processQuery('snap settlement buffer on sat?');
      expect(res.message).toMatch(/103\.2%|LSI/i);
    });

    it('mentions the Liquidity Heatmap so the user knows where to look visually', async () => {
      const res = await agent.processQuery('snap settlement on saturday');
      expect(res.message.toLowerCase()).toContain('heatmap');
    });

    it('provides suggested follow-up prompts so the conversation can continue', async () => {
      const res = await agent.processQuery('snap buffer saturday');
      expect(res.suggested_prompts.length).toBeGreaterThan(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Action responses — must tell users WHERE results will appear
  // ─────────────────────────────────────────────────────────────────
  describe('Action responses include targetTab hint', () => {
    it('fee audit action targets the reconciliation tab', async () => {
      const res = await agent.processQuery('audit xendit fees');
      expect(res.action?.type).toBe('FEE_AUDIT');
      expect(res.action?.targetTab).toBe('reconciliation');
    });

    it('fee audit message mentions the Reconciliation tab', async () => {
      const res = await agent.processQuery('check for fee leakage');
      expect(res.message.toLowerCase()).toContain('reconciliation');
    });

    it('ERP reconciliation action targets the reconciliation tab', async () => {
      const res = await agent.processQuery('run erp reconciliation');
      expect(res.action?.type).toBe('RECONCILE');
      expect(res.action?.targetTab).toBe('reconciliation');
    });

    it('reconciliation message mentions the Reconciliation tab', async () => {
      const res = await agent.processQuery('match settlement files');
      expect(res.message.toLowerCase()).toContain('reconciliation');
    });

    it('suspense resolution action targets the reconciliation tab', async () => {
      const res = await agent.processQuery('resolve suspense funds');
      expect(res.action?.type).toBe('RESOLVE_SUSPENSE');
      expect(res.action?.targetTab).toBe('reconciliation');
    });

    it('suspense message mentions the Reconciliation tab', async () => {
      const res = await agent.processQuery('unknown transaction in suspense');
      expect(res.message.toLowerCase()).toContain('reconciliation');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Generic liquidity / heatmap queries (no day specified)
  // ─────────────────────────────────────────────────────────────────
  describe('Generic liquidity queries', () => {
    it('responds without an action card when asked about liquidity generally', async () => {
      const res = await agent.processQuery('show me the liquidity forecast');
      expect(res.action?.type).toBe('NONE');
    });

    it('mentions the heatmap in generic liquidity responses', async () => {
      const res = await agent.processQuery('what does the heatmap show?');
      expect(res.message.toLowerCase()).toContain('heatmap');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Default / on-boarding message
  // ─────────────────────────────────────────────────────────────────
  describe('Default greeting', () => {
    it('returns a helpful menu of capabilities for an unrecognised query', async () => {
      const res = await agent.processQuery('hello');
      expect(res.message).toBeTruthy();
      expect(res.suggested_prompts.length).toBeGreaterThan(0);
    });

    it('includes the SNAP Saturday example in default suggested prompts', async () => {
      const res = await agent.processQuery('hello');
      const hasSNAPPrompt = res.suggested_prompts.some(p =>
        p.toLowerCase().includes('snap') || p.toLowerCase().includes('sat')
      );
      expect(hasSNAPPrompt).toBe(true);
    });
  });
});
