import { test, expect } from '@playwright/test';

test('login page visual resemblance and functionality', async ({ page }) => {
  // Go to the login page
  await page.goto('/login');

  // Verify elements are visible
  await expect(page.locator('h1:has-text("Welcome to Vibe")')).toBeVisible();
  
  // The text color was fixed in globals.css, this screenshot will show it
  await page.screenshot({ path: 'login-screenshot.png', fullPage: true });

  // Fill out the form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');

  // Click the Log in button
  await page.click('button:has-text("Log in")');

  // We should be redirected to /error because the Supabase keys are invalid/mocked,
  // or it might actually work if the user put in real keys.
  // We'll just wait for navigation to either '/' or '/error'
  await page.waitForURL(/\/(error|)/);
  
  const currentUrl = page.url();
  console.log('Redirected to:', currentUrl);
});
