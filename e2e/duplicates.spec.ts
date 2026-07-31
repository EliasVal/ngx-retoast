import { expect, test } from './fixtures';

test.describe('Duplicate Toasts Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should prevent duplicates', async ({ page }) => {
    await page.check('#preventDuplicates');
    await page.fill('#toastTitle', 'Dup Title');
    await page.fill('#toastMessage', 'Dup Message');
    
    await page.click('button:has-text("Open Toast")');
    await page.click('button:has-text("Open Toast")');
    
    await expect(page.locator('.ngx-toastr')).toHaveCount(1);
  });

  test('should count duplicates', async ({ page }) => {
    await page.check('#preventDuplicates');
    await page.check('#countDuplicates');
    await page.fill('#toastTitle', 'Dup Title');
    await page.fill('#toastMessage', 'Dup Message');
    
    await page.click('button:has-text("Open Toast")');
    await page.click('button:has-text("Open Toast")');
    await page.click('button:has-text("Open Toast")');
    
    const title = page.locator('.toast-title').first();
    await expect(title).toContainText('[3]');
  });

  test('should include title in duplicate checks', async ({ page }) => {
    await page.check('#preventDuplicates');
    await page.check('#includeTitleDuplicate');
    
    // Toast 1
    await page.fill('#toastTitle', 'Title 1');
    await page.fill('#toastMessage', 'Shared Message');
    await page.click('button:has-text("Open Toast")');

    // Toast 2 - Same message but different title
    await page.fill('#toastTitle', 'Title 2');
    await page.click('button:has-text("Open Toast")');
    
    // Because titles are different and includeTitleDuplicate is true, it shouldn't count as duplicate
    await expect(page.locator('.ngx-toastr')).toHaveCount(2);
  });
});
