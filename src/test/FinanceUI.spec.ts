import { test, expect } from '@playwright/test';

test.describe('Finance Cockpit UI', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming the app runs on localhost:5173 and starts at the finance-cockpit or equivalent
    await page.goto('http://localhost:5173/finance-cockpit'); 
  });

  test('should switch between Liquidity Heatmap and Reconciliation tabs', async ({ page }) => {
    // Check if Heatmap is active by default
    await expect(page.locator('text=Liquidity Heatmap')).toBeVisible();
    
    // Switch to Reconciliation
    await page.click('text=ERP Reconciliation');
    await expect(page.locator('text=Execute All Procedures')).toBeVisible();
    
    // Switch back
    await page.click('text=Liquidity Heatmap');
    await expect(page.locator('text=LSI Score')).toBeVisible();
  });

  test('should interact with Finance Copilot', async ({ page }) => {
    const input = page.locator('placeholder="Ask Dozn Global Finance Copilot..."');
    await input.fill('Perform a fee audit');
    await page.keyboard.press('Enter');
    
    // Check for thinking state or response
    await expect(page.locator('text=potential fee leakage')).toBeVisible();
    await expect(page.locator('text=Run full audit')).toBeVisible();
  });

  test('should run reconciliation and show results with XYZ prefix', async ({ page }) => {
    await page.click('text=ERP Reconciliation');
    await page.click('text=Execute All Procedures');
    
    // Wait for results
    await expect(page.locator('text=DOZN-BT-001')).toBeVisible();
    await expect(page.locator('text=DOZN-INV-101')).toBeVisible();
  });
});
