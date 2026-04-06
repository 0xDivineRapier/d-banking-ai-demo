import { describe, it, expect } from 'vitest';
import { ReconciliationAgent } from '../vam/ReconciliationAgent';

describe('ReconciliationAgent', () => {
  const agent = new ReconciliationAgent();

  it('should reconcile and use XYZ prefix', async () => {
    const results = await agent.reconcile([], []);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].bank_trx_id).toContain('DOZN-');
  });

  it('should audit fees and find leakage', async () => {
    const results = await agent.auditFees([]);
    const leakage = results.find(r => r.status === 'LEAKAGE');
    expect(leakage).toBeDefined();
    expect(leakage?.discrepancy).toBeGreaterThan(0);
  });

  it('should resolve suspense items', async () => {
    const results = await agent.resolveSuspense([]);
    expect(results.length).toEqual(2);
    expect(results[0].rationale).toContain('known sub-aggregator');
  });
});
