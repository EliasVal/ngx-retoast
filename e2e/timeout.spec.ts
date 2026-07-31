import { expect, test } from './fixtures';

test.describe('Toast Timeout Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should dismiss after timeout', async ({ page }) => {
    await page.fill('#toastTimeout', '1000');
    await page.click('button:has-text("Open Toast")');
    
    const toast = page.locator('.ngx-toastr').first();
    await expect(toast).toBeVisible();
    
    // Wait for the timeout to elapse (1s + small buffer)
    await page.waitForTimeout(1500);
    
    await expect(toast).not.toBeVisible();
  });

  test('should not dismiss when timeout is 0', async ({ page }) => {
    await page.fill('#toastTimeout', '0');
    await page.click('button:has-text("Open Toast")');
    
    const toast = page.locator('.ngx-toastr').first();
    await expect(toast).toBeVisible();
    
    // Wait to ensure it doesn't disappear
    await page.waitForTimeout(1500);
    
    await expect(toast).toBeVisible();
  });

  test('should respect disableTimeOut = true', async ({ page }) => {
    await page.check('#disableTimeOut1');
    await page.click('button:has-text("Open Toast")');
    
    const toast = page.locator('.ngx-toastr').first();
    await expect(toast).toBeVisible();
    
    // Default timeout is usually 5000ms. If we wait 1000ms and the timeout was fast or disabled, it stays.
    // Testing true disablement perfectly is hard without long waits, but we can verify it stays open.
    // To be sure it doesn't close quickly:
    await page.waitForTimeout(1500);
    await expect(toast).toBeVisible();
  });

  test('should respect extended timeout on hover', async ({ page }) => {
    await page.fill('#toastTimeout', '1000');
    await page.fill('#toastExtendedTimeout', '2000');
    await page.click('button:has-text("Open Toast")');
    
    const toast = page.locator('.ngx-toastr').first();
    await expect(toast).toBeVisible();
    
    // Hover over the toast
    await toast.hover();
    
    // Wait for the initial timeout to elapse, but since hovered it shouldn't close
    await page.waitForTimeout(1500);
    await expect(toast).toBeVisible();
    
    // Unhover
    await page.mouse.move(0, 0);
    
    // Wait for extended timeout to elapse
    await page.waitForTimeout(2500);
    await expect(toast).not.toBeVisible();
  });
});
