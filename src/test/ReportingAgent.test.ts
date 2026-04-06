import { describe, it, expect, beforeEach } from 'vitest';
import { ReportingAgent } from '../vam/ReportingAgent';

describe('ReportingAgent', () => {
  let agent: ReportingAgent;

  beforeEach(() => {
    agent = new ReportingAgent();
  });

  // ─────────────────────────────────────────────────────────────────
  // English responses (existing behaviour — must stay working)
  // ─────────────────────────────────────────────────────────────────
  describe('English responses', () => {
    it('returns failed transaction data when asked about errors', async () => {
      const res = await agent.queryInsights('show me failed transactions', 'en');
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0]).toHaveProperty('trx_id');
    });

    it('returns a failure-log table config for error queries', async () => {
      const res = await agent.queryInsights('error report', 'en');
      expect(res.chartConfig.type).toBe('table');
      expect(res.chartConfig.visualization_hint).toBe('Failure Log');
    });

    it('returns reconciliation data for "xendit" queries', async () => {
      const res = await agent.queryInsights('xendit pending', 'en');
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0]).toHaveProperty('matched_invoice');
    });

    it('returns fee audit data for "leakage" queries', async () => {
      const res = await agent.queryInsights('fee leakage audit', 'en');
      const leakRow = res.data.find((r: any) => r.client_id === 'MDK');
      expect(leakRow).toBeDefined();
      expect(leakRow.leakage).toContain('⚠️');
    });

    it('returns limit audit data for "flip" queries', async () => {
      const res = await agent.queryInsights('flip security limit', 'en');
      expect(res.data[0]).toHaveProperty('util_pct');
      expect(res.data[0].util_pct).toBe('78%');
    });

    it('returns bar-chart volume overview as default', async () => {
      const res = await agent.queryInsights('show all volume', 'en');
      expect(res.chartConfig.type).toBe('bar');
    });

    it('default language parameter is "en" (backward-compat)', async () => {
      const res = await agent.queryInsights('show all volume');
      expect(res.explanation).toMatch(/volume distribution/i);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Korean responses (new feature from friend's feedback)
  // ─────────────────────────────────────────────────────────────────
  describe('Korean responses (language = "ko")', () => {
    it('returns a Korean explanation for error queries', async () => {
      const res = await agent.queryInsights('show me failed transactions', 'ko');
      // Korean text will contain Korean Unicode characters
      expect(/[\uAC00-\uD7A3]/.test(res.explanation)).toBe(true);
    });

    it('returns "실패 로그" (Failure Log in Korean) as visualization_hint', async () => {
      const res = await agent.queryInsights('error report', 'ko');
      expect(res.chartConfig.visualization_hint).toBe('실패 로그');
    });

    it('returns a Korean explanation for the default volume query', async () => {
      const res = await agent.queryInsights('show all', 'ko');
      expect(/[\uAC00-\uD7A3]/.test(res.explanation)).toBe(true);
    });

    it('recognises Korean query text for errors — "실패"', async () => {
      const res = await agent.queryInsights('실패한 거래 보여줘', 'ko');
      expect(res.chartConfig.type).toBe('table');
      expect(res.data[0]).toHaveProperty('error_message');
    });

    it('recognises Korean query text for fee — "수수료"', async () => {
      const res = await agent.queryInsights('수수료 감사', 'ko');
      const leakRow = res.data.find((r: any) => r.client_id === 'MDK');
      expect(leakRow).toBeDefined();
    });

    it('returns Korean visualization_hint for reconciliation', async () => {
      const res = await agent.queryInsights('xendit', 'ko');
      expect(res.chartConfig.visualization_hint).toBe('대사 대기 항목');
    });

    it('returns Korean visualization_hint for fee audit', async () => {
      const res = await agent.queryInsights('h2h fee leakage', 'ko');
      expect(res.chartConfig.visualization_hint).toBe('수수료 감사 결과');
    });

    it('returns Korean visualization_hint for limit audit', async () => {
      const res = await agent.queryInsights('flip limit', 'ko');
      expect(res.chartConfig.visualization_hint).toBe('한도 감사');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // SQL is always present (language should not affect query structure)
  // ─────────────────────────────────────────────────────────────────
  describe('SQL field is always populated regardless of language', () => {
    it('English error query has valid SQL', async () => {
      const res = await agent.queryInsights('failed', 'en');
      expect(res.sql).toContain('SELECT');
      expect(res.sql).toContain('status_code');
    });

    it('Korean error query has the same SQL structure', async () => {
      const res = await agent.queryInsights('실패', 'ko');
      expect(res.sql).toContain('SELECT');
      expect(res.sql).toContain('status_code');
    });
  });
});
