const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/network');
  
  // Wait for load
  await page.waitForTimeout(4000);
  
  // Click DEMO MODE button
  await page.click('button:has-text("DEMO MODE")');
  
  // Wait for 3D engine to render and stabilize
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'screenshot_demo.png' });
  await browser.close();
})();
