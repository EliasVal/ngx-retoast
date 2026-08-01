import { expect, test } from './fixtures';

test.describe('Toast Position Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const positions = [
    { value: 'toast-top-right', class: 'toast-top-right' },
    { value: 'toast-bottom-right', class: 'toast-bottom-right' },
    { value: 'toast-bottom-left', class: 'toast-bottom-left' },
    { value: 'toast-top-left', class: 'toast-top-left' },
    { value: 'toast-top-full-width', class: 'toast-top-full-width' },
    { value: 'toast-bottom-full-width', class: 'toast-bottom-full-width' },
    { value: 'toast-top-center', class: 'toast-top-center' },
    { value: 'toast-bottom-center', class: 'toast-bottom-center' }
  ];

  for (const pos of positions) {
    test(`should position toasts at ${pos.class}`, async ({ page }) => {
      await page.selectOption('#toastPositionSelect', pos.value);
      await page.click('button:has-text("Show Toast")');
      const container = page.locator('.toast-container');
      await expect(container).toHaveClass(new RegExp(pos.class));
    });
  }
});
