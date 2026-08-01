import { expect, test } from './fixtures';

test.describe('Basic Toast Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open a toast with default settings', async ({ page }) => {
    await page.click('button:has-text("Show Toast")');
    const toast = page.locator('.ngx-retoast').first();
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass(/toast-success/);
  });

  test('should open different types of toasts', async ({ page }) => {
    // Info
    await page.selectOption('#toastTypeSelect', 'info');
    await page.click('button:has-text("Show Toast")');
    await expect(page.locator('.ngx-retoast').first()).toHaveClass(/toast-info/);
    
    // Warning
    await page.selectOption('#toastTypeSelect', 'warning');
    await page.click('button:has-text("Show Toast")');
    await expect(page.locator('.ngx-retoast').first()).toHaveClass(/toast-warning/);
    
    // Error
    await page.selectOption('#toastTypeSelect', 'error');
    await page.click('button:has-text("Show Toast")');
    await expect(page.locator('.ngx-retoast').first()).toHaveClass(/toast-error/);
  });

  test('should clear the last toast', async ({ page }) => {
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    await expect(page.locator('.ngx-retoast')).toHaveCount(2);
    
    await page.click('button:has-text("Clear Last")');
    await expect(page.locator('.ngx-retoast')).toHaveCount(1);
  });

  test('should clear all toasts', async ({ page }) => {
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    await expect(page.locator('.ngx-retoast')).toHaveCount(2);
    
    await page.click('button:has-text("Clear All Toasts")');
    await expect(page.locator('.ngx-retoast')).toHaveCount(0);
  });
  
  test('should display custom title and message', async ({ page }) => {
    await page.fill('#titleInput', 'Custom Title');
    await page.fill('#messageInput', 'Custom Message');
    await page.click('button:has-text("Show Toast")');
    
    const toast = page.locator('.ngx-retoast').first();
    await expect(toast.locator('.toast-title')).toHaveText('Custom Title');
    await expect(toast.locator('.toast-message')).toHaveText('Custom Message');
  });

  test('should open toasts without animation', async ({ page }) => {
    await page.click('button:has-text("No Animation")');
    const toast = page.locator('.toast-container > div').first();
    await expect(toast).toBeVisible();
  });
});
