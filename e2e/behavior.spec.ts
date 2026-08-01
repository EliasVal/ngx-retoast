import { expect, test } from './fixtures';

test.describe('Toast Behavior Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render HTML when enableHtml is true', async ({ page }) => {
    await page.check('#enableHtml');
    await page.fill('#messageInput', '<b>Bold Message</b>');
    await page.click('button:has-text("Show Toast")');
    
    const toastMessage = page.locator('.toast-message');
    await expect(toastMessage.locator('b')).toBeVisible();
    await expect(toastMessage.locator('b')).toHaveText('Bold Message');
  });

  test('should show close button', async ({ page }) => {
    await page.check('#closeButton');
    await page.click('button:has-text("Show Toast")');
    
    const closeBtn = page.locator('.toast-close-button');
    await expect(closeBtn).toBeVisible();
    
    await closeBtn.click();
    await expect(page.locator('.ngx-retoast')).toHaveCount(0);
  });

  test('should tap to dismiss', async ({ page }) => {
    await page.check('#tapToDismiss');
    await page.click('button:has-text("Show Toast")');
    
    const toast = page.locator('.ngx-retoast').first();
    await toast.click();
    await expect(toast).not.toBeVisible();
  });
  
  test('should not dismiss on tap when tapToDismiss is false', async ({ page }) => {
    await page.uncheck('#tapToDismiss');
    await page.click('button:has-text("Show Toast")');
    
    const toast = page.locator('.ngx-retoast').first();
    await toast.click();
    await expect(toast).toBeVisible();
  });
  
  test('should respect newestOnTop', async ({ page }) => {
    // Enable newestOnTop
    await page.check('#newestOnTop');
    
    // Disable random quotes and set explicit title
    await page.fill('#titleInput', 'First');
    await page.fill('#messageInput', 'Message 1');
    await page.click('button:has-text("Show Toast")');
    
    await page.fill('#titleInput', 'Second');
    await page.fill('#messageInput', 'Message 2');
    await page.click('button:has-text("Show Toast")');
    
    const toasts = page.locator('.toast-title');
    await expect(toasts.nth(0)).toHaveText('Second');
    await expect(toasts.nth(1)).toHaveText('First');
  });
  
  test('should display progress bar', async ({ page }) => {
    await page.check('#progressBar');
    await page.click('button:has-text("Show Toast")');
    await expect(page.locator('.toast-progress')).toBeVisible();
  });

  test('should limit maximum toasts displayed', async ({ page }) => {
    const input = page.locator('#maxOpenedInput');
    await input.fill('2');
    await input.press('Enter');
    
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    await page.click('button:has-text("Show Toast")');
    
    // Even though we clicked 3 times, max opened is 2
    await expect(page.locator('.ngx-retoast.toast-in')).toHaveCount(2);
  });

  test('should auto dismiss on max', async ({ page }) => {
    const input = page.locator('#maxOpenedInput');
    await input.fill('2');
    await input.press('Enter');
    await page.check('#autoDismissToggle');
    
    await page.fill('#titleInput', 'Toast 1');
    await page.fill('#messageInput', 'Toast 1');
    await page.click('button:has-text("Show Toast")');

    await page.fill('#titleInput', 'Toast 2');
    await page.fill('#messageInput', 'Toast 2');
    await page.click('button:has-text("Show Toast")');

    await page.fill('#titleInput', 'Toast 3');
    await page.fill('#messageInput', 'Toast 3');
    await page.click('button:has-text("Show Toast")');
    
    await expect(page.locator('.ngx-retoast')).toHaveCount(2);
    // Toast 1 should be gone, only 2 and 3 should remain
    // Note: If newestOnTop is true (default), Toast 3 will be first
    await expect(page.locator('.toast-title').first()).toHaveText('Toast 3');
    await expect(page.locator('.toast-title').nth(1)).toHaveText('Toast 2');
  });
});
