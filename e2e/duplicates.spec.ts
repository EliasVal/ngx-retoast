import { expect, test } from './fixtures';

test.describe('Duplicate Toasts Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should prevent duplicates', async ({ page }) => {
    await page.check('#preventDuplicates');
    await page.fill('#titleInput', 'Dup Title');
    await page.fill('#messageInput', 'Dup Message');
    
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    
    await expect(page.locator('.ngx-retoast')).toHaveCount(1);
  });

  test('should count duplicates', async ({ page }) => {
    await page.check('#preventDuplicates');
    await page.check('#countDuplicates');
    await page.fill('#titleInput', 'Dup Title');
    await page.fill('#messageInput', 'Dup Message');
    
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    
    const title = page.locator('.toast-title').first();
    await expect(title).toContainText('[3]');
  });

  test('should include title in duplicate checks', async ({ page }) => {
    await page.check('#preventDuplicates');
    await page.check('#duplicateTitleCheck');
    
    // Toast 1
    await page.fill('#titleInput', 'Title 1');
    await page.fill('#messageInput', 'Shared Message');
    await page.click('button:has-text("Show Toast")');

    // Toast 2 - Same message but different title
    await page.fill('#titleInput', 'Title 2');
    await page.click('button:has-text("Show Toast")');
    
    // Because titles are different and includeTitleDuplicate is true, it shouldn't count as duplicate
    await expect(page.locator('.ngx-retoast')).toHaveCount(2);
  });
});
