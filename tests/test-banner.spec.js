const { test, expect } = require('@playwright/test');

test('Test banner appears only on preview/local', async ({ page }) => {
  // Localhost test
  await page.goto('http://localhost:3000');
  await expect(page.locator('#test-banner')).toHaveClass(/active/);

  // GitHub Pages test (replace with your actual GH Pages URL if different)
  await page.goto('https://mrobinson102.github.io/toysbeforebed/');
  await expect(page.locator('#test-banner')).toHaveClass(/active/);

  // Production domain test
  await page.goto('https://toysbeforebed.com/');
  await expect(page.locator('#test-banner')).not.toHaveClass(/active/);
});
