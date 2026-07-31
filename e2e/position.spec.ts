import { expect, test } from './fixtures';

test.describe('Toast Position Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const positions = [
    { id: 'toast-top-right', class: 'toast-top-right' },
    { id: 'toast-bottom-right', class: 'toast-bottom-right' },
    { id: 'toast-bottom-left', class: 'toast-bottom-left' },
    { id: 'toast-top-left', class: 'toast-top-left' },
    { id: 'top-full-width', class: 'toast-top-full-width' },
    { id: 'bottom-full-width', class: 'toast-bottom-full-width' },
    { id: 'toast-top-center', class: 'toast-top-center' },
    { id: 'toast-bottom-center', class: 'toast-bottom-center' }
  ];

  for (const pos of positions) {
    test(`should position toasts at ${pos.class}`, async ({ page }) => {
      await page.click(`label[for="${pos.id}"]`);
      await page.click('button:has-text("Open Toast")');
      const container = page.locator('.toast-container');
      await expect(container).toHaveClass(new RegExp(pos.class));
    });
  }
});
