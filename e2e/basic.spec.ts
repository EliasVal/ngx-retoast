import { expect, test } from './fixtures';

test.describe('Basic Toast Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open a toast with default settings', async ({ page }) => {
    await page.click('button:has-text("Open Toast")');
    const toast = page.locator('.ngx-toastr').first();
    await expect(toast).toBeVisible();
    await expect(toast).toHaveClass(/toast-success/);
  });

  test('should open different types of toasts', async ({ page }) => {
    // Info
    await page.click('label[for="typeinfo"]');
    await page.click('button:has-text("Open Toast")');
    await expect(page.locator('.ngx-toastr').first()).toHaveClass(/toast-info/);
    
    // Warning
    await page.click('label[for="typewarning"]');
    await page.click('button:has-text("Open Toast")');
    await expect(page.locator('.ngx-toastr').first()).toHaveClass(/toast-warning/);
    
    // Error
    await page.click('label[for="typeerror"]');
    await page.click('button:has-text("Open Toast")');
    await expect(page.locator('.ngx-toastr').first()).toHaveClass(/toast-error/);
  });

  test('should clear the last toast', async ({ page }) => {
    await page.click('button:has-text("Open Toast")');
    await page.click('button:has-text("Open Toast")');
    await expect(page.locator('.ngx-toastr')).toHaveCount(2);
    
    await page.click('button:has-text("Clear Last Toast")');
    await expect(page.locator('.ngx-toastr')).toHaveCount(1);
  });

  test('should clear all toasts', async ({ page }) => {
    await page.click('button:has-text("Open Toast")');
    await page.click('button:has-text("Open Toast")');
    await expect(page.locator('.ngx-toastr')).toHaveCount(2);
    
    await page.click('button:has-text("Clear All Toasts")');
    await expect(page.locator('.ngx-toastr')).toHaveCount(0);
  });
  
  test('should display custom title and message', async ({ page }) => {
    await page.fill('#toastTitle', 'Custom Title');
    await page.fill('#toastMessage', 'Custom Message');
    await page.click('button:has-text("Open Toast")');
    
    const toast = page.locator('.ngx-toastr').first();
    await expect(toast.locator('.toast-title')).toHaveText('Custom Title');
    await expect(toast.locator('.toast-message')).toHaveText('Custom Message');
  });

  test('should open toasts without animation', async ({ page }) => {
    await page.click('button:has-text("No Animations")');
    const toast = page.locator('.toast-container > div').first();
    await expect(toast).toBeVisible();
  });
});
