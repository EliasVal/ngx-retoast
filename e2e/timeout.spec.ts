import { expect, test } from './fixtures';

test.describe('Toast Timeout Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should dismiss after duration', async ({ page }) => {
    await page.fill('#durationInput', '1000');
    await page.click('button:has-text("Show Toast")');
    
    const toast = page.locator('.ngx-retoast').first();
    await expect(toast).toBeVisible();
    
    // Wait for the duration to elapse (1s + small buffer)
    await page.waitForTimeout(1500);
    
    await expect(toast).not.toBeVisible();
  });

  test('should not dismiss when duration is 0', async ({ page }) => {
    await page.fill('#durationInput', '0');
    await page.click('button:has-text("Show Toast")');
    
    const toast = page.locator('.ngx-retoast').first();
    await expect(toast).toBeVisible();
    
    // Wait to ensure it doesn't disappear
    await page.waitForTimeout(1500);
    
    await expect(toast).toBeVisible();
  });

  test('should respect resumeDuration on hover', async ({ page }) => {
    await page.fill('#durationInput', '1000');
    await page.fill('#resumeDurationInput', '2000');
    await page.click('button:has-text("Show Toast")');
    
    const toast = page.locator('.ngx-retoast').first();
    await expect(toast).toBeVisible();
    
    // Hover over the toast
    await toast.hover();
    
    // Wait for the initial duration to elapse, but since hovered it shouldn't close
    await page.waitForTimeout(1500);
    await expect(toast).toBeVisible();
    
    // Unhover
    await page.mouse.move(0, 0);
    
    // Wait for resumeDuration to elapse
    await page.waitForTimeout(2500);
    await expect(toast).not.toBeVisible();
  });
});
